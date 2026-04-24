import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Tent, Star, Shield, Leaf } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ListingCard from '../components/ListingCard';

const CATEGORIES = [
  { value: '', label: 'All', emoji: '🏕️' },
  { value: 'backyard', label: 'Backyard', emoji: '🌳' },
  { value: 'farm', label: 'Farm', emoji: '🐄' },
  { value: 'forest', label: 'Forest', emoji: '🌲' },
  { value: 'lakeside', label: 'Lakeside', emoji: '🏞️' },
  { value: 'glamping', label: 'Glamping', emoji: '✨' },
];

export default function Home() {
  const { listings } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  const featured = listings
    .filter((l) => !activeCategory || l.type === activeCategory)
    .sort((a, b) => b.rating - a.rating);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div
        className="relative min-h-[520px] flex items-center justify-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.2)), url(https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="text-center px-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <Tent size={16} />
            Find your perfect camping spot
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Camp anywhere.<br />Stay everywhere.
          </h1>
          <p className="text-white/90 text-lg mb-8">
            Discover unique campsites on private land — from backyards to lakeside paradises.
          </p>

          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by city, state, or keyword..."
                className="w-full pl-10 pr-4 py-3.5 rounded-xl text-gray-900 text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-3.5 rounded-xl font-semibold text-sm transition-colors shadow-lg flex items-center gap-2"
            >
              <Search size={16} />
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Why CampSpot */}
      <div className="bg-white py-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <MapPin className="text-green-600" size={22} />
              </div>
              <h3 className="font-semibold text-gray-900">Unique locations</h3>
              <p className="text-gray-500 text-sm">Private farms, forests, lakesides, and backyards you won't find anywhere else.</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Star className="text-amber-500" size={22} />
              </div>
              <h3 className="font-semibold text-gray-900">Real reviews</h3>
              <p className="text-gray-500 text-sm">Genuine reviews from verified campers. No hidden surprises.</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="text-blue-500" size={22} />
              </div>
              <h3 className="font-semibold text-gray-900">Safe &amp; secure</h3>
              <p className="text-gray-500 text-sm">Verified hosts, secure payments, and 24/7 support for your peace of mind.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.value
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {activeCategory ? `${CATEGORIES.find((c) => c.value === activeCategory)?.label} spots` : 'Top-rated spots'}
          </h2>
          <button
            onClick={() => navigate('/search')}
            className="text-green-600 text-sm font-medium hover:underline"
          >
            View all →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        {/* Host CTA */}
        <div className="mt-12 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white">
            <div className="flex items-center gap-2 mb-2">
              <Leaf size={20} />
              <span className="font-semibold text-green-100">Earn from your land</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">Have land? Host campers.</h3>
            <p className="text-green-100 text-sm max-w-md">
              List your backyard, farm, or campsite and earn extra income while sharing your outdoor space with nature lovers.
            </p>
          </div>
          <button
            onClick={() => navigate('/host')}
            className="bg-white text-green-700 font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition-colors whitespace-nowrap"
          >
            Become a Host
          </button>
        </div>
      </div>
    </div>
  );
}
