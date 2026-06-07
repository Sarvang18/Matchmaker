'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PodiumMatches } from './PodiumMatches';
import { RemainingMatches } from './RemainingMatches';
import { MatchHistory } from './MatchHistory';
import { MatchLoadingSteps } from './MatchLoadingSteps';
import { SendMatchModal } from './SendMatchModal';
import { Sparkles, RefreshCw, Loader2, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { AILabel, MatchStatus } from '@prisma/client';

interface DimensionScore {
  name: string;
  weight: number;
  score: number;
  contribution: number;
}

interface Match {
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
  totalScore: number | null;
  label: AILabel | null;
  aiExplanation?: string;
  dimensionScores?: any;
  status: MatchStatus;
  sentAt: string | null;
  respondedAt: string | null;
  createdAt: string;
}

interface MatchesSectionProps {
  clientId: string;
  clientEmail: string;
  clientFirstName: string;
  clientLastName: string;
  clientCity: string;
  clientDesignation: string;
  clientPhotoUrl: string | null;
  existingMatches: Match[];
}

export function MatchesSection({ 
  clientId, 
  clientEmail, 
  clientFirstName,
  clientLastName,
  clientCity,
  clientDesignation,
  clientPhotoUrl,
  existingMatches 
}: MatchesSectionProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [matches, setMatches] = useState<any[]>(existingMatches.filter(m => m.totalScore !== null));
  const [hasRun, setHasRun] = useState(existingMatches.length > 0);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);

  // Sync state when existingMatches prop changes (after router.refresh())
  useEffect(() => {
    const filtered = existingMatches.filter(m => m.totalScore !== null);
    setMatches(filtered);
    if (filtered.length > 0) {
      setHasRun(true);
    }
  }, [existingMatches]);

  const handleFindMatches = async () => {
    setIsLoading(true);
    
    console.log('🔄 Finding matches for client:', clientId);
    console.log('📋 Current matches:', matches.slice(0, 3).map(m => m.candidate?.firstName));

    try {
      // Add timestamp to avoid caching
      const response = await fetch('/api/matches?t=' + Date.now(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Received NEW matches from API:', data.matches.length, 'matches');
        console.log('📊 New Top 3:', data.matches.slice(0, 3).map((m: any) => `${m.candidate.firstName} (${m.totalScore})`));
        setMatches(data.matches); // Update state with NEW matches
        setHasRun(true);
        
        // Wait a moment for state to update before refreshing
        setTimeout(() => {
          router.refresh();
        }, 100);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('❌ Error finding matches:', error);
      alert('Something went wrong while finding matches');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMatch = (match: any) => {
    setSelectedMatch({
      matchId: match.matchId,
      client: {
        id: clientId,
        firstName: clientFirstName,
        lastName: clientLastName,
        email: clientEmail,
        city: clientCity,
        designation: clientDesignation,
        photoUrl: clientPhotoUrl,
      },
      candidate: match.candidate,
      totalScore: match.totalScore,
      label: match.label,
    });
    setSendModalOpen(true);
  };

  const handleModalClose = () => {
    setSendModalOpen(false);
    setSelectedMatch(null);
    
    alert('Match sent successfully! ✓');
    
    router.refresh();
  };

  const displayMatches = matches;

  // Calculate last run time
  const lastRunDate = matches.length > 0 
    ? new Date(matches[0].createdAt || new Date())
    : null;
  const daysAgo = lastRunDate 
    ? Math.floor((new Date().getTime() - lastRunDate.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Split into top 3 and remaining
  const top3Matches = displayMatches.slice(0, 3);
  const remainingMatches = displayMatches.slice(3);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>Suggested Matches</h2>
            <p className="text-sm text-gray-600 mt-0.5">
              {hasRun ? (
                <>
                  {displayMatches.length} profiles found • Scored by compatibility engine
                  {daysAgo !== null && daysAgo > 0 && (
                    <span className="ml-2 text-gray-500">• Last run: {daysAgo} {daysAgo === 1 ? 'day' : 'days'} ago</span>
                  )}
                </>
              ) : (
                'Find compatible matches using our AI-powered compatibility engine'
              )}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleFindMatches}
            disabled={isLoading}
            size="lg"
            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Finding Matches...
              </>
            ) : (
              <>
                {hasRun ? <RefreshCw className="w-4 h-4 mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                {hasRun ? 'Re-run Matches' : 'Find Compatible Matches'}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card className="p-8 bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200">
          <div className="max-w-md mx-auto">
            <MatchLoadingSteps />
          </div>
        </Card>
      )}

      {/* Results - Podium + Accordion */}
      {!isLoading && hasRun && displayMatches.length > 0 && (
        <div className="space-y-8">
          {/* Top 3 Podium */}
          {top3Matches.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>Top 3 Matches</h3>
                <span className="text-sm text-gray-500">• Highest compatibility</span>
              </div>
              <PodiumMatches matches={top3Matches} onSendMatch={handleSendMatch} />
            </div>
          )}

          {/* Remaining Matches Accordion */}
          {remainingMatches.length > 0 && (
            <RemainingMatches matches={remainingMatches} onSendMatch={handleSendMatch} />
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !hasRun && (
        <Card className="text-center py-16 bg-gradient-to-br from-red-50 to-pink-50 border-2 border-dashed border-red-200">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Ready to find compatible matches?
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Our AI-powered matching engine will analyze 8 compatibility dimensions and find the top 20 most compatible profiles.
          </p>
          <Button
            onClick={handleFindMatches}
            size="lg"
            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Find Matches Now
          </Button>
        </Card>
      )}

      {!isLoading && displayMatches.length === 0 && hasRun && (
        <Card className="text-center py-12 bg-gray-50">
          <p className="text-gray-600">No compatible matches found. Try re-running the engine.</p>
        </Card>
      )}

      {/* Match History Section */}
      {displayMatches.length > 0 && (
        <div className="pt-8 border-t">
          <h2 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>Match History</h2>
          <p className="text-sm text-gray-600 mb-6">
            Matches that have been sent to this client
          </p>
          <MatchHistory matches={displayMatches} />
        </div>
      )}

      {/* Send Match Modal */}
      {selectedMatch && (
        <SendMatchModal
          isOpen={sendModalOpen}
          onClose={handleModalClose}
          match={selectedMatch}
        />
      )}
    </div>
  );
}
