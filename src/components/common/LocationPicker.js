// src/components/common/LocationPicker.js

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- (Icon fix code remains the same) ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


// NEW: This component moves the map view when the position prop changes
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// MODIFIED: This just passes the click event up
function MapClickHandler({ onLocationSelect }) {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng); // Pass the raw latlng object up
        },
    });
    return null;
}


// MODIFIED: LocationPicker now receives position as a prop
function LocationPicker({ position, onLocationSelect }) {
    const defaultCenter = [20.5937, 78.9629]; // Centered on India

    // Use the passed-in position, or the default center
    const currentCenter = position || defaultCenter;
    // Zoom in if a specific point is set, otherwise zoom out
    const currentZoom = position ? 13 : 5;

    return (
        <MapContainer 
            center={currentCenter} 
            zoom={currentZoom} 
            style={{ height: '300px', width: '100%', borderRadius: '8px' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            <MapClickHandler onLocationSelect={onLocationSelect} />
            
            {/* If a position is provided, show the marker */}
            {position && <Marker position={position}></Marker>}
            
            {/* This component will move the map when 'position' changes */}
            <ChangeView center={currentCenter} zoom={currentZoom} />
        </MapContainer>
    );
}

export default LocationPicker;