
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Edit, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DictionaryEntry {
  id: string;
  word: string;
  part_of_speech: string;
  definition: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface User {
  id: string;
  username: string;
  display_name: string;
}

const DictionaryEntryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  
  const [entry, setEntry] = useState<DictionaryEntry | null>(null);
  const [creator, setCreator] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const canEdit = user && (userProfile?.is_admin || (entry?.created_by === user.id));
  
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
      
      setEntry(data as DictionaryEntry);
      
      // Fetch creator info
      if (data) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, username, display_name')
          .eq('id', (data as DictionaryEntry).created_by)
          .single();
          
        if (!userError && userData) {
          setCreator(userData as User);
        }
      }
    } catch (error) {
      console.error('Error fetching dictionary entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dictionary entry',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!entry || !user) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('dictionary_entries')
        .delete()
        .eq('id', entry.id);
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Dictionary entry deleted successfully',
      });
      
      navigate('/dictionary');
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete entry',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p>Loading entry...</p>
      </div>
    );
  }
  
  if (!entry) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Entry not found</h2>
        <p className="mb-6">The dictionary entry you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/dictionary')}>
          Back to Dictionary
        </Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{entry.word}</h1>
          <div className="flex items-center mt-2">
            <span className="inline-block px-3 py-1 bg-dictionary-100 text-dictionary-800 rounded-full text-sm">
              {entry.part_of_speech}
            </span>
          </div>
        </div>
        
        {canEdit && (
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={() => navigate(`/dictionary/edit/${entry.id}`)}
              className="flex items-center"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive"
                  className="flex items-center"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the
                    dictionary entry "{entry.word}".
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
      
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Definition</h2>
        <p className="text-gray-800 whitespace-pre-wrap">{entry.definition}</p>
      </Card>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Entry Information</h3>
        <div className="text-sm text-gray-600">
          <p>Added by: {creator?.display_name || 'Unknown user'}</p>
          <p>Date added: {new Date(entry.created_at).toLocaleDateString()}</p>
          {entry.updated_at !== entry.created_at && (
            <p>Last updated: {new Date(entry.updated_at).toLocaleDateString()}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DictionaryEntryDetail;
