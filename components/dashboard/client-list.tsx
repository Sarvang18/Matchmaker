'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, ChevronLeft, ChevronRight, ArrowRight, Filter } from 'lucide-react';
import type { ClientSummary, ClientStatus, Gender } from '@/types';
import {
  calculateAge,
  getInitials,
  getInitialsColor,
  getStatusColor,
  getStatusLabel,
} from '@/lib/client-utils';

interface ClientListProps {
  clients: ClientSummary[];
}

export function ClientList({ clients }: ClientListProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<Gender | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<ClientStatus | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        searchQuery === '' ||
        client.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.religion.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGender = genderFilter === 'ALL' || client.gender === genderFilter;
      const matchesStatus = statusFilter === 'ALL' || client.status === statusFilter;

      return matchesSearch && matchesGender && matchesStatus;
    });
  }, [clients, searchQuery, genderFilter, statusFilter]);

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = filteredClients.slice(startIndex, startIndex + itemsPerPage);

  const handleRowClick = (clientId: string) => {
    router.push(`/client/${clientId}`);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-400 w-5 h-5" />
          <Input
            placeholder="Search by name, city, or religion..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-6 bg-white border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500/50 focus:border-red-300 shadow-sm font-medium"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value as Gender | 'ALL')}
            className="px-5 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all shadow-sm"
          >
            <option value="ALL">Gender: All</option>
            <option value="MALE">Gender: Male</option>
            <option value="FEMALE">Gender: Female</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ClientStatus | 'ALL')}
            className="px-5 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all shadow-sm"
          >
            <option value="ALL">Status: All</option>
            <option value="ONBOARDED">Status: Onboarded</option>
            <option value="ACTIVE">Status: Active</option>
            <option value="MATCH_SENT">Status: Match Sent</option>
            <option value="MUTUAL_INTEREST">Status: Mutual Interest</option>
            <option value="MEETING_SCHEDULED">Status: Meeting Scheduled</option>
            <option value="CLOSED_WON">Status: Closed Won</option>
            <option value="CLOSED_LOST">Status: Closed Lost</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-red-50 to-pink-50 border-b border-gray-100 hover:from-red-100 hover:to-pink-100">
              <TableHead className="font-bold text-gray-900 py-5" style={{ fontFamily: 'Georgia, serif' }}>Client</TableHead>
              <TableHead className="font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>Age</TableHead>
              <TableHead className="font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>City</TableHead>
              <TableHead className="font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>Gender</TableHead>
              <TableHead className="font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>Religion</TableHead>
              <TableHead className="font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>Status</TableHead>
              <TableHead className="font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                      <Filter className="w-8 h-8 text-red-400" />
                    </div>
                    <p className="text-gray-600 font-semibold" style={{ fontFamily: 'Georgia, serif' }}>No clients found</p>
                    <p className="text-sm text-gray-500">Try adjusting your filters</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedClients.map((client, index) => (
                <TableRow
                  key={client.id}
                  className="cursor-pointer hover:bg-red-50/50 transition-all duration-300 border-b border-gray-50 group"
                  onClick={() => handleRowClick(client.id)}
                >
                  <TableCell className="py-5">
                    <div className="flex items-center gap-3">
                      <Avatar className="bg-gradient-to-br from-red-500 to-pink-600 text-white ring-2 ring-white shadow-lg w-11 h-11 group-hover:scale-110 transition-transform duration-300">
                        <AvatarFallback className="bg-transparent font-bold text-sm">
                          {getInitials(client.firstName, client.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                        {client.firstName} {client.lastName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700 font-semibold">
                    {calculateAge(new Date(client.dateOfBirth))}
                  </TableCell>
                  <TableCell className="text-gray-700 font-medium">{client.city}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`font-bold ${
                        client.gender === 'MALE'
                          ? 'bg-blue-50 text-blue-700 border-blue-300'
                          : 'bg-pink-50 text-pink-700 border-pink-300'
                      }`}
                    >
                      {client.gender}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-700 font-medium">{client.religion}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${getStatusColor(client.status)} font-bold`}>
                      {getStatusLabel(client.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(client.id);
                      }}
                      className="bg-gradient-to-r from-red-500 to-pink-600 hover:shadow-lg text-white border-0 rounded-xl font-semibold transition-all duration-300 group/btn"
                    >
                      View Profile
                      <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <p className="text-sm font-semibold text-gray-700">
            Showing <span className="text-red-600">{startIndex + 1}</span> to{' '}
            <span className="text-red-600">{Math.min(startIndex + itemsPerPage, filteredClients.length)}</span> of{' '}
            <span className="text-red-600">{filteredClients.length}</span> clients
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="bg-white hover:bg-red-50 border-gray-200 rounded-xl font-semibold px-5 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <div className="flex items-center gap-2 px-4">
              <span className="text-sm font-bold text-red-600" style={{ fontFamily: 'Georgia, serif' }}>{currentPage}</span>
              <span className="text-gray-400">/</span>
              <span className="text-sm font-semibold text-gray-600">{totalPages}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="bg-white hover:bg-red-50 border-gray-200 rounded-xl font-semibold px-5 disabled:opacity-40"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
