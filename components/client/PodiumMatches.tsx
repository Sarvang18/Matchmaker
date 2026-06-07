'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Award, MapPin, Briefcase, GraduationCap, IndianRupee, Send } from 'lucide-react';
import { DimensionBars } from './DimensionBars';

interface PodiumMatch {
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

interface PodiumMatchesProps {
  matches: PodiumMatch[];
  onSendMatch: (match: PodiumMatch) => void;
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="w-8 h-8 text-yellow-500" />;
    case 2:
      return <Medal className="w-7 h-7 text-slate-400" />;
    case 3:
      return <Award className="w-6 h-6 text-amber-600" />;
    default:
      return null;
  }
};

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

export function PodiumMatches({ matches, onSendMatch }: PodiumMatchesProps) {
  const top3 = matches.slice(0, 3);

  // Reorder for podium effect: 2nd, 1st, 3rd
  const podiumOrder = top3.length >= 2 ? [top3[1], top3[0], top3[2]].filter(Boolean) : top3;

  return (
    <div className="space-y-6">
      {/* Podium Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        {podiumOrder.map((match, idx) => {
          // Map back to actual rank
          const actualRank = idx === 0 ? 2 : idx === 1 ? 1 : 3;
          const heightClass = actualRank === 1 ? 'md:order-2' : actualRank === 2 ? 'md:order-1' : 'md:order-3';
          const scaleClass = actualRank === 1 ? 'md:scale-105' : '';
          const borderClass = actualRank === 1 ? 'border-yellow-300' : actualRank === 2 ? 'border-slate-300' : 'border-amber-200';

          return (
            <Card
              key={match.matchId}
              className={`relative p-6 pt-8 border-2 ${borderClass} ${heightClass} ${scaleClass} transition-all duration-300 hover:shadow-xl`}
            >
              {/* Rank Badge */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-white rounded-full p-3 shadow-lg border-2 border-current">
                {getRankIcon(actualRank)}
              </div>

              {/* Avatar */}
              <div className="flex justify-center mt-4 mb-4">
                <Avatar className="w-24 h-24 ring-4 ring-offset-2 ring-red-200">
                  <AvatarImage src={match.candidate.photoUrl || undefined} />
                  <AvatarFallback className="text-2xl font-semibold">
                    {match.candidate.firstName[0]}{match.candidate.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Name & Age */}
              <div className="text-center mb-3">
                <h3 className="text-xl font-bold text-gray-900">
                  {match.candidate.firstName} {match.candidate.lastName}
                </h3>
                <p className="text-sm text-gray-500">
                  {calculateAge(match.candidate.dateOfBirth)} years • {match.candidate.city}
                </p>
              </div>

              {/* Score */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Match Score</span>
                  <span className="text-2xl font-bold text-red-600">{Math.round(match.totalScore)}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-pink-600 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${match.totalScore}%` }}
                  />
                </div>
              </div>

              {/* Label Badge */}
              <div className="flex justify-center mb-4">
                <Badge variant="outline" className={`${getLabelColor(match.label)} border font-semibold`}>
                  {match.label}
                </Badge>
              </div>

              {/* Key Details */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <GraduationCap className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="truncate">{match.candidate.designation}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Briefcase className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="truncate">{match.candidate.currentCompany}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <IndianRupee className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span>{formatIncome(match.candidate.income)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span>{match.candidate.religion} • {match.candidate.caste}</span>
                </div>
              </div>

              {/* Dimension Scores */}
              <div className="pt-4 border-t">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                  Compatibility Breakdown
                </h4>
                <DimensionBars scores={match.dimensionScores} compact />
              </div>

              {/* AI Explanation */}
              {match.aiExplanation && (
                <div className="pt-4 mt-4 border-t">
                  <div className="flex items-start gap-2 p-3 bg-red-50 bg-opacity-50 rounded-lg">
                    <span className="text-lg">✨</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-red-700 uppercase">AI Insight</span>
                        <span className="text-xs text-red-500">Gemini</span>
                      </div>
                      <p className="text-sm text-gray-700 italic leading-relaxed">
                        {match.aiExplanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Send Match Button */}
              {match.label !== 'LOW' && (
                <div className="pt-4 mt-4 border-t">
                  <Button
                    onClick={() => onSendMatch(match)}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Match
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
