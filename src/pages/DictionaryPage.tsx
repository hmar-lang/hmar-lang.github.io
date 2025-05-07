import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Plus, Search, SortAsc, SortDesc } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

// Define types for our data
interface DictionaryEntry {
  id: string;
  word: string;
  part_of_speech: string;
  definition: string;
  created_by: string;
  created_at: string;
}

interface User {
  id: string;
  username: string;
  display_name: string;
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

const perPageOptions = [10, 20, 50];

const DictionaryPage = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [partOfSpeechFilter, setPartOfSpeechFilter] = useState<string>('');
  const [currentView, setCurrentView] = useState<'all' | 'mine'>('all');
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [users, setUsers] = useState<Record<string, User>>({});

  useEffect(() => {
    fetchEntries();
  }, [currentView, searchQuery, partOfSpeechFilter, currentPage, perPage]);

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('dictionary_entries')
        .select('*', { count: 'exact' });

      // Apply filters
      if (searchQuery) {
        query = query.ilike('word', `%${searchQuery}%`);
      }

      if (partOfSpeechFilter) {
        query = query.eq('part_of_speech', partOfSpeechFilter);
      }

      if (currentView === 'mine' && user) {
        query = query.eq('created_by', user.id);
      }

      // Add pagination
      const startIndex = (currentPage - 1) * perPage;
      query = query
        .order('word')
        .range(startIndex, startIndex + perPage - 1);

      const { data, error, count } = await query;

      if (error) throw error;
      
      setEntries(data as DictionaryEntry[]);
      setTotalCount(count || 0);
      
      // Fetch user info for each entry
      await fetchUsers(data as DictionaryEntry[]);
    } catch (error) {
      console.error('Error fetching dictionary entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async (entries: DictionaryEntry[]) => {
    const userIds = [...new Set(entries.map(entry => entry.created_by))];
    
    // Filter out IDs that we already have info for
    const idsToFetch = userIds.filter(id => !users[id]);
    
    if (idsToFetch.length === 0) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, display_name')
        .in('id', idsToFetch);
        
      if (error) throw error;
      
      const newUsers = { ...users };
      (data as User[]).forEach(user => {
        newUsers[user.id] = user;
      });
      
      setUsers(newUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchEntries();
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setPartOfSpeechFilter(''); // Using empty string for no filter
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalCount / perPage);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dictionary</h1>
        {user && (
          <Link to="/dictionary/add">
            <Button className="bg-dictionary-600 hover:bg-dictionary-700">
              <Plus className="mr-2 h-4 w-4" /> Add New Entry
            </Button>
          </Link>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search words..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={partOfSpeechFilter} onValueChange={setPartOfSpeechFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Part of speech" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem> {/* Use empty string for no filter */}
              {partsOfSpeech.map((pos) => (
                <SelectItem key={pos.value} value={pos.value}>
                  {pos.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button type="submit">Search</Button>
          {(searchQuery || partOfSpeechFilter) && (
            <Button variant="ghost" type="button" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          )}
        </form>
      </div>
      
      {user && (
        <Tabs value={currentView} onValueChange={(v) => { 
          setCurrentView(v as 'all' | 'mine'); 
          setCurrentPage(1);
        }} className="mb-6">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="all">All Entries</TabsTrigger>
            <TabsTrigger value="mine">My Entries</TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-12">
            <p>Loading dictionary entries...</p>
          </div>
        ) : entries.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4">
              {entries.map((entry) => (
                <Link to={`/dictionary/${entry.id}`} key={entry.id}>
                  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{entry.word}</h3>
                        <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded mt-1">
                          {entry.part_of_speech}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Added by: {users[entry.created_by]?.display_name || 'Unknown user'}
                      </div>
                    </div>
                    <p className="text-gray-600 mt-3 line-clamp-2">{entry.definition}</p>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Pagination and results info */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
              <div className="text-sm text-gray-500">
                Showing {((currentPage - 1) * perPage) + 1}-{Math.min(currentPage * perPage, totalCount)} of {totalCount} entries
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Per page:</span>
                  <Select 
                    value={perPage.toString()} 
                    onValueChange={(value) => {
                      setPerPage(parseInt(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[70px]">
                      <SelectValue placeholder={perPage.toString()} />
                    </SelectTrigger>
                    <SelectContent>
                      {perPageOptions.map((option) => (
                        <SelectItem key={option} value={option.toString()}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(p => Math.max(1, p - 1));
                        }} 
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {currentPage > 2 && (
                      <PaginationItem>
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(1);
                          }}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    {currentPage > 3 && (
                      <PaginationItem>
                        <span className="px-2">...</span>
                      </PaginationItem>
                    )}
                    
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(currentPage - 1);
                          }}
                        >
                          {currentPage - 1}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    <PaginationItem>
                      <PaginationLink href="#" isActive onClick={(e) => e.preventDefault()}>
                        {currentPage}
                      </PaginationLink>
                    </PaginationItem>
                    
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(currentPage + 1);
                          }}
                        >
                          {currentPage + 1}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    {currentPage < totalPages - 2 && (
                      <PaginationItem>
                        <span className="px-2">...</span>
                      </PaginationItem>
                    )}
                    
                    {currentPage < totalPages - 1 && totalPages > 1 && (
                      <PaginationItem>
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(totalPages);
                          }}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(p => Math.min(totalPages, p + 1));
                        }} 
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">
              {searchQuery || partOfSpeechFilter
                ? "No entries match your search criteria."
                : currentView === 'mine'
                ? "You haven't added any entries yet."
                : "No dictionary entries found."}
            </p>
            {user && (
              <Link to="/dictionary/add">
                <Button className="bg-dictionary-600 hover:bg-dictionary-700">
                  Add New Entry
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DictionaryPage;
