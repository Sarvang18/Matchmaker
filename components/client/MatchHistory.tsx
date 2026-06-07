'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import type { MatchStatus, AILabel } from '@prisma/client';

interface MatchHistoryItem {
  matchId: string;
  candidate: {
    id: string;
    firstName: string;
    lastName: string;
  };
  totalScore: number | null;
  label: AILabel | string | null;
  status: MatchStatus | string;
  sentAt: string | Date | null;
  respondedAt: string | Date | null;
}

interface MatchHistoryProps {
  matches: MatchHistoryItem[];
}

function getStatusConfig(status: MatchStatus | string) {
  switch (status) {
    case 'SENT':
      return {
        text: 'Awaiting response',
        className: 'bg-blue-100 text-blue-700 border-blue-300',
      };
    case 'INTERESTED':
      return {
        text: 'Interested ✓',
        className: 'bg-green-100 text-green-700 border-green-300',
      };
    case 'NOT_INTERESTED':
      return {
        text: 'Not interested ✗',
        className: 'bg-red-100 text-red-700 border-red-300',
      };
    case 'MEETING_SCHEDULED':
      return {
        text: 'Meeting scheduled',
        className: 'bg-purple-100 text-purple-700 border-purple-300',
      };
    default:
      return {
        text: 'Unknown',
        className: 'bg-gray-100 text-gray-700 border-gray-300',
      };
  }
}

function getLabelBadge(label: AILabel | string | null) {
  if (!label) return <Badge className="bg-gray-100 text-gray-600 border-gray-300">—</Badge>;
  
  switch (label) {
    case 'DREAM':
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Dream</Badge>;
    case 'HIGH':
      return <Badge className="bg-purple-100 text-purple-800 border-purple-300">High</Badge>;
    case 'COMPATIBLE':
      return <Badge className="bg-teal-100 text-teal-800 border-teal-300">Compatible</Badge>;
    case 'LOW':
      return <Badge className="bg-gray-100 text-gray-600 border-gray-300">Low</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-600 border-gray-300">{label}</Badge>;
  }
}

export function MatchHistory({ matches }: MatchHistoryProps) {
  if (matches.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-600 mb-2">No matches sent yet</p>
        <p className="text-sm text-gray-500">Use the suggestions above to send your first match</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-center">Score</TableHead>
            <TableHead className="text-center">Label</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead>Sent On</TableHead>
            <TableHead>Response</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matches.map((match) => {
            const statusConfig = getStatusConfig(match.status);
            return (
              <TableRow key={match.matchId}>
                <TableCell className="font-medium">
                  {match.candidate.firstName} {match.candidate.lastName}
                </TableCell>
                <TableCell className="text-center">
                  <span className="font-semibold text-red-600">
                    {match.totalScore ?? '—'}
                  </span>
                </TableCell>
                <TableCell className="text-center">{getLabelBadge(match.label)}</TableCell>
                <TableCell className="text-center">
                  <Badge className={statusConfig.className}>{statusConfig.text}</Badge>
                </TableCell>
                <TableCell>
                  {match.sentAt ? new Date(match.sentAt).toLocaleDateString() : '—'}
                </TableCell>
                <TableCell>
                  {match.respondedAt ? new Date(match.respondedAt).toLocaleDateString() : '—'}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/client/${match.candidate.id}`} target="_blank">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
