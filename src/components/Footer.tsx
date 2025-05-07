
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-dictionary-700">Hmar</span>
              <span className="text-2xl font-light text-dictionary-500 ml-1">Dictionary</span>
            </Link>
            <p className="mt-4 text-gray-600">
              An open dictionary for the Hmar language, created by the community for everyone.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-dictionary-600">Home</Link>
              </li>
              <li>
                <Link to="/dictionary" className="text-gray-600 hover:text-dictionary-600">Dictionary</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-dictionary-600">About</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-dictionary-600">FAQ</Link>
              </li>
              <li>
                <Link to="/tutorials" className="text-gray-600 hover:text-dictionary-600">Tutorials</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contribute" className="text-gray-600 hover:text-dictionary-600">Contribute</Link>
              </li>
              <li>
                <a href="https://github.com/hmar-lang" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-dictionary-600">GitHub</a>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-dictionary-600">Contact</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6">
          <p className="text-sm text-gray-500 text-center">
            © {currentYear} Hmar Open Dictionary. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
