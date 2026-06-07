import { notFound, redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { BiodataCard } from '@/components/client/BiodataCard';
import { BiodataFields } from '@/components/client/BiodataFields';
import { NotesPanel } from '@/components/client/NotesPanel';
import { MatchesSection } from '@/components/client/MatchesSection';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function ClientPage({ params }: { params: { id: string } }) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect('/login');
  }

  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: {
      notes: {
        orderBy: { createdAt: 'desc' },
        include: {
          matchmaker: {
            select: { name: true },
          },
        },
      },
    },
  });

  if (!client) {
    notFound();
  }

  if (client.assignedMatchmakerId !== session.user.id) {
    redirect('/dashboard');
  }

  // Serialize dates to avoid hydration issues
  const serializedClient = {
    ...client,
    dateOfBirth: client.dateOfBirth.toISOString(),
    createdAt: client.createdAt.toISOString(),
    updatedAt: client.updatedAt.toISOString(),
    notes: client.notes.map(note => ({
      ...note,
      createdAt: note.createdAt.toISOString(),
    })),
  };

  // Fetch existing matches for this client
  const matches = await prisma.match.findMany({
    where: { clientId: params.id },
    include: {
      matchedWith: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          dateOfBirth: true,
          city: true,
          gender: true,
          religion: true,
          caste: true,
          currentCompany: true,
          designation: true,
          income: true,
          photoUrl: true,
        },
      },
    },
    orderBy: { aiScore: 'desc' },
  });

  const serializedMatches = matches.map(match => ({
    matchId: match.id,
    candidate: {
      ...match.matchedWith,
      dateOfBirth: match.matchedWith.dateOfBirth.toISOString(),
    },
    totalScore: match.aiScore,
    label: match.aiLabel,
    aiExplanation: match.aiExplanation,
    dimensionScores: {}, // Empty for now, calculated on demand if needed
    status: match.status,
    sentAt: match.sentAt?.toISOString() || null,
    respondedAt: match.respondedAt?.toISOString() || null,
    createdAt: match.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/30 to-pink-50/30">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="hover:bg-red-50 hover:text-red-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BiodataCard client={serializedClient} />
            </div>
          </div>

          {/* Right Columns - Biodata and Notes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Biodata Fields */}
            <BiodataFields client={serializedClient} />
            
            {/* Notes Panel */}
            <NotesPanel clientId={client.id} initialNotes={serializedClient.notes} />
          </div>
        </div>

        {/* Matches Section - Full Width Below */}
        <div className="mt-8" data-matches-section>
          <MatchesSection 
            clientId={client.id} 
            clientEmail={client.email}
            clientFirstName={client.firstName}
            clientLastName={client.lastName}
            clientCity={client.city}
            clientDesignation={client.designation}
            clientPhotoUrl={client.photoUrl}
            existingMatches={serializedMatches} 
          />
        </div>
      </div>
    </div>
  );
}
