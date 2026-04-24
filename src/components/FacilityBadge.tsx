import { Droplets, Zap, Flame, Toilet, ShowerHead, Wifi, PawPrint, Truck, UtensilsCrossed, Car, Waves, Fish } from 'lucide-react';
import type { Facility } from '../types';

const FACILITY_CONFIG: Record<Facility, { label: string; icon: React.ReactNode; color: string }> = {
  water: { label: 'Water', icon: <Droplets size={14} />, color: 'bg-blue-100 text-blue-700' },
  electricity: { label: 'Electric', icon: <Zap size={14} />, color: 'bg-yellow-100 text-yellow-700' },
  fire_pit: { label: 'Fire Pit', icon: <Flame size={14} />, color: 'bg-orange-100 text-orange-700' },
  restrooms: { label: 'Restrooms', icon: <Toilet size={14} />, color: 'bg-purple-100 text-purple-700' },
  showers: { label: 'Showers', icon: <ShowerHead size={14} />, color: 'bg-cyan-100 text-cyan-700' },
  wifi: { label: 'WiFi', icon: <Wifi size={14} />, color: 'bg-indigo-100 text-indigo-700' },
  pet_friendly: { label: 'Pet Friendly', icon: <PawPrint size={14} />, color: 'bg-green-100 text-green-700' },
  rv_friendly: { label: 'RV Friendly', icon: <Truck size={14} />, color: 'bg-gray-100 text-gray-700' },
  picnic_table: { label: 'Picnic Table', icon: <UtensilsCrossed size={14} />, color: 'bg-lime-100 text-lime-700' },
  parking: { label: 'Parking', icon: <Car size={14} />, color: 'bg-slate-100 text-slate-700' },
  swimming: { label: 'Swimming', icon: <Waves size={14} />, color: 'bg-sky-100 text-sky-700' },
  fishing: { label: 'Fishing', icon: <Fish size={14} />, color: 'bg-teal-100 text-teal-700' },
};

interface Props {
  facility: Facility;
  size?: 'sm' | 'md';
}

export default function FacilityBadge({ facility, size = 'md' }: Props) {
  const config = FACILITY_CONFIG[facility];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${config.color} ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'}`}>
      {config.icon}
      {config.label}
    </span>
  );
}

export { FACILITY_CONFIG };
