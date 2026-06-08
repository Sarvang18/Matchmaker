import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Client, AILabel } from '@prisma/client';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface ScoredCandidate {
  client: Client;
  totalScore: number;
  label: AILabel;
  dimensionScores: Array<{
    name: string;
    weight: number;
    score: number;
    contribution: number;
  }>;
}

export interface AIRankedMatch {
  matchedWithId: string;
  aiScore: number;
  aiLabel: AILabel;
  aiExplanation: string;
}

/**
 * Calculate age from date of birth
 */
function calculateAge(dob: Date | string): number {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

/**
 * Format enum values to human-readable text
 */
function formatEnum(value: string): string {
  return value
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Rank matches with AI explanations using Gemini 2.0 Flash
 */
export async function rankMatchesWithAI(
  client: Client,
  scoredCandidates: ScoredCandidate[]
): Promise<AIRankedMatch[]> {
  // Fallback function if Gemini fails
  const fallback = (): AIRankedMatch[] => {
    return scoredCandidates.map(scored => ({
      matchedWithId: scored.client.id,
      aiScore: Math.round(scored.totalScore),
      aiLabel: scored.label,
      aiExplanation: 'Compatible based on shared values and lifestyle preferences.',
    }));
  };

  // Check if API key is configured
  if (!process.env.GEMINI_API_KEY) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ GEMINI_API_KEY not configured - using fallback explanations');
    }
    return fallback();
  }

  try {
    // Rate limiting protection - wait 1 second before calling
    await new Promise(r => setTimeout(r, 1000));

    const clientAge = calculateAge(client.dateOfBirth);

    // Build the prompt
    const candidatesText = scoredCandidates.map((scored, idx) => {
      const candAge = calculateAge(scored.client.dateOfBirth);
      return `
${idx + 1}. ID: ${scored.client.id}
   Name: ${scored.client.firstName} ${scored.client.lastName}
   Score: ${Math.round(scored.totalScore)}/100
   Label: ${scored.label}
   Age: ${candAge}, City: ${scored.client.city}
   Religion: ${scored.client.religion}, Caste: ${scored.client.caste}
   Education: ${scored.client.degree} from ${scored.client.undergradCollege}
   Profession: ${scored.client.designation} at ${scored.client.currentCompany}
   Income: ₹${(scored.client.income / 100000).toFixed(1)} LPA
   Family Type: ${formatEnum(scored.client.familyType)}
   Want Kids: ${formatEnum(scored.client.wantKids)}
   Open to Relocate: ${formatEnum(scored.client.openToRelocate)}
   Dietary: ${formatEnum(scored.client.dietaryPreference)}
   Lifestyle: Drinking: ${formatEnum(scored.client.drinking)}, Smoking: ${formatEnum(scored.client.smoking)}`;
    }).join('\n');

    const prompt = `You are an expert Indian matchmaker with 20 years of experience.

You are reviewing compatibility scores for a client and must provide a brief, warm, professional explanation for each potential match.

CLIENT PROFILE:
Name: ${client.firstName} ${client.lastName}
Age: ${clientAge}
City: ${client.city}
Religion: ${client.religion}, Caste: ${client.caste}
Education: ${client.degree} from ${client.undergradCollege}
Profession: ${client.designation} at ${client.currentCompany}
Income: ₹${(client.income / 100000).toFixed(1)} LPA
Family Type: ${formatEnum(client.familyType)}
Want Kids: ${formatEnum(client.wantKids)}
Open to Relocate: ${formatEnum(client.openToRelocate)}
Dietary: ${formatEnum(client.dietaryPreference)}
Lifestyle: Drinking: ${formatEnum(client.drinking)}, Smoking: ${formatEnum(client.smoking)}

CANDIDATES (scored by compatibility algorithm):
${candidatesText}

For each candidate, provide:
1. A warm, specific 2-3 sentence explanation of WHY they are compatible (mention specific shared values, complementary traits, practical compatibility)
2. Confirm or adjust the label (DREAM/HIGH/COMPATIBLE/LOW) based on your expert judgment

Be specific — mention actual field values, not generic statements. Write from the perspective of a warm Indian matchmaker speaking to a family.

Respond ONLY in this exact JSON format, no markdown, no preamble:
{
  "rankings": [
    {
      "matchedWithId": "string",
      "aiScore": number,
      "aiLabel": "DREAM|HIGH|COMPATIBLE|LOW",
      "aiExplanation": "string"
    }
  ]
}`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        maxOutputTokens: 4000,
        temperature: 0.7,
      },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Strip markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Parse JSON response
    const parsed = JSON.parse(text);

    if (!parsed.rankings || !Array.isArray(parsed.rankings)) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Invalid Gemini response format:', parsed);
      }
      return fallback();
    }

    // Validate and return
    return parsed.rankings.map((ranking: any) => ({
      matchedWithId: ranking.matchedWithId,
      aiScore: ranking.aiScore,
      aiLabel: ranking.aiLabel as AILabel,
      aiExplanation: ranking.aiExplanation,
    }));

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Gemini rankMatchesWithAI error:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      }
    }
    return fallback();
  }
}

