
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import Hero from '@/components/home/Hero';
import Stats from '@/components/home/Stats';
import RecentEntries from '@/components/home/RecentEntries';
import Features from '@/components/home/Features';
import CallToAction from '@/components/home/CallToAction';

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
      <Hero isLoggedIn={!!user} />
      <Stats 
        entriesCount={entriesCount} 
        usersCount={usersCount} 
        isLoading={isLoading} 
      />
      <RecentEntries 
        entries={recentEntries} 
        isLoading={isLoading} 
      />
      <Features />
      <CallToAction isLoggedIn={!!user} />
    </div>
  );
};

export default HomePage;
