import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { MapPin, Crosshair } from 'lucide-react';
import toast from 'react-hot-toast';

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : <Marker position={position} />;
}

function MapUpdater({ position }) {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 15, {
        duration: 1.5
      });
    }
  }, [position, map]);

  return null;
}

const LocationPicker = ({ latitude, longitude, onLocationChange, error }) => {
  const [position, setPosition] = useState(
    latitude && longitude ? { lat: latitude, lng: longitude } : null
  );
  const [locating, setLocating] = useState(false);

  const handlePositionChange = (latlng) => {
    setPosition(latlng);
    onLocationChange(latlng.lat, latlng.lng);
  };

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const newPos = { lat: latitude, lng: longitude };
          handlePositionChange(newPos);
          setLocating(false);
          toast.success("Location detected!", { id: "geolocation" });
        },
        (error) => {
          setLocating(false);
          toast.error("Could not get your location. Please select on map.", {
            id: "geolocation-error",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      toast.error("Geolocation not supported by your browser");
    }
  };

  // Default center - India
  const defaultCenter = [20.5937, 78.9629];
  const center = position ? [position.lat, position.lng] : defaultCenter;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Location <span className="text-red-500">*</span>
        </label>
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={locating}
          className="bg-green-600 text-white text-xs px-3 py-1 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
        >
          <Crosshair className="w-3 h-3" />
          <span>{locating ? "Detecting..." : "Use My Location"}</span>
        </button>
      </div>
      
      <p className="text-xs text-gray-500 mb-2">
        Click on the map to select the exact location of the issue
      </p>
      
      <div className={`rounded-lg overflow-hidden border-2 ${error ? 'border-red-500' : 'border-gray-300'}`}>
        <MapContainer
          center={center}
          zoom={position ? 15 : 5}
          style={{ height: '300px', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapUpdater position={position} />
          <LocationMarker position={position} setPosition={handlePositionChange} />
        </MapContainer>
      </div>

      {position && (
        <div className="mt-2 text-xs text-gray-600 bg-green-50 p-2 rounded flex items-center">
          <Crosshair className="w-3 h-3 inline mr-1 text-green-600" />
          <span className="font-medium">Selected Location:</span>
          <span className="ml-1">{position.lat.toFixed(6)}, {position.lng.toFixed(6)}</span>
        </div>
      )}
      
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default LocationPicker;


