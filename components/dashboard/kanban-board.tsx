'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { ClientSummary, ClientStatus } from '@/types';
import {
  calculateAge,
  getInitials,
  getInitialsColor,
} from '@/lib/client-utils';
import { ToastContainer, useToast } from '@/components/ui/toast';

interface KanbanBoardProps {
  clients: ClientSummary[];
  onClientUpdate: (clientId: string, newStatus: ClientStatus) => void;
}

const columns: { id: ClientStatus; label: string; color: string; bgColor: string }[] = [
  { id: 'ONBOARDED', label: 'Onboarded', color: 'border-gray-400', bgColor: 'bg-gray-50' },
  { id: 'ACTIVE', label: 'Active', color: 'border-red-500', bgColor: 'bg-red-50' },
  { id: 'MATCH_SENT', label: 'Match Sent', color: 'border-pink-500', bgColor: 'bg-pink-50' },
  { id: 'MUTUAL_INTEREST', label: 'Mutual Interest', color: 'border-rose-500', bgColor: 'bg-rose-50' },
  { id: 'MEETING_SCHEDULED', label: 'Meeting Scheduled', color: 'border-red-600', bgColor: 'bg-red-50' },
  { id: 'CLOSED_WON', label: 'Closed Won', color: 'border-green-500', bgColor: 'bg-green-50' },
  { id: 'CLOSED_LOST', label: 'Closed Lost', color: 'border-gray-500', bgColor: 'bg-gray-50' },
];

export function KanbanBoard({ clients: initialClients, onClientUpdate }: KanbanBoardProps) {
  const router = useRouter();
  const [clients, setClients] = useState(initialClients);
  const { toast, showToast } = useToast();

  const getClientsByStatus = (status: ClientStatus) => {
    return clients.filter((client) => client.status === status);
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId as ClientStatus;
    const clientId = draggableId;

    // Optimistic update
    setClients((prevClients) =>
      prevClients.map((client) =>
        client.id === clientId ? { ...client, status: newStatus } : client
      )
    );

    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update client');
      }

      showToast({
        message: 'Client status updated successfully',
        type: 'success',
      });

      onClientUpdate(clientId, newStatus);
    } catch (error) {
      // Revert optimistic update
      setClients(initialClients);
      showToast({
        message: 'Failed to update client status',
        type: 'error',
      });
    }
  };

  const handleCardClick = (clientId: string) => {
    router.push(`/client/${clientId}`);
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        {/* Responsive Grid Layout - No horizontal scroll */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4">
          {columns.map((column) => {
            const columnClients = getClientsByStatus(column.id);

            return (
              <div key={column.id} className="flex flex-col">
                {/* Column Header */}
                <div className={`mb-3 p-3 rounded-xl ${column.bgColor} border-t-4 ${column.color} shadow-md`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-gray-900 truncate" style={{ fontFamily: 'Georgia, serif' }}>{column.label}</h3>
                    <Badge variant="outline" className="bg-white text-xs ml-2 font-bold">
                      {columnClients.length}
                    </Badge>
                  </div>
                </div>

                {/* Column Content - Scrollable */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 min-h-[500px] max-h-[70vh] overflow-y-auto bg-gray-50 rounded-xl p-2 border-2 ${
                        snapshot.isDraggingOver ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      } transition-colors scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100`}
                    >
                      <div className="space-y-2">
                        {columnClients.length === 0 ? (
                          <div className="text-center text-gray-400 py-8 text-xs">
                            No clients
                          </div>
                        ) : (
                          columnClients.map((client, index) => (
                            <Draggable key={client.id} draggableId={client.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  onClick={() => handleCardClick(client.id)}
                                  className={`bg-white p-3 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:shadow-lg transition-all duration-200 ${
                                    snapshot.isDragging ? 'shadow-xl ring-2 ring-red-400 scale-105' : ''
                                  }`}
                                >
                                  {/* Avatar and Name */}
                                  <div className="flex items-center gap-2 mb-2">
                                    <Avatar
                                      className="bg-gradient-to-br from-red-500 to-pink-600 text-white h-8 w-8 flex-shrink-0 shadow-md"
                                    >
                                      <AvatarFallback className="bg-transparent text-white font-semibold text-xs">
                                        {getInitials(client.firstName, client.lastName)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-semibold text-gray-900 truncate text-xs">
                                        {client.firstName} {client.lastName}
                                      </p>
                                      <p className="text-[10px] text-gray-500">
                                        {calculateAge(new Date(client.dateOfBirth))} yrs • {client.city}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Badges */}
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <Badge
                                      variant="outline"
                                      className={`text-[10px] px-1.5 py-0 ${
                                        client.gender === 'MALE'
                                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                                          : 'bg-pink-50 text-pink-700 border-pink-200'
                                      }`}
                                    >
                                      {client.gender}
                                    </Badge>
                                    <span className="text-[10px] text-gray-500 truncate">
                                      {client.religion}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
      <ToastContainer toast={toast} />
    </>
  );
}
