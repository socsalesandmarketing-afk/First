import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import type { Listing } from '../types';

// Fix default marker icons for Vite/webpack builds
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function createPriceIcon(price: number, highlighted = false) {
  return L.divIcon({
    className: '',
    html: `<div style="
      background: ${highlighted ? '#16a34a' : 'white'};
      color: ${highlighted ? 'white' : '#1a1a1a'};
      border: 2px solid ${highlighted ? '#16a34a' : '#d1d5db'};
      border-radius: 20px;
      padding: 4px 10px;
      font-size: 13px;
      font-weight: 700;
      font-family: system-ui, sans-serif;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      cursor: pointer;
    ">$${price}</div>`,
    iconAnchor: [30, 15],
  });
}

interface Props {
  listings: Listing[];
  center?: [number, number];
  zoom?: number;
  highlightedId?: string;
}

export default function MapView({ listings, center, zoom = 5, highlightedId }: Props) {
  const navigate = useNavigate();
  const mapCenter: [number, number] = center ?? [39.5, -98.35];

  return (
    <MapContainer center={mapCenter} zoom={zoom} className="w-full h-full" scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {listings.map((listing) => (
        <Marker
          key={listing.id}
          position={[listing.lat, listing.lng]}
          icon={createPriceIcon(listing.pricePerNight, listing.id === highlightedId)}
        >
          <Popup maxWidth={220}>
            <div
              className="cursor-pointer"
              onClick={() => navigate(`/listing/${listing.id}`)}
            >
              <img
                src={listing.images[0]}
                alt={listing.title}
                style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 6, marginBottom: 6 }}
              />
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{listing.title}</div>
              <div style={{ color: '#6b7280', fontSize: 12, marginBottom: 4 }}>{listing.city}, {listing.state}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#16a34a' }}>${listing.pricePerNight}/night</div>
              <div style={{ color: '#f59e0b', fontSize: 12 }}>★ {listing.rating.toFixed(1)} ({listing.reviewCount})</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
