'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Note {
  id: string;
  content: string;
  createdAt: string; // ISO string
  matchmaker: {
    name: string;
  };
}

interface NotesPanelProps {
  clientId: string;
  initialNotes: Note[];
}

export function NotesPanel({ clientId, initialNotes }: NotesPanelProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    setIsAdding(true);
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, content: newNote }),
      });

      if (response.ok) {
        const note = await response.json();
        setNotes([note, ...notes]);
        setNewNote('');
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to add note:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    setDeletingId(noteId);
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotes(notes.filter((n) => n.id !== noteId));
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>Notes</h3>

      {/* Add Note Form */}
      <div className="mb-6">
        <Textarea
          placeholder="Add a note about this client..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          rows={3}
          className="mb-3"
        />
        <Button
          onClick={handleAddNote}
          disabled={isAdding || !newNote.trim()}
          className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
        >
          {isAdding ? 'Adding...' : 'Add Note'}
        </Button>
      </div>

      {/* Notes List */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {notes.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No notes yet</p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200 relative group"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {note.matchmaker.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  disabled={deletingId === note.id}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {note.content}
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
