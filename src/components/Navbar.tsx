
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, Search, User, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { user, signOut, userProfile } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-dictionary-700">Hmar</span>
          <span className="text-2xl font-light text-dictionary-500 ml-1">Dictionary</span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100 block md:hidden"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-dictionary-600">Home</Link>
          <Link to="/dictionary" className="text-gray-700 hover:text-dictionary-600">Dictionary</Link>
          <Link to="/about" className="text-gray-700 hover:text-dictionary-600">About</Link>
          <Link to="/faq" className="text-gray-700 hover:text-dictionary-600">FAQ</Link>
          <Link to="/tutorials" className="text-gray-700 hover:text-dictionary-600">Tutorials</Link>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 text-gray-700 hover:text-dictionary-600">
                  <User size={20} />
                  <span>{userProfile?.username || 'User'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                {userProfile?.is_admin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin">Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex space-x-2">
              <Link to="/signin">
                <Button variant="outline" className="text-dictionary-600 border-dictionary-300 hover:bg-dictionary-50">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-dictionary-600 text-white hover:bg-dictionary-700">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white shadow-md py-4 z-50 md:hidden">
            <div className="flex flex-col space-y-3 container mx-auto px-4">
              <Link to="/" className="text-gray-700 py-2 hover:bg-gray-100 rounded px-3" onClick={toggleMenu}>Home</Link>
              <Link to="/dictionary" className="text-gray-700 py-2 hover:bg-gray-100 rounded px-3" onClick={toggleMenu}>Dictionary</Link>
              <Link to="/about" className="text-gray-700 py-2 hover:bg-gray-100 rounded px-3" onClick={toggleMenu}>About</Link>
              <Link to="/faq" className="text-gray-700 py-2 hover:bg-gray-100 rounded px-3" onClick={toggleMenu}>FAQ</Link>
              <Link to="/tutorials" className="text-gray-700 py-2 hover:bg-gray-100 rounded px-3" onClick={toggleMenu}>Tutorials</Link>
              
              {user ? (
                <>
                  <Link to="/profile" className="text-gray-700 py-2 hover:bg-gray-100 rounded px-3" onClick={toggleMenu}>Profile</Link>
                  {userProfile?.is_admin && (
                    <Link to="/admin" className="text-gray-700 py-2 hover:bg-gray-100 rounded px-3" onClick={toggleMenu}>Admin Dashboard</Link>
                  )}
                  <button 
                    onClick={() => {
                      signOut();
                      toggleMenu();
                    }}
                    className="text-left text-gray-700 py-2 hover:bg-gray-100 rounded px-3"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link 
                    to="/signin" 
                    className="text-dictionary-600 border border-dictionary-300 py-2 rounded text-center"
                    onClick={toggleMenu}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/signup" 
                    className="bg-dictionary-600 text-white py-2 rounded text-center"
                    onClick={toggleMenu}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Search Bar */}
      <div className="bg-dictionary-50 border-t border-b border-dictionary-100">
        <div className="container mx-auto px-4 py-3">
          <form className="flex items-center">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input 
                type="search" 
                className="block w-full p-2 pl-10 text-sm border border-dictionary-200 rounded-md focus:ring-dictionary-500 focus:border-dictionary-500" 
                placeholder="Search for words..."
              />
            </div>
            <Button 
              type="submit" 
              className="ml-2 bg-dictionary-600 hover:bg-dictionary-700 text-white"
            >
              Search
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
