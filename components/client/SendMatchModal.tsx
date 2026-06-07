'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowDownUp, Mail, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SendMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: {
    matchId: string;
    client: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      city: string;
      designation: string;
      photoUrl: string | null;
    };
    candidate: {
      id: string;
      firstName: string;
      lastName: string;
      city: string;
      designation: string;
      photoUrl: string | null;
    };
    totalScore: number;
    label: string;
  };
}

const getLabelColor = (label: string) => {
  switch (label) {
    case 'DREAM':
      return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    case 'HIGH':
      return 'bg-red-100 text-red-700 border-red-300';
    case 'COMPATIBLE':
      return 'bg-green-100 text-green-700 border-green-300';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300';
  }
};

const getLabelText = (label: string) => {
  switch (label) {
    case 'DREAM':
      return '⭐ DREAM MATCH';
    case 'HIGH':
      return '⭐ HIGH POTENTIAL';
    case 'COMPATIBLE':
      return '✓ COMPATIBLE';
    default:
      return label;
  }
};

export function SendMatchModal({ isOpen, onClose, match }: SendMatchModalProps) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [introEmail, setIntroEmail] = useState('');
  const [error, setError] = useState('');
  const [emailReady, setEmailReady] = useState(false);

  const handleOpen = async () => {
    if (emailReady) return; // Already generated

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch(`/api/matches/${match.matchId}/prepare-send`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to generate intro email');
      }

      const data = await response.json();
      setIntroEmail(data.introEmail);
      setEmailReady(true);
    } catch (err: any) {
      setError(err.message);
      // Use fallback
      setIntroEmail(`Dear ${match.client.firstName},

We are delighted to share a potential match with you.

${match.candidate.firstName} ${match.candidate.lastName} is based in ${match.candidate.city} and works as a ${match.candidate.designation}. We believe this could be a wonderful connection.

Please let us know if you'd like us to arrange an introduction call.

Warm regards,
The Date Crew Team`);
      setEmailReady(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSend = async () => {
    setIsSending(true);
    setError('');

    try {
      const response = await fetch(`/api/matches/${match.matchId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ introEmail }),
      });

      if (!response.ok) {
        throw new Error('Failed to send match');
      }

      router.refresh();
      onClose();
      // Show success toast (handled by parent)
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSending(false);
    }
  };

  // Auto-generate when modal opens
  if (isOpen && !emailReady && !isGenerating) {
    handleOpen();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[95vh] flex flex-col gap-0 p-0 bg-white">
        {/* Fixed Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0 bg-white">
          <DialogTitle className="text-2xl font-bold">Send Match</DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 px-6 py-6 bg-white">
          <div className="space-y-6">
            {/* Profile Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Client Card */}
              <div className="flex flex-col items-center p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg border border-red-200">
                <Avatar className="w-16 h-16 mb-2">
                  <AvatarImage src={match.client.photoUrl || undefined} />
                  <AvatarFallback className="bg-red-200">
                    {match.client.firstName[0]}{match.client.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-gray-900 text-center">
                  {match.client.firstName} {match.client.lastName}
                </h3>
                <p className="text-sm text-gray-600">{match.client.city}</p>
                <p className="text-xs text-gray-500">{match.client.designation}</p>
              </div>

              {/* Candidate Card */}
              <div className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <Avatar className="w-16 h-16 mb-2">
                  <AvatarImage src={match.candidate.photoUrl || undefined} />
                  <AvatarFallback className="bg-blue-200">
                    {match.candidate.firstName[0]}{match.candidate.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-gray-900 text-center">
                  {match.candidate.firstName} {match.candidate.lastName}
                </h3>
                <p className="text-sm text-gray-600">{match.candidate.city}</p>
                <p className="text-xs text-gray-500">{match.candidate.designation}</p>
              </div>
            </div>

            {/* Score and Label */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 py-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <ArrowDownUp className="w-5 h-5 text-red-500" />
                <span className="text-sm text-gray-600">Compatibility Score:</span>
                <span className="text-2xl font-bold text-red-600">
                  {match.totalScore}/100
                </span>
              </div>
              <Badge variant="outline" className={`${getLabelColor(match.label)} border font-semibold`}>
                {getLabelText(match.label)}
              </Badge>
            </div>

            {/* Email Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-500" />
                <h4 className="font-semibold text-gray-900">Intro Email Preview</h4>
              </div>

              {/* Loading State */}
              {isGenerating && (
                <div className="flex items-center justify-center py-12 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 mx-auto mb-3 text-red-500 animate-spin" />
                    <p className="text-sm text-gray-600">
                      Generating personalised intro email...
                    </p>
                  </div>
                </div>
              )}

              {/* Email Textarea */}
              {emailReady && (
                <>
                  <Textarea
                    value={introEmail}
                    onChange={(e) => setIntroEmail(e.target.value)}
                    className="min-h-[200px] font-mono text-sm resize-vertical bg-white border-2"
                    placeholder="Email content will appear here..."
                  />
                  <p className="text-xs text-gray-500">
                    ✏️ You can edit the email above before sending
                  </p>
                </>
              )}
            </div>

            {/* Warning */}
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-900">
                  This will send a real email to:
                </p>
                <p className="text-amber-700">{match.client.email}</p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Footer with Actions */}
        <div className="px-6 py-4 border-t bg-white shrink-0">
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={!emailReady || isSending}
              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                '✓ Confirm & Send Match'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
