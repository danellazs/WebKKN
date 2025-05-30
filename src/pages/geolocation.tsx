import { useContext, useState, useEffect } from "react";
import { SessionContext } from "../context/sessionContext";
import { supabase } from "../supabase-client";
import { getClusteredGroups } from "../utils/geolocation"; // ✅ Ganti import di sini
import { MapContainer, TileLayer, Circle } from "react-leaflet";

import StoryForm from "../components/storyForm";
import StoryMap from "../components/mapping";
import ConversationPanel from "../components/conversationPanel";

import type { Story } from "../types/story";

const MAPTILER_KEY = 'GB6tFeFIv9m9TNPuiCXF';
const fixedCenter = { lat: -7.75, lng: 110.38 }; // Sleman approx

const Geolocation = () => {
  const session = useContext(SessionContext);
  const [position, setPosition] = useState<{
    lat: number;
    lng: number;
    timestamp: number;
  }>({
    lat: -7.76162,
    lng: 110.37717,
    timestamp: Date.now(),
  });

  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  const clusters = getClusteredGroups(stories, 100); // ✅ gunakan fungsi sesuai utilitas

  const refreshLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        if (accuracy > 100) {
          alert("Akurasi lokasi terlalu rendah. Coba di luar ruangan.");
          return;
        }
        if (latitude === 0 && longitude === 0) {
          alert("Lokasi tidak valid (0,0). Pastikan GPS aktif.");
          return;
        }
        setPosition({
          lat: latitude,
          lng: longitude,
          timestamp: Date.now(),
        });
      },
      (err) => {
        console.error("Gagal memperbarui lokasi:", err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const fetchStories = async () => {
    const { data, error } = await supabase
      .from("stories")
      .select(`
        *,
        users(name),
        story_tags(
          tags(name)
        )
      `)
      .order("created_at", { ascending: false });

    if (!error && data) {
      const storiesWithTags = data.map((story) => ({
        ...story,
        selectedTags: story.story_tags.map((st: any) => st.tags.name),
      }));
      setStories(storiesWithTags);
    }
  };

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        if (accuracy && accuracy > 100) return;
        if (latitude === 0 && longitude === 0) return;
        setPosition({
          lat: latitude,
          lng: longitude,
          timestamp: Date.now(),
        });
      },
      (err) => console.error("Error watching location:", err.message),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );

    fetchStories();

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  if (!session) return <p>Silakan login terlebih dahulu untuk menambahkan cerita.</p>;

  return (
    <div>
      <h2>Tambahkan Cerita Lokasi</h2>

      <StoryForm
        session={session}
        position={position}
        fetchStories={fetchStories}
        refreshLocation={refreshLocation}
        onSubmitted={() => {
          console.log("Cerita berhasil dikirim");
          fetchStories();
        }}
      />

      <p>📍 Posisi saat ini: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}</p>

      <MapContainer
        center={fixedCenter}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url={`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`}
          attribution="&copy; OpenStreetMap & MapTiler"
        />

        <StoryMap
          stories={stories}
          onSelectStory={setSelectedStory}
        />

        {clusters.map((cluster, idx) => (
          <Circle
            key={idx}
            center={{ lat: cluster.lat, lng: cluster.lng }} // ✅ sesuaikan
            radius={100} // ✅ radius tetap
            pathOptions={{ color: 'blue', fillOpacity: 0.3 }}
          />
        ))}
      </MapContainer>

      {selectedStory && (
        <ConversationPanel
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
          onDelete={() => {
            setSelectedStory(null);
            fetchStories();
          }}
        />
      )}
    </div>
  );
};

export default Geolocation;
