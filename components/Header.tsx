import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SearchIcon, ClockIcon, MenuIcon } from './icons';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?q=${searchQuery.trim()}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="flex-shrink-0 bg-brand-surface/50 backdrop-blur-sm h-16 flex items-center px-6 z-10">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" aria-label="Toggle menu" className="text-brand-text-dim hover:text-brand-text">
          <MenuIcon className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-bold text-brand-text hidden md:block">9Watch</h1>
      </div>

      <div className="flex-1 flex justify-center px-8">
        <form onSubmit={handleSearch} className="relative w-full max-w-lg">
          <Input
            type="text"
            placeholder="Search movies/TV Shows"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-brand-surface-2 border-none rounded-full pl-12 pr-4 text-brand-text placeholder:text-brand-text-dim focus-visible:ring-brand-primary"
          />
          <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2">
            <SearchIcon className="w-5 h-5 text-brand-text-dim" />
          </button>
        </form>
      </div>

      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <Link to="/profile" className="flex items-center space-x-2 text-brand-text-dim hover:text-brand-text">
              <ClockIcon className="w-5 h-5" />
              <span className="text-sm hidden md:block">Watch history</span>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 bg-brand-surface-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-brand-primary text-white text-sm">
                      {user?.username?.substring(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-brand-surface border-brand-surface-2">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-red-500 focus:text-red-500 cursor-pointer"
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Link 
              to="/login"
              className="text-brand-text-dim hover:text-brand-text text-sm hidden md:block"
            >
              Sign in
            </Link>
            <Button asChild variant="brand">
              <Link to="/register">Sign up</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
