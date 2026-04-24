import { Link, useLocation } from 'react-router-dom';
import { Tent, Menu, X, User, Map } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser } = useApp();
  const location = useLocation();

  const navLinks = [
    { to: '/search', label: 'Find Spots', icon: <Map size={15} /> },
    { to: '/host', label: 'Host a Spot', icon: null },
    { to: '/bookings', label: 'My Trips', icon: null },
    { to: '/profile', label: 'Profile', icon: <User size={15} /> },
  ];

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-green-600 text-white p-1.5 rounded-lg group-hover:bg-green-700 transition-colors">
              <Tent size={20} />
            </div>
            <span className="font-bold text-xl text-gray-900">CampSpot</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'text-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/profile" className="flex items-center gap-2 border border-gray-200 rounded-full pl-3 pr-1 py-1 hover:shadow-md transition-shadow">
              <span className="text-sm font-medium text-gray-700">{currentUser.name.split(' ')[0]}</span>
              <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full bg-gray-100" />
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 text-sm font-medium py-2 ${
                location.pathname === link.to ? 'text-green-600' : 'text-gray-600'
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
