
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface DictionaryEntry {
  id: string;
  word: string;
  part_of_speech: string;
  definition: string;
}

interface RecentEntriesProps {
  entries: DictionaryEntry[];
  isLoading: boolean;
}

const RecentEntries = ({ entries, isLoading }: RecentEntriesProps) => {
  return (
    <section className="my-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Recent Additions</h2>
        <Link to="/dictionary" className="text-dictionary-600 hover:text-dictionary-700">
          View all entries →
        </Link>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">Loading recent entries...</div>
      ) : entries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
  );
};

export default RecentEntries;
