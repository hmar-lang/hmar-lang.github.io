
import React from 'react';

const Features = () => {
  return (
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
  );
};

export default Features;
