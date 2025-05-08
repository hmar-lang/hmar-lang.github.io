import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Check } from 'lucide-react';

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

interface DictionaryEntry {
  word: string;
  part_of_speech: string;
  definition: string;
}

interface CSVEntry {
  word: string;
  part_of_speech: string;
  definition: string;
  valid: boolean;
  error?: string;
}

const AddDictionaryEntry = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [word, setWord] = useState('');
  const [partOfSpeech, setPartOfSpeech] = useState('');
  const [definition, setDefinition] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [csvEntries, setCsvEntries] = useState<CSVEntry[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('single');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be signed in to add entries.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newEntry: DictionaryEntry = {
        word: word.trim(),
        part_of_speech: partOfSpeech,
        definition: definition.trim()
      };
      
      // Check if word already exists
      const { data: existingEntry } = await supabase
        .from('dictionary_entries')
        .select('id')
        .eq('word', newEntry.word)
        .limit(1);
        
      if (existingEntry && existingEntry.length > 0) {
        toast({
          title: 'Word already exists',
          description: 'This word is already in the dictionary.',
          variant: 'destructive',
        });
        return;
      }
      
      const { error } = await supabase
        .from('dictionary_entries')
        .insert([{
          ...newEntry,
          created_by: user.id
        }]);
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Dictionary entry added successfully.',
      });
      
      // Reset form
      setWord('');
      setPartOfSpeech('');
      setDefinition('');
      
      // Redirect to dictionary
      navigate('/dictionary');
      
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add entry.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setCsvFile(selectedFile);
      setCsvEntries([]); // Reset entries when file changes
    }
  };
  
  const processCsvFile = async () => {
    if (!csvFile) return;
    
    setIsProcessing(true);
    
    try {
      const text = await csvFile.text();
      const rows = text.split('\n');
      
      // Check headers
      const headers = rows[0].toLowerCase().split(',');
      const requiredHeaders = ['word', 'part_of_speech', 'definition'];
      
      const hasAllHeaders = requiredHeaders.every(header => 
        headers.some(h => h.trim() === header)
      );
      
      if (!hasAllHeaders) {
        toast({
          title: 'Invalid CSV format',
          description: 'CSV file must include word, part_of_speech, and definition columns.',
          variant: 'destructive',
        });
        setIsProcessing(false);
        return;
      }
      
      // Map indexes
      const wordIndex = headers.findIndex(h => h.trim() === 'word');
      const partOfSpeechIndex = headers.findIndex(h => h.trim() === 'part_of_speech');
      const definitionIndex = headers.findIndex(h => h.trim() === 'definition');
      
      const parsedEntries: CSVEntry[] = [];
      
      // Process rows (skip header)
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i].trim();
        if (!row) continue; // Skip empty rows
        
        const fields = row.split(',');
        
        // Extract fields using mapped indexes
        const entry: CSVEntry = {
          word: fields[wordIndex]?.trim() || '',
          part_of_speech: fields[partOfSpeechIndex]?.trim() || '',
          definition: fields[definitionIndex]?.trim() || '',
          valid: true
        };
        
        // Validate entry
        if (!entry.word) {
          entry.valid = false;
          entry.error = 'Word is required';
        } else if (!entry.part_of_speech) {
          entry.valid = false;
          entry.error = 'Part of speech is required';
        } else if (!partsOfSpeech.some(pos => pos.value === entry.part_of_speech)) {
          entry.valid = false;
          entry.error = 'Invalid part of speech';
        } else if (!entry.definition) {
          entry.valid = false;
          entry.error = 'Definition is required';
        }
        
        parsedEntries.push(entry);
      }
      
      setCsvEntries(parsedEntries);
      
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process CSV file.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const uploadBulkEntries = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be signed in to add entries.',
        variant: 'destructive',
      });
      return;
    }
    
    const validEntries = csvEntries.filter(entry => entry.valid);
    if (validEntries.length === 0) {
      toast({
        title: 'No valid entries',
        description: 'Please fix the errors in your CSV file.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Check for existing words
      const words = validEntries.map(entry => entry.word);
      
      const { data: existingWords } = await supabase
        .from('dictionary_entries')
        .select('word')
        .in('word', words);
        
      const existingWordsSet = new Set((existingWords || []).map((entry: any) => entry.word));
      
      // Filter out already existing words
      const newEntries = validEntries
        .filter(entry => !existingWordsSet.has(entry.word))
        .map(entry => ({
          word: entry.word,
          part_of_speech: entry.part_of_speech,
          definition: entry.definition,
          created_by: user.id
        }));
        
      if (newEntries.length === 0) {
        toast({
          title: 'No new entries',
          description: 'All words in the CSV already exist in the dictionary.',
          variant: 'destructive',
        });
        setIsUploading(false);
        return;
      }
      
      // Insert in batches of 50 (Supabase limit)
      const batchSize = 50;
      let successCount = 0;
      
      for (let i = 0; i < newEntries.length; i += batchSize) {
        const batch = newEntries.slice(i, i + batchSize);
        const { error } = await supabase
          .from('dictionary_entries')
          .insert(batch);
          
        if (!error) {
          successCount += batch.length;
        }
      }
      
      toast({
        title: 'Success',
        description: `Added ${successCount} new dictionary entries.`,
      });
      
      // Reset
      setCsvEntries([]);
      setCsvFile(null);
      
      // Redirect to dictionary
      navigate('/dictionary');
      
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload entries.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const isFormValid = word.trim() !== '' && partOfSpeech !== '' && definition.trim() !== '';
  const validCsvEntries = csvEntries.filter(entry => entry.valid).length;
  const invalidCsvEntries = csvEntries.filter(entry => !entry.valid).length;
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Add Dictionary Entry</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single">Add Single Entry</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
        </TabsList>
        
        <TabsContent value="single">
          <Card>
            <CardHeader>
              <CardTitle>Add New Word</CardTitle>
              <CardDescription>
                Enter the details for a new dictionary entry.
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
                
                <Button
                  type="submit"
                  className="bg-dictionary-600 hover:bg-dictionary-700 w-full"
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? "Adding Entry..." : "Add Entry"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Import</CardTitle>
              <CardDescription>
                Upload a CSV file with multiple dictionary entries.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">CSV Format Requirements:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>First row must be a header containing: word, part_of_speech, definition</li>
                    <li>Each word must be unique</li>
                    <li>Valid parts of speech: {partsOfSpeech.map(pos => pos.value).join(', ')}</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="csv-file">Upload CSV File</Label>
                  <Input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                  />
                </div>
                
                <Button
                  type="button"
                  onClick={processCsvFile}
                  disabled={!csvFile || isProcessing}
                  className="w-full"
                >
                  {isProcessing ? "Processing..." : "Process File"}
                </Button>
                
                {csvEntries.length > 0 && (
                  <div className="space-y-4">
                    <div className="bg-white rounded-md border p-4">
                      <h3 className="font-medium mb-2">Validation Results:</h3>
                      <div className="flex space-x-4">
                        <div className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-1" />
                          <span>{validCsvEntries} valid entries</span>
                        </div>
                        {invalidCsvEntries > 0 && (
                          <div className="flex items-center">
                            <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                            <span>{invalidCsvEntries} invalid entries</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="max-h-60 overflow-y-auto border rounded-md">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Word</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part of Speech</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {csvEntries.map((entry, index) => (
                            <tr key={index} className={!entry.valid ? "bg-red-50" : ""}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">{entry.word}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">{entry.part_of_speech}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {entry.valid ? (
                                  <span className="text-green-600">Valid</span>
                                ) : (
                                  <span className="text-red-600">{entry.error}</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <Button
                      type="button"
                      onClick={uploadBulkEntries}
                      disabled={validCsvEntries === 0 || isUploading}
                      className="bg-dictionary-600 hover:bg-dictionary-700 w-full"
                    >
                      {isUploading ? "Uploading..." : `Upload ${validCsvEntries} Entries`}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddDictionaryEntry;
