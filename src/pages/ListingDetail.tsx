import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, MapPin, Users, Tent, Star, Share2, Heart, ChevronLeft, ChevronRight, Navigation } from 'lucide-react';
import { useApp } from '../context/AppContext';
import FacilityBadge from '../components/FacilityBadge';
import ReviewCard from '../components/ReviewCard';
import StarRating from '../components/StarRating';
import MapView from '../components/MapView';
import type { Review, Booking } from '../types';
import { format, differenceInDays } from 'date-fns';

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const { listings, getListingReviews, currentUser, addReview, addBooking } = useApp();
  const navigate = useNavigate();

  const listing = listings.find((l) => l.id === id);
  const reviews = getListingReviews(id ?? '');

  const [imgIndex, setImgIndex] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-5xl mb-4">🏕️</div>
          <p>Listing not found.</p>
          <button onClick={() => navigate('/')} className="mt-4 text-green-600 font-medium">Back to home</button>
        </div>
      </div>
    );
  }

  const nights = checkIn && checkOut ? differenceInDays(new Date(checkOut), new Date(checkIn)) : 0;
  const serviceFee = Math.round(listing.pricePerNight * nights * 0.12);
  const total = listing.pricePerNight * nights + serviceFee;

  function handleBook() {
    if (!listing || !checkIn || !checkOut || nights <= 0) return;
    const booking: Booking = {
      id: `b${Date.now()}`,
      listingId: listing.id,
      listingTitle: listing.title,
      listingImage: listing.images[0],
      userId: currentUser.id,
      checkIn,
      checkOut,
      guests,
      totalPrice: total,
      status: 'confirmed',
    };
    addBooking(booking);
    setBookingSuccess(true);
  }

  function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!listing || !newComment.trim()) return;
    const review: Review = {
      id: `r${Date.now()}`,
      listingId: listing.id,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      rating: newRating,
      comment: newComment.trim(),
      date: new Date().toISOString().split('T')[0],
      helpfulCount: 0,
    };
    addReview(review);
    setNewComment('');
    setNewRating(5);
    setShowReviewForm(false);
  }

  function getDirections() {
    if (!listing) return;
    const url = `https://www.openstreetmap.org/directions?from=&to=${listing.lat},${listing.lng}`;
    window.open(url, '_blank');
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Title */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{listing.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span className="font-semibold">{listing.rating.toFixed(1)}</span>
                <span>({listing.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{listing.location}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setSaved(!saved)}
              className={`p-2 rounded-full border transition-colors ${saved ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-200 text-gray-400 hover:text-gray-600'}`}
            >
              <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
            </button>
            <button className="p-2 rounded-full border border-gray-200 text-gray-400 hover:text-gray-600">
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* Images */}
        <div className="relative rounded-2xl overflow-hidden h-72 md:h-96 mb-8 shadow-md">
          <img
            src={listing.images[imgIndex]}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          {listing.images.length > 1 && (
            <>
              <button
                onClick={() => setImgIndex((i) => (i - 1 + listing.images.length) % listing.images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setImgIndex((i) => (i + 1) % listing.images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow"
              >
                <ChevronRight size={18} />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {listing.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === imgIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Host & quick stats */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-semibold text-green-600 uppercase tracking-wide capitalize">{listing.type}</span>
                  <h2 className="text-lg font-semibold text-gray-900 mt-0.5">Hosted by {listing.hostName}</h2>
                </div>
                <img src={listing.hostAvatar} alt={listing.hostName} className="w-12 h-12 rounded-full bg-gray-100" />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center border-t border-gray-100 pt-4">
                <div>
                  <div className="font-bold text-gray-900 text-lg">{listing.maxGuests}</div>
                  <div className="text-xs text-gray-500 flex items-center justify-center gap-1"><Users size={11} />guests</div>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">{listing.maxTents || '—'}</div>
                  <div className="text-xs text-gray-500 flex items-center justify-center gap-1"><Tent size={11} />tents</div>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">{listing.reviewCount}</div>
                  <div className="text-xs text-gray-500 flex items-center justify-center gap-1"><Star size={11} />reviews</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-3">About this spot</h2>
              <p className="text-gray-700 text-sm leading-relaxed">{listing.description}</p>
            </div>

            {/* Facilities */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">What's included</h2>
              <div className="flex flex-wrap gap-2">
                {listing.facilities.map((f) => (
                  <FacilityBadge key={f} facility={f} />
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Location</h2>
                <button
                  onClick={getDirections}
                  className="flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  <Navigation size={14} />
                  Get directions
                </button>
              </div>
              <div className="h-56 rounded-xl overflow-hidden">
                <MapView
                  listings={[listing]}
                  center={[listing.lat, listing.lng]}
                  zoom={12}
                  highlightedId={listing.id}
                />
              </div>
              <p className="text-sm text-gray-500 mt-3 flex items-center gap-1">
                <MapPin size={13} />
                {listing.location}
              </p>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-gray-900">Reviews</h2>
                  <div className="flex items-center gap-1 text-sm">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{listing.rating.toFixed(1)}</span>
                    <span className="text-gray-400">({reviews.length})</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="text-sm font-medium text-green-600 hover:text-green-700"
                >
                  + Write a review
                </button>
              </div>

              {showReviewForm && (
                <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-3 text-sm">Share your experience</h3>
                  <div className="mb-3">
                    <label className="block text-xs text-gray-600 mb-1">Your rating</label>
                    <StarRating rating={newRating} size={22} interactive onRate={setNewRating} />
                  </div>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Tell others about your stay..."
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  />
                  <div className="flex gap-2 mt-3">
                    <button type="submit" className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-green-700">
                      Submit
                    </button>
                    <button type="button" onClick={() => setShowReviewForm(false)} className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {reviews.length > 0 ? (
                reviews.map((r) => <ReviewCard key={r.id} review={r} />)
              ) : (
                <p className="text-gray-400 text-sm text-center py-6">No reviews yet. Be the first!</p>
              )}
            </div>
          </div>

          {/* Booking widget */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-2xl font-bold text-gray-900">${listing.pricePerNight}</span>
                <span className="text-gray-400 text-sm">/night</span>
              </div>
              <div className="flex items-center gap-1.5 mb-5">
                <StarRating rating={listing.rating} size={14} />
                <span className="text-sm text-gray-600">{listing.rating.toFixed(1)} · {listing.reviewCount} reviews</span>
              </div>

              {bookingSuccess ? (
                <div className="text-center py-6">
                  <div className="text-4xl mb-3">🎉</div>
                  <h3 className="font-bold text-green-700 text-lg mb-1">Booking confirmed!</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {format(new Date(checkIn), 'MMM d')} – {format(new Date(checkOut), 'MMM d, yyyy')} · {guests} guest{guests > 1 ? 's' : ''}
                  </p>
                  <button
                    onClick={() => navigate('/bookings')}
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-green-700"
                  >
                    View my trips
                  </button>
                </div>
              ) : (
                <>
                  <div className="border border-gray-200 rounded-xl overflow-hidden mb-3">
                    <div className="grid grid-cols-2 divide-x divide-gray-200">
                      <div className="p-3">
                        <label className="block text-xs font-bold text-gray-600 mb-1">CHECK-IN</label>
                        <input
                          type="date"
                          value={checkIn}
                          min={today}
                          onChange={(e) => setCheckIn(e.target.value)}
                          className="w-full text-sm text-gray-900 focus:outline-none"
                        />
                      </div>
                      <div className="p-3">
                        <label className="block text-xs font-bold text-gray-600 mb-1">CHECK-OUT</label>
                        <input
                          type="date"
                          value={checkOut}
                          min={checkIn || today}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="w-full text-sm text-gray-900 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="border-t border-gray-200 p-3">
                      <label className="block text-xs font-bold text-gray-600 mb-1">GUESTS</label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full text-sm text-gray-900 focus:outline-none"
                      >
                        {Array.from({ length: listing.maxGuests }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleBook}
                    disabled={!checkIn || !checkOut || nights <= 0}
                    className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors mb-3"
                  >
                    Reserve
                  </button>

                  {nights > 0 && (
                    <div className="text-sm space-y-2 border-t border-gray-100 pt-3">
                      <div className="flex justify-between text-gray-600">
                        <span>${listing.pricePerNight} × {nights} night{nights > 1 ? 's' : ''}</span>
                        <span>${listing.pricePerNight * nights}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Service fee</span>
                        <span>${serviceFee}</span>
                      </div>
                      <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-2 mt-2">
                        <span>Total</span>
                        <span>${total}</span>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-gray-400 text-center mt-3">You won't be charged yet</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
