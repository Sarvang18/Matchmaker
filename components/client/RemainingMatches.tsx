'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Briefcase, IndianRupee, Send } from 'lucide-react';
import { DimensionBars } from './DimensionBars';

interface RemainingMatch {
  matchId: string;
  candidate: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
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
  label: string;
  dimensionScores: Record<string, number>;
  aiExplanation?: string;
}

interface RemainingMatchesProps {
  matches: RemainingMatch[];
  onSendMatch: (match: RemainingMatch) => void;
}

const getLabelColor = (label: string) => {
  switch (label) {
    case 'DREAM':
      return 'bg-purple-100 text-purple-700 border-purple-300';
    case 'HIGH':
      return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'COMPATIBLE':
      return 'bg-green-100 text-green-700 border-green-300';
    case 'LOW':
      return 'bg-gray-100 text-gray-700 border-gray-300';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300';
  }
};

const calculateAge = (dob: string) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const formatIncome = (income: number) => {
  return `₹${(income / 100000).toFixed(1)} LPA`;
};

export function RemainingMatches({ matches, onSendMatch }: RemainingMatchesProps) {
  if (matches.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
          Other Matches ({matches.length})
        </h3>
        <p className="text-sm text-gray-500">Click to expand details</p>
      </div>

      <Accordion type="single" collapsible className="space-y-3">
        {matches.map((match, idx) => (
          <AccordionItem
            key={match.matchId}
            value={match.matchId}
            className="border rounded-lg bg-white hover:shadow-md transition-shadow"
          >
            <AccordionTrigger className="px-4 py-4 hover:no-underline">
              <div className="flex items-center gap-4 flex-1 text-left">
                {/* Rank Number */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-600">#{idx + 4}</span>
                </div>

                {/* Avatar */}
                <Avatar className="w-12 h-12 flex-shrink-0">
                  <AvatarImage src={match.candidate.photoUrl || undefined} />
                  <AvatarFallback>
                    {match.candidate.firstName[0]}{match.candidate.lastName[0]}
                  </AvatarFallback>
                </Avatar>

                {/* Basic Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {match.candidate.firstName} {match.candidate.lastName}
                    </h4>
                    <Badge variant="outline" className={`${getLabelColor(match.label)} border text-xs flex-shrink-0`}>
                      {match.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{calculateAge(match.candidate.dateOfBirth)} yrs</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {match.candidate.city}
                    </span>
                    <span className="hidden sm:flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {match.candidate.designation}
                    </span>
                  </div>
                </div>

                {/* Score */}
                <div className="flex-shrink-0 text-right">
                  <div className="text-2xl font-bold text-red-600">
                    {Math.round(match.totalScore)}
                  </div>
                  <div className="text-xs text-gray-500">Score</div>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-4">
              <div className="pt-4 border-t space-y-4">
                {/* Score Bar */}
                <div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-pink-600 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${match.totalScore}%` }}
                    />
                  </div>
                </div>

                {/* Detailed Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Briefcase className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <div>
                      <div className="font-medium">{match.candidate.designation}</div>
                      <div className="text-xs text-gray-500">{match.candidate.currentCompany}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <IndianRupee className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <div>
                      <div className="font-medium">{formatIncome(match.candidate.income)}</div>
                      <div className="text-xs text-gray-500">Annual Income</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <div>
                      <div className="font-medium">{match.candidate.religion}</div>
                      <div className="text-xs text-gray-500">{match.candidate.caste}</div>
                    </div>
                  </div>
                </div>

                {/* Dimension Scores */}
                <div className="pt-3 border-t">
                  <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                    Compatibility Breakdown
                  </h5>
                  <DimensionBars scores={match.dimensionScores} compact />
                </div>

                {/* AI Explanation */}
                {match.aiExplanation && (
                  <div className="pt-3 mt-3 border-t">
                    <div className="flex items-start gap-2 p-3 bg-red-50 bg-opacity-50 rounded-lg">
                      <span className="text-base">✨</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-red-700 uppercase">AI Insight</span>
                          <span className="text-xs text-red-500">Gemini</span>
                        </div>
                        <p className="text-xs text-gray-700 italic leading-relaxed">
                          {match.aiExplanation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Send Match Button */}
                {match.label !== 'LOW' && (
                  <div className="pt-3 mt-3">
                    <Button
                      onClick={() => onSendMatch(match)}
                      className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
                      size="sm"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Match
                    </Button>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
