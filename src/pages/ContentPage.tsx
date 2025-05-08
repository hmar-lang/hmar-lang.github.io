import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Edit } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
}

const ContentPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  
  const [page, setPage] = useState<Page | null>(null);
  const [editableContent, setEditableContent] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (slug) {
      fetchPage(slug);
    }
  }, [slug]);
  
  const fetchPage = async (pageSlug: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', pageSlug)
        .single();
        
      if (error) throw error;
      
      setPage(data as Page);
      setEditableContent(data.content);
    } catch (error) {
      console.error(`Error fetching ${pageSlug} page:`, error);
      
      // If page doesn't exist, create default content based on slug
      let title = '';
      let defaultContent = '';
      
      if (pageSlug === 'about') {
        title = 'About Hmar Dictionary';
        defaultContent = '# About Hmar Dictionary\n\nWelcome to the Hmar Open Dictionary project. This is a community-driven initiative to document and preserve the Hmar language.\n\n## Our Mission\n\nOur mission is to create a comprehensive, accessible dictionary for the Hmar language that anyone can contribute to and benefit from.\n\n## Project Background\n\nThis project was started in 2023 to address the need for better digital resources for the Hmar language.';
      } else if (pageSlug === 'faq') {
        title = 'Frequently Asked Questions';
        defaultContent = '# Frequently Asked Questions\n\n## What is the Hmar language?\n\nHmar is a language spoken primarily in northeastern India, particularly in parts of Mizoram, Manipur, and Assam.\n\n## How can I contribute to the dictionary?\n\nYou can contribute by creating an account and adding words that you know. Each contribution helps grow our collective knowledge.\n\n## Who maintains this project?\n\nThis project is maintained by volunteers from the Hmar community and language enthusiasts.';
      } else if (pageSlug === 'tutorials') {
        title = 'Dictionary Tutorials';
        defaultContent = '# Dictionary Tutorials\n\n## How to Use the Dictionary\n\n1. **Search for Words**: Use the search bar at the top to find specific words\n2. **Browse Categories**: Explore words by part of speech\n3. **View Details**: Click on any word to see its full definition\n\n## How to Contribute\n\n### Adding New Words\n\n1. Sign in to your account\n2. Click "Add New Entry"\n3. Fill in the word, part of speech, and definition\n4. Submit your entry\n\n### Bulk Import\n\nFor adding multiple words at once, you can use our CSV import tool.';
      }
      
      if (title && userProfile?.is_admin) {
        createDefaultPage(pageSlug, title, defaultContent);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const createDefaultPage = async (pageSlug: string, title: string, content: string) => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .insert({
          title,
          slug: pageSlug,
          content
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setPage(data as Page);
      setEditableContent(data.content);
      
      toast({
        title: 'Page created',
        description: `Created default ${pageSlug} page. You can edit it now.`,
      });
    } catch (error) {
      console.error('Error creating default page:', error);
    }
  };
  
  const handleSaveContent = async () => {
    if (!page || !userProfile?.is_admin) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('pages')
        .update({
          content: editableContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', page.id);
        
      if (error) throw error;
      
      // Update displayed page
      setPage({
        ...page,
        content: editableContent
      });
      
      setIsEditorOpen(false);
      
      toast({
        title: 'Success',
        description: 'Page content updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update page content.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p>Loading content...</p>
      </div>
    );
  }
  
  if (!page && !userProfile?.is_admin) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Page not found</h2>
        <p>This page doesn't exist yet.</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{page?.title || ''}</h1>
        
        {userProfile?.is_admin && (
          <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                className="flex items-center"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Page
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Edit {page?.title}</DialogTitle>
                <DialogDescription>
                  This page uses Markdown formatting. Changes will be visible to all users.
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex-grow overflow-hidden flex flex-col">
                <Textarea
                  value={editableContent}
                  onChange={(e) => setEditableContent(e.target.value)}
                  placeholder="Enter page content using Markdown..."
                  className="flex-grow min-h-[50vh] font-mono text-sm"
                />
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditableContent(page?.content || '');
                    setIsEditorOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveContent}
                  disabled={isSaving || editableContent === page?.content}
                  className="bg-dictionary-600 hover:bg-dictionary-700"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <Card className="p-6 prose max-w-none">
        {page ? (
          <ReactMarkdown>{page.content}</ReactMarkdown>
        ) : (
          <p className="text-gray-500">No content available yet.</p>
        )}
      </Card>
    </div>
  );
};

export default ContentPage;
