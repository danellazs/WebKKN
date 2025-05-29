import { useEffect, useState, useContext } from "react";
import { SessionContext } from "../context/sessionContext";
import type { FormEvent } from "react";
import type { ChangeEvent } from "react";
import { supabase } from "../supabase-client";
import ConversationPanel from "./conversationPanel";
import StoryMarkerGroup from "./storyGroup";



import { MapContainer, TileLayer } from "react-leaflet";

import type { Story } from "../types/story"; // sudah disatukan definisinya


const MAPTILER_KEY = 'GB6tFeFIv9m9TNPuiCXF';

function haversineDistance(a: { lat: number, lng: number }, b: { lat: number, lng: number }) {
  const R = 6371e3;
  const φ1 = a.lat * Math.PI / 180;
  const φ2 = b.lat * Math.PI / 180;
  const Δφ = (b.lat - a.lat) * Math.PI / 180;
  const Δλ = (b.lng - a.lng) * Math.PI / 180;
  const x = Δλ * Math.cos((φ1 + φ2) / 2);
  const d = Math.sqrt(Δφ * Δφ + x * x) * R;
  return d;
}

function clusterNearbyStories(stories: Story[], radius = 20): Story[][] {
  const clusters: Story[][] = [];

  for (const story of stories) {
    let added = false;
    for (const cluster of clusters) {
      const dist = haversineDistance(
        { lat: story.latitude, lng: story.longitude },
        { lat: cluster[0].latitude, lng: cluster[0].longitude }
      );
      if (dist <= radius) {
        cluster.push(story);
        added = true;
        break;
      }
    }
    if (!added) {
      clusters.push([story]);
    }
  }
  return clusters;
}


const Geolocation = () => {

  const session = useContext(SessionContext);
    if (!session) return <p>Silakan login terlebih dahulu untuk menambahkan cerita.</p>;


  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [locationName, setLocationName] = useState("");
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);


  // Fetch location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setPosition({ lat: latitude, lng: longitude });
    });
    fetchStories();
  }, []);

  const fetchStories = async () => {
    const { data, error } = await supabase
      .from("stories")
      .select(`*, users(name)`)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setStories(data);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const filePath = `stories/${file.name}-${Date.now()}`;
    const { error } = await supabase.storage.from("stories-images").upload(filePath, file);
    if (error) {
      console.error("Upload error:", error.message);
      return null;
    }

    const { data } = supabase.storage.from("stories-images").getPublicUrl(filePath);
    return data?.publicUrl ?? null;
  };

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  if (!position || !session) return;

  const email = session.user.email; // should exist if logged in
  const userId = session.user.id;

  let imageUrl: string | null = null;
  if (image) {
    imageUrl = await uploadImage(image);
  }

  const { data, error } = await supabase.from("stories").insert({
    latitude: position.lat,
    longitude: position.lng,
    content,
    user_id: userId, 
    email: email, 
    location_name: locationName,
    image_url: imageUrl,
  }).select().single();

  if (!error) {
    setContent("");
    setImage(null);
    setLocationName("");
    setStories((prevStories) => [data, ...prevStories]);
  } else {
    console.error("Insert error:", error.message);
  }
};


  return (
    <div>
      <h2>Tambahkan Cerita Lokasi</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <textarea
          placeholder="Isi ceritamu..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="Nama lokasi (opsional)"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files?.[0]) {
              setImage(e.target.files[0]);
            }
          }}
        />
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>Kirim Cerita</button>
      </form>

      {position && (
      <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          url={`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`}
          attribution='&copy; OpenStreetMap & MapTiler'
        />
        {clusterNearbyStories(stories).map((storyGroup, index) => (
          <StoryMarkerGroup
            key={index}
            stories={storyGroup}
            onSelectStory={(story) => setSelectedStory(story)}
            isHotspot={storyGroup.length >= 5} // Threshold hotspot
          />
        ))}

        

      </MapContainer>
    )}

    {selectedStory && (
      <ConversationPanel
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
      />
    )}


    </div>
  );
};

export default Geolocation;