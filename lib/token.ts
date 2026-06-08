import jwt from 'jsonwebtoken';

const SECRET = process.env.MAGIC_LINK_SECRET!;

export interface MagicLinkPayload {
  matchId: string;
  clientId: string;        // the client who receives the match
  candidateId: string;     // the candidate being suggested
  email: string;           // client's email
  expiresAt: number;       // unix timestamp
}

/**
 * Generate a signed JWT token for the magic link
 */
export function generateMagicToken(payload: MagicLinkPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

/**
 * Verify and decode a magic token
 * Returns null if invalid or expired — never throws
 */
export function verifyMagicToken(token: string): MagicLinkPayload | null {
  try {
    return jwt.verify(token, SECRET) as MagicLinkPayload;
  } catch {
    return null;
  }
}

/**
 * Build the full magic link URL
 */
export function buildMagicLink(token: string): string {
  const baseUrl = process.env.NEXTAUTH_URL;
  
  if (!baseUrl) {
    throw new Error('NEXTAUTH_URL environment variable is required for magic links');
  }
  
  return `${baseUrl}/match/${token}`;
}
