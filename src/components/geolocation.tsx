import { useEffect, useState, useContext } from "react";
import { SessionContext } from "../context/sessionContext";
import type { FormEvent } from "react";
import type { ChangeEvent } from "react";
import { supabase } from "../supabase-client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

interface Story {
  id: number;
  latitude: number;
  longitude: number;
  content: string;
  image_url?: string;
  location_name?: string;
  email: string;
}

const MAPTILER_KEY = 'GB6tFeFIv9m9TNPuiCXF';

const Geolocation = () => {

  const session = useContext(SessionContext);
    if (!session) return <p>Silakan login terlebih dahulu untuk menambahkan cerita.</p>;


  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [locationName, setLocationName] = useState("");

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
      .select("*")
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

  const email = session.user.email;
  let imageUrl: string | null = null;
  if (image) {
    imageUrl = await uploadImage(image);
  }

  const { error } = await supabase.from("stories").insert({
    latitude: position.lat,
    longitude: position.lng,
    content,
    email,
    location_name: locationName,
    image_url: imageUrl,
  });

  if (!error) {
    setContent("");
    setImage(null);
    setLocationName("");
    fetchStories();
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
          {stories.map((story) => (
            <Marker
              key={story.id}
              position={{ lat: Number(story.latitude), lng: Number(story.longitude) }}
              icon={L.icon({ iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png", iconSize: [32, 32] })}
            >
              <Popup>
                <strong>{story.location_name ?? "Tanpa Nama Lokasi"}</strong><br />
                {story.content}<br />
                {story.image_url && <img src={story.image_url} alt="Story" style={{ width: "100%", maxHeight: "100px" }} />}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default Geolocation;