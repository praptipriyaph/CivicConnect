// Filename: src/components/common/LocationPicker.js
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon (a common issue with React-Leaflet)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


function MapClickHandler({ onLocationSelect }) {
    const [position, setPosition] = useState(null);

    useMapEvents({
        click(e) {
            const newPos = e.latlng;
            setPosition(newPos);
            onLocationSelect(newPos); // Send coordinates to parent
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

function LocationPicker({ onLocationSelect }) {
    const defaultCenter = [20.5937, 78.9629]; // Centered on India

    return (
        // Set a fixed height and rounded corners
        <MapContainer 
            center={defaultCenter} 
            zoom={5} 
            style={{ height: '300px', width: '100%', borderRadius: '8px' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapClickHandler onLocationSelect={onLocationSelect} />
        </MapContainer>
    );
}

export default LocationPicker;