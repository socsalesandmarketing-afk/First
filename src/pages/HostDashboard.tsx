import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Check, Tent } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Listing, Facility } from '../types';
import { FACILITY_CONFIG } from '../components/FacilityBadge';

const TYPES = ['backyard', 'campsite', 'glamping', 'farm', 'forest', 'lakeside'] as const;

const STOCK_IMAGES: Record<string, string> = {
  backyard: 'https://images.unsplash.com/photo-1533619943076-c09eba1e9e12?w=800&q=80',
  campsite: 'https://images.unsplash.com/photo-1487730116645-74489c95b41b?w=800&q=80',
  glamping: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  farm: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
  forest: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
  lakeside: 'https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?w=800&q=80',
};

export default function HostDashboard() {
  const { addListing, currentUser, listings } = useApp();
  const navigate = useNavigate();

  const myListings = listings.filter((l) => l.hostId === currentUser.id);
  const [showForm, setShowForm] = useState(myListings.length === 0);
  const [submitted, setSubmitted] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<(typeof TYPES)[number]>('backyard');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [price, setPrice] = useState('');
  const [maxGuests, setMaxGuests] = useState('4');
  const [maxTents, setMaxTents] = useState('2');
  const [selectedFacilities, setSelectedFacilities] = useState<Facility[]>([]);

  function toggleFacility(f: Facility) {
    setSelectedFacilities((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const listing: Listing = {
      id: `l${Date.now()}`,
      title,
      description,
      type,
      hostId: currentUser.id,
      hostName: currentUser.name,
      hostAvatar: currentUser.avatar,
      location,
      city,
      state,
      lat: 39.5 + (Math.random() - 0.5) * 20,
      lng: -98.35 + (Math.random() - 0.5) * 40,
      pricePerNight: Number(price),
      maxGuests: Number(maxGuests),
      maxTents: Number(maxTents),
      images: [STOCK_IMAGES[type]],
      facilities: selectedFacilities,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    addListing(listing);
    setSubmitted(true);
    setTimeout(() => {
      navigate(`/listing/${listing.id}`);
    }, 2000);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Host Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">List your space and start earning.</p>
          </div>
          {myListings.length > 0 && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700"
            >
              <PlusCircle size={16} />
              Add listing
            </button>
          )}
        </div>

        {/* Existing listings */}
        {myListings.length > 0 && !showForm && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Your listings</h2>
            {myListings.map((l) => (
              <div
                key={l.id}
                onClick={() => navigate(`/listing/${l.id}`)}
                className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
              >
                <img src={l.images[0]} alt={l.title} className="w-20 h-20 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-sm mb-1 truncate">{l.title}</div>
                  <div className="text-xs text-gray-500 mb-2">{l.city}, {l.state}</div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-green-700 font-bold">${l.pricePerNight}/night</span>
                    <span className="text-gray-400">{l.reviewCount} reviews</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form */}
        {showForm && (
          submitted ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Your spot is live!</h2>
              <p className="text-gray-500 text-sm">Redirecting you to your new listing...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Tent size={20} className="text-green-600" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">List your spot</h2>
                  <p className="text-xs text-gray-500">Fill in the details below</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Spot title *</label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Peaceful Meadow with Mountain Views"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Type of spot *</label>
                <div className="grid grid-cols-3 gap-2">
                  {TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`py-2 px-3 rounded-xl text-sm font-medium border capitalize transition-colors ${type === t ? 'bg-green-600 text-white border-green-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your spot, what's nearby, what guests can expect..."
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="123 Nature Lane (shown after booking)"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">City *</label>
                  <input
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">State *</label>
                  <input
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                    maxLength={2}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Price/night ($) *</label>
                  <input
                    required
                    type="number"
                    min={5}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="35"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Max guests</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={maxGuests}
                    onChange={(e) => setMaxGuests(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Max tents</label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={maxTents}
                    onChange={(e) => setMaxTents(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Facilities</label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(FACILITY_CONFIG) as Facility[]).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => toggleFacility(f)}
                      className={`transition-all ${selectedFacilities.includes(f) ? 'ring-2 ring-green-500 ring-offset-1' : 'opacity-60 hover:opacity-100'}`}
                    >
                      <span className={`inline-flex items-center gap-1 rounded-full font-medium px-2.5 py-1 text-xs ${FACILITY_CONFIG[f].color}`}>
                        {FACILITY_CONFIG[f].icon}
                        {FACILITY_CONFIG[f].label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-green-700 transition-colors"
              >
                Publish your spot
              </button>
            </form>
          )
        )}
      </div>
    </div>
  );
}
