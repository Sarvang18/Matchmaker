'use client';

import { useState } from 'react';
import type { Client } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ResponseButtons } from './ResponseButtons';
import { ResponseConfirmation } from './ResponseConfirmation';

interface PortalProfileProps {
  token: string;
  matchId: string;
  clientFirstName: string;
  candidate: Client;
  introEmail: string;
  alreadyResponded: boolean;
  responseStatus: string;
}

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
 * Format enum values to human-readable
 */
function formatEnum(value: string): string {
  return value
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}

export function PortalProfile({
  token,
  matchId,
  clientFirstName,
  candidate,
  introEmail,
  alreadyResponded,
  responseStatus,
}: PortalProfileProps) {
  const [responded, setResponded] = useState(alreadyResponded);
  const [response, setResponse] = useState<'INTERESTED' | 'NOT_INTERESTED' | null>(
    alreadyResponded ? (responseStatus as any) : null
  );

  const age = calculateAge(candidate.dateOfBirth);
  const fullName = `${candidate.firstName} ${candidate.lastName}`;

  const handleResponse = async (responseType: 'INTERESTED' | 'NOT_INTERESTED') => {
    try {
      const res = await fetch(`/api/matches/${matchId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, response: responseType }),
      });

      if (res.ok) {
        setResponded(true);
        setResponse(responseType);
      } else {
        const data = await res.json();
        alert(data.error || 'Something went wrong');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  if (responded && response) {
    return <ResponseConfirmation response={response} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-8 text-center shadow-sm">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
            BYvowed
          </h1>
        </div>
        <p className="text-gray-600 text-sm tracking-wide">
          MATCHMAKING · CURATED FOR YOU
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Hi {clientFirstName} 👋
          </h2>
          <p className="text-gray-600">
            Your matchmaker has found a potential match for you
          </p>
        </div>

        {/* Candidate Profile */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 mb-6">
          {/* Avatar and Name */}
          <div className="flex flex-col items-center text-center mb-6">
            <Avatar className="w-20 h-20 mb-4 ring-4 ring-red-100">
              <AvatarImage src={candidate.photoUrl || undefined} />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-red-500 to-pink-600 text-white">
                {candidate.firstName[0]}{candidate.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
              {fullName}
            </h3>
            <p className="text-gray-600">
              {age} years · {candidate.city}
            </p>
          </div>

          {/* Details Grid */}
          <div className="space-y-4">
            {/* Profession */}
            <div className="bg-red-50 rounded-lg p-4 border border-red-100">
              <div className="text-sm text-red-600 mb-1 font-semibold">Profession</div>
              <div className="font-medium text-gray-900">
                {candidate.designation}
              </div>
              <div className="text-sm text-gray-600">at {candidate.currentCompany}</div>
            </div>

            {/* Education */}
            <div className="bg-pink-50 rounded-lg p-4 border border-pink-100">
              <div className="text-sm text-pink-600 mb-1 font-semibold">Education</div>
              <div className="font-medium text-gray-900">{candidate.degree}</div>
              <div className="text-sm text-gray-600">{candidate.undergradCollege}</div>
            </div>

            {/* About */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-600 mb-2 font-semibold">About</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Religion:</span>{' '}
                  <span className="font-medium text-gray-900">{candidate.religion}</span>
                </div>
                <div>
                  <span className="text-gray-600">Caste:</span>{' '}
                  <span className="font-medium text-gray-900">{candidate.caste}</span>
                </div>
                <div>
                  <span className="text-gray-600">Family:</span>{' '}
                  <span className="font-medium text-gray-900">{formatEnum(candidate.familyType)} family</span>
                </div>
                <div>
                  <span className="text-gray-600">Wants kids:</span>{' '}
                  <span className="font-medium text-gray-900">{formatEnum(candidate.wantKids)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Open to relocate:</span>{' '}
                  <span className="font-medium text-gray-900">{formatEnum(candidate.openToRelocate)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Dietary:</span>{' '}
                  <span className="font-medium text-gray-900">{formatEnum(candidate.dietaryPreference)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Matchmaker's Note */}
        {introEmail && (
          <div className="mb-8">
            <div className="text-center text-sm text-gray-500 mb-3" style={{ fontFamily: 'Georgia, serif' }}>
              ── A note from your matchmaker ──
            </div>
            <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-6">
              <p className="text-gray-700 italic leading-relaxed whitespace-pre-line">
                {introEmail}
              </p>
            </div>
          </div>
        )}

        {/* Response Section */}
        <div className="mb-8">
          <div className="text-center text-sm text-gray-500 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            ── How do you feel? ──
          </div>
          <ResponseButtons onRespond={handleResponse} />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-100 px-6 py-6 text-center mt-12">
        <p className="text-gray-500 text-xs">
          © 2024 BYvowed · Crafting meaningful connections
        </p>
      </div>
    </div>
  );
}
