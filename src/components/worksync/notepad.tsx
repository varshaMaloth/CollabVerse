'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export function Notepad() {
  const [note, setNote] = useState('');

  useEffect(() => {
    const savedNote = localStorage.getItem('notepad-note');
    if (savedNote) {
      setNote(savedNote);
    }
  }, []);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
  };

  const saveNote = () => {
    localStorage.setItem('notepad-note', note);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Notepad</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <Textarea
          value={note}
          onChange={handleNoteChange}
          placeholder="Jot down your thoughts..."
          className="h-full resize-none"
        />
      </CardContent>
      <CardFooter>
        <Button onClick={saveNote}>Save Note</Button>
      </CardFooter>
    </Card>
  );
}
