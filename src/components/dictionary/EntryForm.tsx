
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const partsOfSpeech = [
  { value: 'noun', label: 'Noun' },
  { value: 'verb', label: 'Verb' },
  { value: 'adjective', label: 'Adjective' },
  { value: 'adverb', label: 'Adverb' },
  { value: 'pronoun', label: 'Pronoun' },
  { value: 'preposition', label: 'Preposition' },
  { value: 'conjunction', label: 'Conjunction' },
  { value: 'interjection', label: 'Interjection' }
];

interface EntryFormProps {
  word: string;
  setWord: (value: string) => void;
  partOfSpeech: string;
  setPartOfSpeech: (value: string) => void;
  definition: string;
  setDefinition: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isFormValid: boolean;
  hasChanges: boolean;
  isSubmitting: boolean;
  submitLabel?: string;
  cancelLabel?: string;
}

const EntryForm = ({
  word,
  setWord,
  partOfSpeech,
  setPartOfSpeech,
  definition,
  setDefinition,
  onSubmit,
  onCancel,
  isFormValid,
  hasChanges,
  isSubmitting,
  submitLabel = "Save Changes",
  cancelLabel = "Cancel"
}: EntryFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="word">Word</Label>
        <Input
          id="word"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Enter a word"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="part-of-speech">Part of Speech</Label>
        <Select value={partOfSpeech} onValueChange={setPartOfSpeech} required>
          <SelectTrigger id="part-of-speech">
            <SelectValue placeholder="Select part of speech" />
          </SelectTrigger>
          <SelectContent>
            {partsOfSpeech.map((pos) => (
              <SelectItem key={pos.value} value={pos.value}>
                {pos.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="definition">Definition</Label>
        <Textarea
          id="definition"
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
          placeholder="Enter the definition"
          rows={5}
          required
        />
      </div>
      
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          {cancelLabel}
        </Button>
        
        <Button
          type="submit"
          className="bg-dictionary-600 hover:bg-dictionary-700"
          disabled={!isFormValid || !hasChanges || isSubmitting}
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default EntryForm;
