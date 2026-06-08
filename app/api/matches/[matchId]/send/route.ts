import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { generateMagicToken, buildMagicLink } from '@/lib/token';
import { sendMatchEmail } from '@/lib/resend';
import { z } from 'zod';

const sendMatchSchema = z.object({
  introEmail: z.string().min(10, 'Intro email is required'),
});

/**
 * Calculate age from date of birth
 */
function calculateAge(dob: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

/**
 * POST /api/matches/[matchId]/send
 * Confirms send, generates magic link, sends real email
 */
export async function POST(
  request: Request,
  { params }: { params: { matchId: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { matchId } = params;

    const body = await request.json();
    const validation = sendMatchSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error },
        { status: 400 }
      );
    }

    const { introEmail } = validation.data;

    // Fetch the match with full client and candidate data
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        client: true,
        matchedWith: true,
      },
    });

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    // Verify the match belongs to a client of this matchmaker
    if (match.client.assignedMatchmakerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Generate magic token
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    const token = generateMagicToken({
      matchId: match.id,
      clientId: match.clientId,
      candidateId: match.matchedWithId,
      email: match.client.email,
      expiresAt,
    });

    const magicLink = buildMagicLink(token);

    // Update database
    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        aiIntroEmail: introEmail,
        status: 'SENT',
        sentAt: new Date(),
        magicToken: token,
        magicTokenExpiresAt: new Date(expiresAt),
      },
    });

    // Update client status
    await prisma.client.update({
      where: { id: match.clientId },
      data: { status: 'MATCH_SENT' },
    });

    // Send email via Resend
    const candidateAge = calculateAge(match.matchedWith.dateOfBirth);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔔 Sending match email to:', match.client.email);
      console.log('   Candidate:', `${match.matchedWith.firstName} ${match.matchedWith.lastName}`);
    }
    
    const emailSent = await sendMatchEmail({
      toEmail: match.client.email,
      toName: match.client.firstName,
      candidateName: `${match.matchedWith.firstName} ${match.matchedWith.lastName}`,
      candidateAge,
      candidateCity: match.matchedWith.city,
      candidateDesignation: match.matchedWith.designation,
      candidateCompany: match.matchedWith.currentCompany,
      magicLink,
      introEmailBody: introEmail,
    });
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Email sent:', emailSent ? 'SUCCESS' : 'FAILED');
    }

    return NextResponse.json({
      success: true,
      emailSent,
      magicLink,
      match: {
        id: updatedMatch.id,
        status: updatedMatch.status,
        sentAt: updatedMatch.sentAt,
      },
    });
  } catch (error) {
    console.error('Error sending match:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
