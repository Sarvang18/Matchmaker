'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScoreBar } from './ScoreBar';
import { DimensionBars } from './DimensionBars';
import { getInitials, getInitialsColor, calculateAge, formatIncome } from '@/lib/client-utils';
import { Eye, Send } from 'lucide-react';
import Link from 'next/link';
import type { AILabel } from '@prisma/client';

interface DimensionScore {
  name: string;
  weight: number;
  score: number;
  contribution: number;
}

interface MatchCardProps {
  matchId: string;
  candidate: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string | Date;
    city: string;
    gender: string;
    religion: string;
    caste: string;
    currentCompany: string;
    designation: string;
    income: number;
    photoUrl: string | null;
  };
  totalScore: number;
  label: AILabel;
  dimensionScores: DimensionScore[];
  onSendMatch?: () => void;
}

function getLabelConfig(label: AILabel) {
  switch (label) {
    case 'DREAM':
      return {
        text: '✨ Dream Match',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      };
    case 'HIGH':
      return {
        text: '⭐ High Potential',
        className: 'bg-purple-100 text-purple-800 border-purple-300',
      };
    case 'COMPATIBLE':
      return {
        text: '✓ Compatible',
        className: 'bg-teal-100 text-teal-800 border-teal-300',
      };
    case 'LOW':
      return {
        text: 'Low Compatibility',
        className: 'bg-gray-100 text-gray-600 border-gray-300',
      };
  }
}

export function MatchCard({
  matchId,
  candidate,
  totalScore,
  label,
  dimensionScores,
  onSendMatch,
}: MatchCardProps) {
  const fullName = `${candidate.firstName} ${candidate.lastName}`;
  const initials = getInitials(candidate.firstName, candidate.lastName);
  const age = calculateAge(new Date(candidate.dateOfBirth));
  const labelConfig = getLabelConfig(label);

  const handleSendMatch = () => {
    if (label === 'LOW') return;
    if (onSendMatch) {
      onSendMatch();
    } else {
      alert('Send Match feature coming in Phase 5!');
    }
  };

  return (
    <Card className="p-5 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0 ${getInitialsColor(
            fullName
          )}`}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-lg truncate">{fullName}</h3>
          <p className="text-sm text-gray-600">
            {age} years • {candidate.city}
          </p>
        </div>
      </div>

      {/* Score Bar */}
      <div className="mb-3">
        <ScoreBar score={totalScore} />
      </div>

      {/* Label Badge */}
      <div className="mb-4">
        <Badge className={`${labelConfig.className} font-semibold px-3 py-1`}>
          {labelConfig.text}
        </Badge>
      </div>

      {/* Dimension Scores */}
      <div className="mb-4">
        <DimensionBars dimensions={dimensionScores} />
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Company</span>
          <span className="font-medium text-gray-900 truncate ml-2">{candidate.currentCompany}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Designation</span>
          <span className="font-medium text-gray-900 truncate ml-2">{candidate.designation}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Income</span>
          <span className="font-medium text-gray-900">{formatIncome(candidate.income)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Religion</span>
          <span className="font-medium text-gray-900">{candidate.religion}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Caste</span>
          <span className="font-medium text-gray-900 truncate ml-2">{candidate.caste}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={handleSendMatch}
          disabled={label === 'LOW'}
          className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title={label === 'LOW' ? 'Score too low to send' : 'Send this match'}
        >
          <Send className="w-4 h-4 mr-2" />
          Send
        </Button>
        <Link href={`/client/${candidate.id}`} target="_blank">
          <Button variant="outline" className="w-full">
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
        </Link>
      </div>
    </Card>
  );
}
