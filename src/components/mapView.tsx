// src/components/MapView.tsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect } from "react";

import { useState } from "react";

const slemanCenter = { lat: -7.733, lng: 110.355 };

const MapView = () => {
  const [location, setLocation] = useState(slemanCenter);
  const [userLocated, setUserLocated] = useState(false);

  const MAPTILER_KEY = 'GB6tFeFIv9m9TNPuiCXF';

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
        setUserLocated(true);
      },
      () => {
        console.warn('Gagal mengambil lokasi, tetap pakai Sleman');
      }
    );
  }, []);

  return (
    <div style={{ height: '500px' }}>
      <MapContainer center={location} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url={`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.maptiler.com/">MapTiler</a>'
        />
        <Marker position={location}>
          <Popup>
            {userLocated ? 'Lokasi Anda' : 'Pusat Sleman, Yogyakarta'}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};


export default MapView;

