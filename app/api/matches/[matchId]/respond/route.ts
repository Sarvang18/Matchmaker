import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyMagicToken } from '@/lib/token';
import { z } from 'zod';

const respondSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  response: z.enum(['INTERESTED', 'NOT_INTERESTED']),
});

/**
 * POST /api/matches/[matchId]/respond
 * Public endpoint - client submits response via magic link
 */
export async function POST(
  request: Request,
  { params }: { params: { matchId: string } }
) {
  try {
    const body = await request.json();
    const validation = respondSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error },
        { status: 400 }
      );
    }

    const { token, response } = validation.data;

    // Verify magic token
    const payload = verifyMagicToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    // Verify matchId matches token
    if (payload.matchId !== params.matchId) {
      return NextResponse.json(
        { error: 'Token does not match this match' },
        { status: 400 }
      );
    }

    // Fetch match
    const match = await prisma.match.findUnique({
      where: { id: params.matchId },
    });

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    // Check if already responded
    if (match.respondedAt) {
      return NextResponse.json(
        { error: 'Already responded' },
        { status: 409 }
      );
    }

    // Update match status
    await prisma.match.update({
      where: { id: params.matchId },
      data: {
        status: response,
        respondedAt: new Date(),
      },
    });

    // Check for mutual interest
    if (response === 'INTERESTED') {
      // Find if there's a reverse match (the other person also received this person)
      const reverseMatch = await prisma.match.findFirst({
        where: {
          clientId: match.matchedWithId, // The candidate received
          matchedWithId: match.clientId,  // The client as candidate
          status: 'INTERESTED',           // And they're also interested
        },
      });

      if (reverseMatch) {
        // MUTUAL INTEREST! Update both clients' status
        if (process.env.NODE_ENV === 'development') {
          console.log('💚 Mutual interest detected between clients');
        }
        
        await prisma.client.update({
          where: { id: match.clientId },
          data: { status: 'MUTUAL_INTEREST' },
        });

        await prisma.client.update({
          where: { id: match.matchedWithId },
          data: { status: 'MUTUAL_INTEREST' },
        });
      } else {
        // Just interested, not mutual yet
        await prisma.client.update({
          where: { id: match.clientId },
          data: { status: 'MATCH_SENT' },
        });
      }
    } else {
      // Not interested - keep as MATCH_SENT
      await prisma.client.update({
        where: { id: match.clientId },
        data: { status: 'MATCH_SENT' },
      });
    }

    return NextResponse.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error('Error processing response:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
