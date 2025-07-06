
import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, TvIcon, ClapperboardIcon, FlameIcon } from './icons';

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string; end?: boolean; }> = ({ to, icon, label, end = false }) => {
  const activeClass = 'bg-brand-surface-2 text-brand-primary';
  const inactiveClass = 'text-brand-text-dim hover:bg-brand-surface-2 hover:text-brand-text';
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${isActive ? activeClass : inactiveClass}`
      }
    >
      {icon}
      <span className="ml-4 font-semibold">{label}</span>
    </NavLink>
  );
};

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-brand-surface flex-shrink-0 flex flex-col p-4 space-y-2">
      <div className="text-2xl font-bold text-brand-text mb-6 px-4">9Watch</div>
      <nav className="flex-grow">
        <NavItem to="/" icon={<HomeIcon className="w-6 h-6" />} label="Home" end={true} />
        <NavItem to="/tv-shows" icon={<TvIcon className="w-6 h-6" />} label="TV show" />
        <NavItem to="/movies" icon={<ClapperboardIcon className="w-6 h-6" />} label="Movies" />
        <NavItem to="/browse" icon={<FlameIcon className="w-6 h-6 text-orange-500" />} label="Discover" />
      </nav>
      <div className="mt-auto">
         <div className="bg-brand-surface-2 p-3 rounded-lg flex items-center space-x-3">
             <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://example.com" alt="QR Code" className="w-16 h-16 rounded-md" />
             <div>
                <p className="text-sm font-bold text-brand-text">Get Mobile app</p>
                <p className="text-xs text-brand-text-dim">Our app is better</p>
             </div>
         </div>
         <div className="text-xs text-brand-text-dim mt-4 text-center">
             <p>moviebox.ng@mbox.ng</p>
             <p className="mt-1">
                 <a href="#" className="hover:text-brand-text">Privacy Policy</a>
                 <span className="mx-2">·</span>
                 <a href="#" className="hover:text-brand-text">User Agreement</a>
             </p>
         </div>
      </div>
    </aside>
  );
};

export default Sidebar;
