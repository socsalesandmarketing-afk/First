import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Listing, Review, Booking, User, SearchFilters } from '../types';
import { LISTINGS, REVIEWS, BOOKINGS, CURRENT_USER } from '../data/mockData';

interface AppContextType {
  listings: Listing[];
  reviews: Review[];
  bookings: Booking[];
  currentUser: User;
  filters: SearchFilters;
  setFilters: (f: SearchFilters) => void;
  addReview: (review: Review) => void;
  addBooking: (booking: Booking) => void;
  addListing: (listing: Listing) => void;
  getListingReviews: (listingId: string) => Review[];
}

const defaultFilters: SearchFilters = {
  query: '',
  maxPrice: 200,
  minRating: 0,
  facilities: [],
  type: '',
  guests: 1,
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Listing[]>(LISTINGS);
  const [reviews, setReviews] = useState<Review[]>(REVIEWS);
  const [bookings, setBookings] = useState<Booking[]>(BOOKINGS);
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);

  function addReview(review: Review) {
    setReviews((prev) => [review, ...prev]);
  }

  function addBooking(booking: Booking) {
    setBookings((prev) => [...prev, booking]);
  }

  function addListing(listing: Listing) {
    setListings((prev) => [...prev, listing]);
  }

  function getListingReviews(listingId: string) {
    return reviews.filter((r) => r.listingId === listingId);
  }

  return (
    <AppContext.Provider
      value={{ listings, reviews, bookings, currentUser: CURRENT_USER, filters, setFilters, addReview, addBooking, addListing, getListingReviews }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
