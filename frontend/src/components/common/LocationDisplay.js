import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icon in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const LocationDisplay = ({ latitude, longitude, title }) => {
  if (!latitude || !longitude) {
    return (
      <div className="text-gray-400 text-sm flex items-center">
        <MapPin className="w-4 h-4 mr-1" />
        No location data available
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-lg overflow-hidden border border-gray-300">
        <MapContainer
          center={[latitude, longitude]}
          zoom={15}
          style={{ height: '200px', width: '100%' }}
          scrollWheelZoom={false}
          dragging={true}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[latitude, longitude]}>
            <Popup>{title || 'Complaint Location'}</Popup>
          </Marker>
        </MapContainer>
      </div>
      
      <div className="mt-1 text-xs text-gray-500 flex items-center">
        <MapPin className="w-3 h-3 mr-1" />
        Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
      </div>
    </div>
  );
};

export default LocationDisplay;