/**
 * Generate personalized intro email using Gemini 2.0 Flash
 */
export async function generateIntroEmail(
  client: Client,
  candidate: Client
): Promise<string> {
  const clientAge = calculateAge(client.dateOfBirth);
  const candidateAge = calculateAge(candidate.dateOfBirth);

  // Fallback template
  const fallback = (): string => {
    return `Dear ${client.firstName},

We are delighted to share a potential match with you.

${candidate.firstName} ${candidate.lastName} is a ${candidateAge}-year-old ${candidate.designation} based in ${candidate.city}. They come from a ${candidate.familyType.toLowerCase()} family background and share similar values around ${candidate.wantKids === 'YES' ? 'starting a family' : 'life priorities'}.

We believe this could be a wonderful connection.

Please let us know if you'd like us to arrange an introduction call.

Warm regards,
The Date Crew Team`;
  };

  try {
    const prompt = `You are an expert Indian matchmaker writing a personalised introduction email to share with a client about a potential match.

Write a warm, professional, personalised introduction email that:
- Addresses the client by first name
- Introduces the match by name and key details
- Highlights 3-4 specific compatibility points (use actual data below)
- Mentions shared values or complementary traits
- Ends with a gentle call to action ("Let us know if you'd like us to arrange an introduction call")
- Tone: warm, personal, hopeful — like a trusted family friend writing to you
- Length: 150-200 words
- Do NOT use generic phrases like "we found a great match" — be specific

CLIENT:
Name: ${client.firstName} ${client.lastName}
Age: ${clientAge}, City: ${client.city}
Profession: ${client.designation} at ${client.currentCompany}
Religion: ${client.religion}, Family Type: ${formatEnum(client.familyType)}
${client.bio ? `Interests/Bio: ${client.bio}` : ''}

MATCH:
Name: ${candidate.firstName} ${candidate.lastName}
Age: ${candidateAge}, City: ${candidate.city}
Profession: ${candidate.designation} at ${candidate.currentCompany}
Education: ${candidate.degree} from ${candidate.undergradCollege}
Income: ₹${(candidate.income / 100000).toFixed(1)} LPA
Religion: ${candidate.religion}, Caste: ${candidate.caste}
Family Type: ${formatEnum(candidate.familyType)}
Want Kids: ${formatEnum(candidate.wantKids)}
Open to Relocate: ${formatEnum(candidate.openToRelocate)}

Write ONLY the email body text. No subject line. No markdown. Just the plain email body starting with "Dear ${client.firstName},"`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.8,
      },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    return text || fallback();

  } catch (error) {
    console.error('Gemini generateIntroEmail error:', error);
    return fallback();
  }
}
