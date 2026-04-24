import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';

const STATUS_STYLES: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-gray-100 text-gray-600',
};

export default function Bookings() {
  const { bookings, currentUser } = useApp();
  const navigate = useNavigate();

  const myBookings = bookings
    .filter((b) => b.userId === currentUser.id)
    .sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime());

  const upcoming = myBookings.filter((b) => new Date(b.checkIn) >= new Date() && b.status !== 'cancelled');
  const past = myBookings.filter((b) => new Date(b.checkIn) < new Date() || b.status === 'completed');

  function renderBooking(b: typeof myBookings[0]) {
    return (
      <div
        key={b.id}
        onClick={() => navigate(`/listing/${b.listingId}`)}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="flex gap-4 p-4">
          <img src={b.listingImage} alt={b.listingTitle} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">{b.listingTitle}</h3>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_STYLES[b.status]}`}>
                {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
              </span>
            </div>
            <div className="space-y-1 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <Calendar size={12} />
                <span>
                  {format(new Date(b.checkIn), 'MMM d')} – {format(new Date(b.checkOut), 'MMM d, yyyy')}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users size={12} />
                <span>{b.guests} guest{b.guests > 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className="mt-2 font-bold text-green-700 text-sm">${b.totalPrice} total</div>
          </div>
        </div>
      </div>
    );
  }

  if (myBookings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🏕️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No trips yet</h2>
          <p className="text-gray-500 text-sm mb-6">You haven't booked any camping spots yet. Start exploring!</p>
          <button
            onClick={() => navigate('/search')}
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-green-700"
          >
            Find a spot
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Trips</h1>

        {upcoming.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
              <Clock size={14} />
              Upcoming
            </div>
            <div className="space-y-4">
              {upcoming.map(renderBooking)}
            </div>
          </div>
        )}

        {past.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              <MapPin size={14} />
              Past trips
            </div>
            <div className="space-y-4 opacity-80">
              {past.map(renderBooking)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
