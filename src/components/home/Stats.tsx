
import React from 'react';

interface StatsProps {
  entriesCount: number;
  usersCount: number;
  isLoading: boolean;
}

const Stats = ({ entriesCount, usersCount, isLoading }: StatsProps) => {
  return (
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
  );
};

export default Stats;
