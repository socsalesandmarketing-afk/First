import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Map, LayoutGrid, X, Search as SearchIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ListingCard from '../components/ListingCard';
import MapView from '../components/MapView';
import FacilityBadge, { FACILITY_CONFIG } from '../components/FacilityBadge';
import type { Facility } from '../types';

const TYPES = ['backyard', 'campsite', 'glamping', 'farm', 'forest', 'lakeside'];

export default function Search() {
  const { listings } = useApp();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';

  const [query, setQuery] = useState(initialQuery);
  const [maxPrice, setMaxPrice] = useState(200);
  const [minRating, setMinRating] = useState(0);
  const [selectedFacilities, setSelectedFacilities] = useState<Facility[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<'grid' | 'map'>('grid');
  const [hoveredId, setHoveredId] = useState<string | undefined>();

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        l.title.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.state.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q);
      const matchesPrice = l.pricePerNight <= maxPrice;
      const matchesRating = l.rating >= minRating;
      const matchesFacilities = selectedFacilities.every((f) => l.facilities.includes(f));
      const matchesType = !selectedType || l.type === selectedType;
      return matchesQuery && matchesPrice && matchesRating && matchesFacilities && matchesType;
    });
  }, [listings, query, maxPrice, minRating, selectedFacilities, selectedType]);

  function toggleFacility(f: Facility) {
    setSelectedFacilities((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  }

  function clearFilters() {
    setQuery('');
    setMaxPrice(200);
    setMinRating(0);
    setSelectedFacilities([]);
    setSelectedType('');
  }

  const hasActiveFilters = maxPrice < 200 || minRating > 0 || selectedFacilities.length > 0 || selectedType;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-7xl mx-auto flex gap-3 items-center">
          <div className="flex-1 relative">
            <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search locations, spots..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-colors ${
              showFilters || hasActiveFilters ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            <SlidersHorizontal size={15} />
            Filters
            {hasActiveFilters && <span className="bg-green-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">{[maxPrice < 200, minRating > 0, selectedFacilities.length > 0, !!selectedType].filter(Boolean).length}</span>}
          </button>
          <div className="flex border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setView('grid')}
              className={`px-3 py-2.5 ${view === 'grid' ? 'bg-green-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setView('map')}
              className={`px-3 py-2.5 ${view === 'map' ? 'bg-green-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <Map size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white border-b border-gray-100 px-4 py-5">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Max price: <span className="text-green-600">${maxPrice}/night</span>
                </label>
                <input
                  type="range"
                  min={10}
                  max={200}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-green-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>$10</span>
                  <span>$200+</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Min rating: <span className="text-green-600">{minRating > 0 ? `${minRating}+ ★` : 'Any'}</span>
                </label>
                <div className="flex gap-2">
                  {[0, 3, 4, 4.5].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        minRating === r ? 'bg-green-600 text-white border-green-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {r === 0 ? 'Any' : `${r}+`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Spot type</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedType('')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${!selectedType ? 'bg-green-600 text-white border-green-600' : 'border-gray-200 text-gray-600'}`}
                  >
                    All
                  </button>
                  {TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedType(selectedType === t ? '' : t)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors capitalize ${selectedType === t ? 'bg-green-600 text-white border-green-600' : 'border-gray-200 text-gray-600'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Facilities</label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(FACILITY_CONFIG) as Facility[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => toggleFacility(f)}
                    className={`transition-all ${selectedFacilities.includes(f) ? 'ring-2 ring-green-500 ring-offset-1' : ''}`}
                  >
                    <FacilityBadge facility={f} />
                  </button>
                ))}
              </div>
            </div>

            {hasActiveFilters && (
              <button onClick={clearFilters} className="mt-4 flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 font-medium">
                <X size={14} />
                Clear all filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-sm text-gray-500 mb-5">
          <span className="font-semibold text-gray-900">{filtered.length}</span> spot{filtered.length !== 1 ? 's' : ''} found
          {query && <span> for "<span className="text-green-600">{query}</span>"</span>}
        </p>

        {view === 'grid' ? (
          filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((listing) => (
                <div key={listing.id} onMouseEnter={() => setHoveredId(listing.id)} onMouseLeave={() => setHoveredId(undefined)}>
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4">🏕️</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No spots found</h3>
              <p className="text-sm">Try adjusting your filters or search terms.</p>
              <button onClick={clearFilters} className="mt-4 text-green-600 font-medium text-sm hover:underline">
                Clear all filters
              </button>
            </div>
          )
        ) : (
          <div className="h-[600px] rounded-2xl overflow-hidden shadow-md">
            <MapView listings={filtered} highlightedId={hoveredId} />
          </div>
        )}
      </div>
    </div>
  );
}
