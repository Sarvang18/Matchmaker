'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  getInitials, 
  getInitialsColor, 
  getStatusColor, 
  getStatusLabel,
  calculateAge 
} from '@/lib/client-utils';
import { Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ClientStatus } from '@/types';

interface BiodataCardProps {
  client: {
    id: string;
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string; // ISO string
    city: string;
    status: ClientStatus;
    photoUrl: string | null;
  };
}

export function BiodataCard({ client }: BiodataCardProps) {
  const [status, setStatus] = useState<ClientStatus>(client.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const initials = getInitials(client.firstName, client.lastName);
  const age = calculateAge(new Date(client.dateOfBirth));
  const fullName = `${client.firstName} ${client.lastName}`;

  const handleStatusChange = async (newStatus: ClientStatus) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/clients/${client.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setStatus(newStatus);
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFindMatches = () => {
    // Scroll to matches section
    const matchesSection = document.querySelector('[data-matches-section]');
    if (matchesSection) {
      matchesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Card className="p-6 sticky top-8 shadow-lg border border-gray-100">
      {/* Avatar */}
      <div className="flex justify-center mb-4">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold bg-gradient-to-br from-red-500 to-pink-600 shadow-lg"
        >
          {initials}
        </div>
      </div>

      {/* Name and Age */}
      <h2 className="text-2xl font-bold text-center text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>{fullName}</h2>
      <p className="text-center text-gray-600 mt-1">
        {age} years • {client.city}
      </p>

      {/* Status Dropdown */}
      <div className="mt-6">
        <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value as ClientStatus)}
          disabled={isUpdating}
          className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-300 transition-colors"
        >
          <option value="ONBOARDED">Onboarded</option>
          <option value="ACTIVE">Active</option>
          <option value="MATCH_SENT">Match Sent</option>
          <option value="MUTUAL_INTEREST">Mutual Interest</option>
          <option value="MEETING_SCHEDULED">Meeting Scheduled</option>
          <option value="CLOSED_WON">Closed Won</option>
          <option value="CLOSED_LOST">Closed Lost</option>
        </select>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Gender</span>
          <Badge className={client.gender === 'MALE' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}>
            {client.gender === 'MALE' ? 'Male' : 'Female'}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Current Stage</span>
          <Badge className={getStatusColor(status)}>{getStatusLabel(status)}</Badge>
        </div>
      </div>

      {/* Find Matches Button */}
      <Button
        onClick={handleFindMatches}
        className="w-full mt-6 bg-gradient-to-r from-red-500 to-pink-600 hover:shadow-xl transition-all"
        title="Scroll to matches section"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        View Matches
      </Button>
    </Card>
  );
}
