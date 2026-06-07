import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth';
import { DashboardClient } from './dashboard-client';
import { Sidebar } from '@/components/dashboard/sidebar';
import { prisma } from '@/lib/db';

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect('/login');
  }

  // Fetch all clients for this matchmaker
  const clients = await prisma.client.findMany({
    where: {
      assignedMatchmakerId: session.user.id,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      dateOfBirth: true,
      city: true,
      gender: true,
      religion: true,
      status: true,
      photoUrl: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Calculate stats
  const totalClients = clients.length;
  const activeClients = clients.filter((c) => c.status === 'ACTIVE').length;
  const matchesSent = clients.filter(
    (c) =>
      c.status === 'MATCH_SENT' ||
      c.status === 'MUTUAL_INTEREST' ||
      c.status === 'MEETING_SCHEDULED' ||
      c.status === 'CLOSED_WON'
  ).length;
  const closedWon = clients.filter((c) => c.status === 'CLOSED_WON').length;

  // Serialize dates for client component
  const serializedClients = clients.map((client) => ({
    ...client,
    dateOfBirth: client.dateOfBirth.toISOString(),
  }));

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-red-50/30 to-pink-50/30">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <DashboardClient
          clients={serializedClients}
          stats={{
            totalClients,
            activeClients,
            matchesSent,
            closedWon,
          }}
        />
      </div>
    </div>
  );
}
