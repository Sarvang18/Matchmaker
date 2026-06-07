'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Heart } from 'lucide-react';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { ClientList } from '@/components/dashboard/client-list';
import { KanbanBoard } from '@/components/dashboard/kanban-board';
import { AddClientSheet } from '@/components/client/AddClientSheet';
import type { ClientSummary, ClientStatus } from '@/types';

interface DashboardClientProps {
  clients: Array<Omit<ClientSummary, 'dateOfBirth'> & { dateOfBirth: string }>;
  stats: {
    totalClients: number;
    activeClients: number;
    matchesSent: number;
    closedWon: number;
  };
}

export function DashboardClient({ clients: initialClients, stats }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'kanban'>('list');
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [clients, setClients] = useState(
    initialClients.map((c) => ({
      ...c,
      dateOfBirth: new Date(c.dateOfBirth),
    }))
  );

  const handleClientUpdate = (clientId: string, newStatus: ClientStatus) => {
    setClients((prevClients) =>
      prevClients.map((client) =>
        client.id === clientId ? { ...client, status: newStatus } : client
      )
    );
  };

  const handleClientAdded = async () => {
    // Fetch the updated client list from the server
    try {
      const response = await fetch('/api/clients');
      if (response.ok) {
        const clients = await response.json();
        setClients(
          clients.map((c: any) => ({
            ...c,
            dateOfBirth: new Date(c.dateOfBirth),
          }))
        );
      }
    } catch (error) {
      console.error('Failed to refresh clients:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                <Heart className="w-6 h-6 text-white" fill="white" strokeWidth={0} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                  My Clients
                </h1>
                <p className="text-sm text-gray-600">
                  Manage and track your client relationships with AI-powered matchmaking
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setIsAddClientOpen(true)}
              className="bg-gradient-to-r from-red-500 to-pink-600 hover:shadow-xl text-white px-6 py-6 rounded-xl text-sm font-bold transition-all"
            >
              <Plus className="w-5 h-5 mr-2" strokeWidth={2.5} />
              Add Client
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8">
        <StatsCards
          totalClients={stats.totalClients}
          activeClients={stats.activeClients}
          matchesSent={stats.matchesSent}
          closedWon={stats.closedWon}
        />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50">
          <div className="flex">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-8 py-4 text-sm font-bold border-b-3 transition-all ${
                activeTab === 'list'
                  ? 'border-red-600 text-red-600 bg-white'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              style={activeTab === 'list' ? { fontFamily: 'Georgia, serif' } : {}}
            >
              List View
            </button>
            <button
              onClick={() => setActiveTab('kanban')}
              className={`px-8 py-4 text-sm font-bold border-b-3 transition-all ${
                activeTab === 'kanban'
                  ? 'border-red-600 text-red-600 bg-white'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              style={activeTab === 'kanban' ? { fontFamily: 'Georgia, serif' } : {}}
            >
              Kanban Board
            </button>
          </div>
        </div>

        <div className="p-8">
          {activeTab === 'list' && <ClientList clients={clients} />}
          {activeTab === 'kanban' && (
            <KanbanBoard clients={clients} onClientUpdate={handleClientUpdate} />
          )}
        </div>
      </div>

      {/* Add Client Sheet */}
      <AddClientSheet 
        open={isAddClientOpen} 
        onOpenChange={setIsAddClientOpen}
        onClientAdded={handleClientAdded}
      />
    </div>
  );
}
