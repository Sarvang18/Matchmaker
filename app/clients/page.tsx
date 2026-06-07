import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ClientList } from '@/components/dashboard/client-list';
import { prisma } from '@/lib/db';
import { Sidebar } from '@/components/dashboard/sidebar';

export default async function ClientsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Fetch all clients
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      dateOfBirth: true,
      gender: true,
      city: true,
      religion: true,
      status: true,
      photoUrl: true,
    },
  });

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-red-50/30 to-pink-50/30">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <ClientList clients={clients} />
      </div>
    </div>
  );
}
