import { useNavigate } from 'react-router-dom';
import { Calendar, Star, Tent, MapPin, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';
import ListingCard from '../components/ListingCard';

export default function Profile() {
  const { currentUser, bookings, reviews, listings } = useApp();
  const navigate = useNavigate();

  const myBookings = bookings.filter((b) => b.userId === currentUser.id);
  const myReviews = reviews.filter((r) => r.userId === currentUser.id);
  const myListings = listings.filter((l) => l.hostId === currentUser.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-full bg-gray-100 border-4 border-white shadow"
            />
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{currentUser.name}</h1>
              <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                <Calendar size={13} />
                Joined {format(new Date(currentUser.joinedDate), 'MMMM yyyy')}
              </p>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{currentUser.bio}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100 text-center">
            <div>
              <div className="text-xl font-bold text-gray-900">{myBookings.length}</div>
              <div className="text-xs text-gray-500">Trips</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{myReviews.length}</div>
              <div className="text-xs text-gray-500">Reviews</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{myListings.length}</div>
              <div className="text-xs text-gray-500">Listings</div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => navigate('/bookings')}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <MapPin size={18} className="text-green-600" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm text-gray-900">My Trips</div>
              <div className="text-xs text-gray-500">{myBookings.length} booking{myBookings.length !== 1 ? 's' : ''}</div>
            </div>
            <ChevronRight size={16} className="text-gray-400 ml-auto" />
          </button>
          <button
            onClick={() => navigate('/host')}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Tent size={18} className="text-amber-600" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm text-gray-900">Host Dashboard</div>
              <div className="text-xs text-gray-500">{myListings.length} listing{myListings.length !== 1 ? 's' : ''}</div>
            </div>
            <ChevronRight size={16} className="text-gray-400 ml-auto" />
          </button>
        </div>

        {/* My reviews */}
        {myReviews.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Star size={16} className="text-amber-400 fill-amber-400" />
              Your reviews
            </h2>
            <div className="space-y-4">
              {myReviews.map((r) => (
                <div key={r.id} className="text-sm border-b border-gray-50 last:border-0 pb-3 last:pb-0">
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={12} className={s <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                    ))}
                    <span className="text-gray-400 text-xs ml-1">{format(new Date(r.date), 'MMM yyyy')}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My listings */}
        {myListings.length > 0 && (
          <div>
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Tent size={16} className="text-green-600" />
              Your listings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myListings.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
