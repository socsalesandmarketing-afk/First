import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Star } from 'lucide-react';
import type { Listing } from '../types';
import FacilityBadge from './FacilityBadge';

const TYPE_LABELS: Record<string, string> = {
  backyard: 'Backyard',
  campsite: 'Campsite',
  glamping: 'Glamping',
  farm: 'Farm',
  forest: 'Forest',
  lakeside: 'Lakeside',
};

interface Props {
  listing: Listing;
}

export default function ListingCard({ listing }: Props) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/listing/${listing.id}`)}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group border border-gray-100"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-green-700 font-semibold text-xs px-2.5 py-1 rounded-full">
            {TYPE_LABELS[listing.type]}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 backdrop-blur-sm text-gray-800 font-semibold text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            {listing.rating.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-1">{listing.title}</h3>

        <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
          <MapPin size={12} />
          <span>{listing.city}, {listing.state}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {listing.facilities.slice(0, 3).map((f) => (
            <FacilityBadge key={f} facility={f} size="sm" />
          ))}
          {listing.facilities.length > 3 && (
            <span className="text-xs text-gray-400 self-center">+{listing.facilities.length - 3} more</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <Users size={12} />
            <span>Up to {listing.maxGuests} guests</span>
          </div>
          <div className="text-right">
            <span className="font-bold text-gray-900">${listing.pricePerNight}</span>
            <span className="text-gray-400 text-xs"> /night</span>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span>{listing.rating.toFixed(1)} ({listing.reviewCount} reviews)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
