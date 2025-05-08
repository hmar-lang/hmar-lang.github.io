
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface HeroProps {
  isLoggedIn: boolean;
}

const Hero = ({ isLoggedIn }: HeroProps) => {
  return (
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
          {isLoggedIn ? (
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
  );
};

export default Hero;
