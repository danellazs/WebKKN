import { useEffect, useState } from "react";

export type LivePosition = {
  lat: number;
  lng: number;
  timestamp: number;
};

export function useLiveLocation() {
  const [position, setPosition] = useState<LivePosition | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung di browser ini.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;

        if (accuracy > 100) {
          console.warn("Akurasi terlalu rendah:", accuracy);
          return;
        }

        if (latitude === 0 && longitude === 0) {
          console.warn("Lokasi tidak valid (0,0). Diabaikan.");
          return;
        }

        setPosition({
          lat: latitude,
          lng: longitude,
          timestamp: Date.now(),
        });
      },
      (err) => {
        setError(`Gagal mengambil lokasi: ${err.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return { position, error };
}
