import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../context/sessionContext";
import { supabase } from "../supabase-client";

const slemanBounds = {
  north: -7.6,
  south: -7.9,
  west: 110.3,
  east: 110.5,
};

function isInsideSleman(lat: number, lng: number): boolean {
  return (
    lat <= slemanBounds.north &&
    lat >= slemanBounds.south &&
    lng >= slemanBounds.west &&
    lng <= slemanBounds.east
  );
}

const LocalVerificationButton = () => {
  const session = useContext(SessionContext);
  const [status, setStatus] = useState<string>("");
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        console.log("Lokasi berhasil:", latitude, longitude);
        setPosition({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error("Gagal dapat lokasi", error);
        setStatus("Gagal mendapatkan lokasi. Izinkan akses lokasi Anda.");
      }
    );
  }, []);

  const handleVerify = async () => {
    if (!session) {
      setStatus("Silakan login terlebih dahulu.");
      return;
    }

    if (!position) {
      setStatus("Lokasi belum tersedia.");
      return;
    }

    if (isInsideSleman(position.lat, position.lng)) {
      const { error } = await supabase
        .from("users")
        .update({ isLocal: true })
        .eq("email", session.user.email);

      if (error) {
        setStatus("Gagal memperbarui status lokal.");
      } else {
        setStatus("Verifikasi berhasil! Anda adalah warga lokal Sleman.");
      }
    } else {
      setStatus("Anda berada di luar wilayah Sleman.");
    }
  };

  return (
    <div>
      <button onClick={handleVerify} style={{ padding: "0.5rem 1rem", marginBottom: "1rem" }}>
        Verifikasi Lokasi Saya
      </button>
      <p>{status}</p>
    </div>
  );
};

export default LocalVerificationButton;
