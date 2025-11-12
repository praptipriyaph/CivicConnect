import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function FlyToLocation({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, Math.max(map.getZoom(), 14), { animate: true });
    }
  }, [position, map]);
  return null;
}

const LocationPicker = ({
  latitude,
  longitude,
  onLocationChange,
  error,
  className,
}) => {
  const [position, setPosition] = useState(
    latitude != null && longitude != null ? [latitude, longitude] : null,
  );
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const searchTimeout = useRef(null);

  useEffect(() => {
    if (latitude != null && longitude != null) {
      setPosition([latitude, longitude]);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    setLoadingSearch(true);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      try {
        const q = encodeURIComponent(query);
        const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&addressdetails=1&limit=6`;
        const res = await fetch(url, {
          headers: {
            "Accept-Language": "en-US",
            "User-Agent": "CivicConnect/1.0",
          },
        });
        const data = await res.json();
        setSuggestions(
          (data || []).map((d) => ({
            display_name: d.display_name,
            lat: parseFloat(d.lat),
            lon: parseFloat(d.lon),
            type: d.type,
          })),
        );
      } catch (e) {
        setSuggestions([]);
      } finally {
        setLoadingSearch(false);
      }
    }, 350);
    return () => clearTimeout(searchTimeout.current);
  }, [query]);

  const selectSuggestion = (s) => {
    const pos = [s.lat, s.lon];
    setPosition(pos);
    setSuggestions([]);
    setQuery(s.display_name);
    if (onLocationChange) onLocationChange(s.lat, s.lon);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not available in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        const p = [lat, lon];
        setPosition(p);
        if (onLocationChange) onLocationChange(lat, lon);
      },
      (err) => {
        alert("Unable to retrieve your location.");
      },
      { enableHighAccuracy: true },
    );
  };

  const onMarkerDragEnd = (e) => {
    const marker = e.target;
    const latlng = marker.getLatLng();
    const lat = latlng.lat;
    const lon = latlng.lng;
    setPosition([lat, lon]);
    if (onLocationChange) onLocationChange(lat, lon);
  };

  const clearSelection = () => {
    setPosition(null);
    setQuery("");
    setSuggestions([]);
    if (onLocationChange) onLocationChange(null, null);
  };

  const mapCenter = position || [20.5937, 78.9629];

  return (
    <div className={className}>
      <div className="mb-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search place name (e.g. City Hall, Main Street)"
            className="flex-1 border rounded-md p-2"
          />
          <button
            type="button"
            onClick={useCurrentLocation}
            className="bg-blue-600 text-white px-3 rounded-md"
          >
            Use current
          </button>
          <button
            type="button"
            onClick={clearSelection}
            className="bg-gray-200 text-gray-800 px-3 rounded-md"
          >
            Clear
          </button>
        </div>
        {loadingSearch && (
          <div className="text-sm text-gray-500 mt-1">Searching…</div>
        )}
        {suggestions.length > 0 && (
          <ul className="bg-white border rounded mt-2 max-h-40 overflow-auto z-50">
            {suggestions.map((s, idx) => (
              <li
                key={`${s.lat}-${s.lon}-${idx}`}
                onClick={() => selectSuggestion(s)}
                className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {s.display_name}
              </li>
            ))}
          </ul>
        )}
        {error && <div className="text-sm text-red-600 mt-1">{error}</div>}
      </div>

      <div style={{ height: 320 }} className="rounded overflow-hidden">
        <MapContainer
          center={mapCenter}
          zoom={position ? 14 : 5}
          style={{ height: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FlyToLocation position={position} />
          {position && (
            <>
              <Marker
                position={position}
                icon={defaultIcon}
                draggable={true}
                eventHandlers={{ dragend: onMarkerDragEnd }}
              >
                <Popup>
                  Selected location
                  <div className="text-xs mt-1">
                    Lat: {position[0].toFixed(6)} Lon: {position[1].toFixed(6)}
                  </div>
                </Popup>
              </Marker>
              <Circle
                center={position}
                radius={30}
                pathOptions={{ color: "blue", fillOpacity: 0.1 }}
              />
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default LocationPicker;
