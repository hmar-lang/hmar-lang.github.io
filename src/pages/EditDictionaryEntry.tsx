
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '../context/AuthContext';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface DictionaryEntry {
  id: string;
  word: string;
  part_of_speech: string;
  definition: string;
  created_by: string;
}

const partsOfSpeech = [
  { value: 'noun', label: 'Noun' },
  { value: 'verb', label: 'Verb' },
  { value: 'adjective', label: 'Adjective' },
  { value: 'adverb', label: 'Adverb' },
  { value: 'pronoun', label: 'Pronoun' },
  { value: 'preposition', label: 'Preposition' },
  { value: 'conjunction', label: 'Conjunction' },
  { value: 'interjection', label: 'Interjection' }
];

const EditDictionaryEntry = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  
  const [originalEntry, setOriginalEntry] = useState<DictionaryEntry | null>(null);
  const [word, setWord] = useState('');
  const [partOfSpeech, setPartOfSpeech] = useState('');
  const [definition, setDefinition] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    fetchEntry();
  }, [id]);
  
  const fetchEntry = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('dictionary_entries')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      const entry = data as DictionaryEntry;
      setOriginalEntry(entry);
      
      // Check if user has permission to edit
      if (!user || (entry.created_by !== user.id && !userProfile?.is_admin)) {
        toast({
          title: 'Access denied',
          description: 'You do not have permission to edit this entry',
          variant: 'destructive',
        });
        navigate(`/dictionary/${id}`);
        return;
      }
      
      // Set form values
      setWord(entry.word);
      setPartOfSpeech(entry.part_of_speech);
      setDefinition(entry.definition);
      
    } catch (error) {
      console.error('Error fetching dictionary entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dictionary entry',
        variant: 'destructive',
      });
      navigate('/dictionary');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !originalEntry) return;
    
    setIsSubmitting(true);
    
    try {
      // Check if another entry with the same word exists (if word changed)
      if (word !== originalEntry.word) {
        const { data: existingEntry } = await supabase
          .from('dictionary_entries')
          .select('id')
          .eq('word', word)
          .neq('id', id)
          .limit(1);
          
        if (existingEntry && existingEntry.length > 0) {
          toast({
            title: 'Word already exists',
            description: 'Another entry with this word already exists.',
            variant: 'destructive',
          });
          setIsSubmitting(false);
          return;
        }
      }
      
      const { error } = await supabase
        .from('dictionary_entries')
        .update({
          word: word.trim(),
          part_of_speech: partOfSpeech,
          definition: definition.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Dictionary entry updated successfully.',
      });
      
      navigate(`/dictionary/${id}`);
      
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update entry.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isFormValid = word.trim() !== '' && partOfSpeech !== '' && definition.trim() !== '';
  const hasChanges = 
    originalEntry && 
    (word !== originalEntry.word || 
     partOfSpeech !== originalEntry.part_of_speech || 
     definition !== originalEntry.definition);
  
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p>Loading entry...</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Edit Dictionary Entry</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Edit Word</CardTitle>
          <CardDescription>
            Update the details for this dictionary entry.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                onClick={() => navigate(`/dictionary/${id}`)}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                className="bg-dictionary-600 hover:bg-dictionary-700"
                disabled={!isFormValid || !hasChanges || isSubmitting}
              >
                {isSubmitting ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditDictionaryEntry;
