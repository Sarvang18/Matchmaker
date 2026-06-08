import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { runMatchingEngine } from '@/lib/matching-engine';
import { rankMatchesWithAI } from '@/lib/gemini';
import { z } from 'zod';

const createMatchSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
});

/**
 * POST /api/matches
 * Runs the matching engine for a client and saves top 20 matches
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = createMatchSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error },
        { status: 400 }
      );
    }

    const { clientId } = validation.data;

    // Fetch the client
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Verify client belongs to this matchmaker
    if (client.assignedMatchmakerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete old matches FIRST (before running engine) to ensure fresh results
    await prisma.match.deleteMany({
      where: { clientId },
    });

    // Fetch all opposite gender clients
    const oppositeGender = client.gender === 'MALE' ? 'FEMALE' : 'MALE';
    const candidatePool = await prisma.client.findMany({
      where: {
        gender: oppositeGender,
        id: { not: clientId }, // Exclude the client themselves
      },
    });

    // Run matching engine (no existing matches to exclude since we deleted them)
    const scoredCandidates = runMatchingEngine(client, candidatePool, []);

    // Call Gemini AI to rank matches with explanations
    const aiRankedMatches = await rankMatchesWithAI(client, scoredCandidates);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🤖 Gemini processed', scoredCandidates.length, 'candidates');
      console.log('✨ Returned', aiRankedMatches.length, 'ranked matches');
      if (aiRankedMatches.length > 0) {
        console.log('📝 Sample explanation:', aiRankedMatches[0].aiExplanation.substring(0, 100) + '...');
      }
    }

    // Save new matches to database with AI-enriched data
    const matches = await Promise.all(
      scoredCandidates.map(async (scored, index) => {
        // Find corresponding AI ranking
        const aiRanking = aiRankedMatches.find(
          ai => ai.matchedWithId === scored.client.id
        );

        if (!aiRanking && process.env.NODE_ENV === 'development') {
          console.warn('⚠️ No AI ranking found for candidate:', scored.client.firstName, scored.client.id);
        }

        const match = await prisma.match.create({
          data: {
            clientId,
            matchedWithId: scored.client.id,
            aiScore: aiRanking?.aiScore ?? Math.round(scored.totalScore),
            aiLabel: aiRanking?.aiLabel ?? scored.label,
            aiExplanation: aiRanking?.aiExplanation ?? 'Compatible based on shared values and lifestyle preferences.',
            status: 'SENT',
          },
          include: {
            matchedWith: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                dateOfBirth: true,
                city: true,
                gender: true,
                religion: true,
                caste: true,
                currentCompany: true,
                designation: true,
                income: true,
                photoUrl: true,
              },
            },
          },
        });

        return {
          matchId: match.id,
          candidate: match.matchedWith,
          totalScore: aiRanking?.aiScore ?? Math.round(scored.totalScore),
          label: aiRanking?.aiLabel ?? scored.label,
          aiExplanation: aiRanking?.aiExplanation ?? 'Compatible based on shared values and lifestyle preferences.',
          dimensionScores: scored.dimensionScores,
        };
      })
    );

    // Update client status to ACTIVE if currently ONBOARDED
    if (client.status === 'ONBOARDED') {
      await prisma.client.update({
        where: { id: clientId },
        data: { status: 'ACTIVE' },
      });
    }

    return NextResponse.json({ matches });
  } catch (error) {
    console.error('Error running matching engine:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/matches?clientId=xxx
 * Fetches existing matches for a client from database
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json(
        { error: 'clientId is required' },
        { status: 400 }
      );
    }

    // Verify client belongs to this matchmaker
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { assignedMatchmakerId: true },
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    if (client.assignedMatchmakerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch matches with candidate details
    const matches = await prisma.match.findMany({
      where: { clientId },
      include: {
        matchedWith: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            city: true,
            gender: true,
            religion: true,
            caste: true,
            currentCompany: true,
            designation: true,
            income: true,
            photoUrl: true,
          },
        },
      },
      orderBy: { aiScore: 'desc' },
    });

    const formattedMatches = matches.map(match => ({
      matchId: match.id,
      candidate: match.matchedWith,
      totalScore: match.aiScore,
      label: match.aiLabel,
      aiExplanation: match.aiExplanation,
      dimensionScores: {}, // Empty for now, calculated on demand
      status: match.status,
      sentAt: match.sentAt,
      respondedAt: match.respondedAt,
    }));

    return NextResponse.json({ matches: formattedMatches });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
