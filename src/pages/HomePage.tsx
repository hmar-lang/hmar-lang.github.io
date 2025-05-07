
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

interface DictionaryEntry {
  id: string;
  word: string;
  part_of_speech: string;
  definition: string;
}

interface StatCount {
  count: number;
}

const HomePage = () => {
  const [recentEntries, setRecentEntries] = useState<DictionaryEntry[]>([]);
  const [entriesCount, setEntriesCount] = useState<number>(0);
  const [usersCount, setUsersCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recent entries
        const { data: entries, error: entriesError } = await supabase
          .from('dictionary_entries')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (entriesError) throw entriesError;
        setRecentEntries(entries as DictionaryEntry[]);
        
        // Get total entries count
        const { data: entriesCountData, error: countError } = await supabase
          .from('dictionary_entries')
          .select('count', { count: 'exact', head: true });
          
        if (countError) throw countError;
        setEntriesCount((entriesCountData as StatCount[])[0]?.count || 0);
        
        // Get total users count
        const { data: usersCountData, error: usersError } = await supabase
          .from('users')
          .select('count', { count: 'exact', head: true });
          
        if (usersError) throw usersError;
        setUsersCount((usersCountData as StatCount[])[0]?.count || 0);
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-dictionary-700 to-dictionary-500 text-white py-20 px-4 rounded-lg shadow-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Hmar Open Dictionary</h1>
          <p className="text-xl mb-8">
            Discover, learn, and contribute to the growing collection of Hmar language words and definitions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/dictionary">
              <Button size="lg" className="bg-white text-dictionary-700 hover:bg-gray-100">
                Browse Dictionary
              </Button>
            </Link>
            {user ? (
              <Link to="/dictionary/add">
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                  Add New Word
                </Button>
              </Link>
            ) : (
              <Link to="/signin">
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                  Sign In to Contribute
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="my-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-3xl font-bold text-dictionary-600 mb-2">{isLoading ? '...' : entriesCount}</h3>
            <p className="text-gray-600">Dictionary Entries</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-3xl font-bold text-dictionary-600 mb-2">{isLoading ? '...' : usersCount}</h3>
            <p className="text-gray-600">Community Members</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-3xl font-bold text-dictionary-600 mb-2">Free</h3>
            <p className="text-gray-600">Open-Source Project</p>
          </div>
        </div>
      </section>

      {/* Recent Entries Section */}
      <section className="my-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Additions</h2>
          <Link to="/dictionary" className="text-dictionary-600 hover:text-dictionary-700">
            View all entries →
          </Link>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">Loading recent entries...</div>
        ) : recentEntries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentEntries.map((entry) => (
              <Link to={`/dictionary/${entry.id}`} key={entry.id}>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{entry.word}</h3>
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded mt-1">
                        {entry.part_of_speech}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-3 line-clamp-2">{entry.definition}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No entries yet! Be the first to contribute.</p>
            <Link to="/dictionary/add" className="mt-4 inline-block">
              <Button className="bg-dictionary-600 hover:bg-dictionary-700">Add First Entry</Button>
            </Link>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="my-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-dictionary-100 text-dictionary-600 flex items-center justify-center rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Community Contributions</h3>
            <p className="text-gray-600">
              Anyone can contribute new words and definitions to help grow our collective knowledge of the Hmar language.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-dictionary-100 text-dictionary-600 flex items-center justify-center rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Advanced Search</h3>
            <p className="text-gray-600">
              Quickly find words with our powerful search and filtering capabilities that work in real-time.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-dictionary-100 text-dictionary-600 flex items-center justify-center rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Bulk Import</h3>
            <p className="text-gray-600">
              Import multiple dictionary entries at once by uploading CSV files, making it easy to add large collections.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="my-16 bg-dictionary-50 p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Involved Today</h2>
        <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
          Join our community and help preserve and promote the Hmar language by contributing to this open dictionary project.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {!user ? (
            <Link to="/signup">
              <Button size="lg" className="bg-dictionary-600 hover:bg-dictionary-700">Create Your Account</Button>
            </Link>
          ) : (
            <Link to="/dictionary/add">
              <Button size="lg" className="bg-dictionary-600 hover:bg-dictionary-700">Add New Words</Button>
            </Link>
          )}
          <Link to="/about">
            <Button size="lg" variant="outline" className="border-dictionary-300">Learn More</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
