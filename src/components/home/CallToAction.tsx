
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface CallToActionProps {
  isLoggedIn: boolean;
}

const CallToAction = ({ isLoggedIn }: CallToActionProps) => {
  return (
    <section className="my-16 bg-dictionary-50 p-8 rounded-lg text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Involved Today</h2>
      <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
        Join our community and help preserve and promote the Hmar language by contributing to this open dictionary project.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        {!isLoggedIn ? (
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
  );
};

export default CallToAction;
