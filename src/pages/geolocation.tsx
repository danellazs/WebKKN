import { useContext, useState, useEffect } from "react";
import { SessionContext } from "../context/sessionContext";
import { supabase } from "../supabase-client";
import { MapContainer, TileLayer } from "react-leaflet";

import StoryForm from "../components/storyForm";
import StoryMap from "../components/mapping";
import ConversationPanel from "../components/conversationPanel";
import LocalVerificationButton from "../components/localVerification";
import QuizGame from "../components/quizGame";


import type { Story } from "../types/story";

const MAPTILER_KEY = 'GB6tFeFIv9m9TNPuiCXF';
const fixedCenter = { lat: -7.75, lng: 110.38 }; // Sleman approx

import { clusterNearbyStories } from "../utils/geolocation"; // or your actual path

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

  // ✅ Declare stories first before using it in any useEffect
  const [stories, setStories] = useState<Story[]>([]);
  const [clusteredStories, setClusteredStories] = useState<Story[][]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  // ✅ Moved useEffect here after stories is declared
  useEffect(() => {
    const clusters = clusterNearbyStories(stories, 50); // adjust radius if needed
    setClusteredStories(clusters);
  }, [stories]);

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

        {/* ✅ Ensure prop name matches what StoryMap expects */}
        <StoryMap
          stories={clusteredStories} // change to "stories" if that’s what your prop is called
          onSelectStory={setSelectedStory}
        />
      </MapContainer>

      <LocalVerificationButton />
      <QuizGame />

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
