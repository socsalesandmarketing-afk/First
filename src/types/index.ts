export type Facility =
  | 'water'
  | 'electricity'
  | 'fire_pit'
  | 'restrooms'
  | 'showers'
  | 'wifi'
  | 'pet_friendly'
  | 'rv_friendly'
  | 'picnic_table'
  | 'parking'
  | 'swimming'
  | 'fishing';

export interface Listing {
  id: string;
  title: string;
  description: string;
  type: 'backyard' | 'campsite' | 'glamping' | 'farm' | 'forest' | 'lakeside';
  hostId: string;
  hostName: string;
  hostAvatar: string;
  location: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  pricePerNight: number;
  maxGuests: number;
  maxTents: number;
  images: string[];
  facilities: Facility[];
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface Review {
  id: string;
  listingId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  helpfulCount: number;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  isHost: boolean;
  joinedDate: string;
  bio: string;
}

export interface Booking {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
}

export interface SearchFilters {
  query: string;
  maxPrice: number;
  minRating: number;
  facilities: Facility[];
  type: string;
  guests: number;
}
