import { useEffect, useState, useContext } from "react";
import { SessionContext } from "../context/sessionContext";
import type { FormEvent } from "react";
import type { ChangeEvent } from "react";
import { supabase } from "../supabase-client";
import ConversationPanel from "./conversationPanel";
import StoryMarkerGroup from "./storyGroup";
import { MapContainer, TileLayer } from "react-leaflet";
import type { Story } from "../types/story"; // sudah disatukan definisinya

const fixedCenter = { lat: -7.75, lng: 110.38 }; // Sleman approx coords

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


  const [position, setPosition] = useState<{
    lat: number;
    lng: number;
    timestamp: number; // milliseconds since epoch
  } | null>(null);

  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [locationName, setLocationName] = useState("");
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  
  const [tagInput, setTagInput] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);


  const fetchTagSuggestions = async (query: string) => {
    const { data } = await supabase
      .from("tags")
      .select("name")
      .ilike("name", `%${query}%`);

    setTagSuggestions(data?.map(tag => tag.name) || []);
  };

  const refreshLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        if (accuracy > 100) {
          alert("Akurasi lokasi terlalu rendah. Coba di luar ruangan.");
          return;
        }
        if (latitude === 0 && longitude === 0) {
          alert("Lokasi tidak valid (0,0). Pastikan GPS aktif."); // 🔧
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
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };



  // Fetch location
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        console.log("📡 watchPosition:", latitude, longitude, "akurasi:", accuracy);
        if (accuracy && accuracy > 100) {
          console.warn("Akurasi lokasi terlalu rendah:", accuracy);
          return; // abaikan lokasi buruk
        }
        if (latitude === 0 && longitude === 0) {
          console.warn("Lokasi 0,0 terdeteksi. Diabaikan."); // 🔧
          return;
        }
        setPosition({
          lat: latitude,
          lng: longitude,
          timestamp: Date.now(), // record when it was updated
        });
      },
      (err) => {
        console.error("Error watching location:", err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );

    fetchStories();

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);



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
        tags: story.story_tags.map((st: any) => st.tags.name),
      }));
      setStories(storiesWithTags);
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

    const handleRemoveImage = () => {
      setImage(null);
      setImagePreview(null);
    };

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  if (!session || !position) {
    alert("Lokasi belum tersedia. Silakan tunggu beberapa saat.");
    return;
  }

  const now = Date.now();
  const locationAge = now - position.timestamp;
  const fiveMinutes = 5 * 60 * 1000;

  if (locationAge > fiveMinutes) {
    alert("Lokasi terlalu lama. Mohon tunggu hingga lokasi diperbarui.");
    return;
  }

  const { lat: latitude, lng: longitude } = position;

  if (latitude === 0 && longitude === 0) {
    alert("Lokasi tidak valid (0,0). Pastikan GPS aktif.");
    return;
  }

  const email = session.user.email;
  const userId = session.user.id;

  let imageUrl: string | null = null;
  if (image) {
    imageUrl = await uploadImage(image);
  }

  const { data: insertedStory, error: insertError } = await supabase
    .from("stories")
    .insert({
      latitude,
      longitude,
      content,
      user_id: userId,
      email,
      location_name: locationName,
      image_url: imageUrl,
    })
    .select()
    .single();

  if (insertError || !insertedStory) {
    console.error("Gagal menyimpan cerita:", insertError?.message);
    alert("Terjadi kesalahan saat menyimpan cerita.");
    return;
  }

  // ✅ Bersihkan dan unikkan tag
  const cleanedTags = selectedTags
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  const uniqueTags = Array.from(new Set(cleanedTags));

  for (const tagName of uniqueTags) {
    // Cek apakah tag sudah ada
    let { data: existingTag, error: tagFetchError } = await supabase
      .from("tags")
      .select("id")
      .eq("name", tagName)
      .maybeSingle(); // ✅ pakai maybeSingle untuk antisipasi tidak ditemukan

      if (tagFetchError) {
        console.error("Gagal mengambil tag:", tagFetchError.message);
        continue; // lanjut ke tag berikutnya
      }

      let tagId: number | null = null;

    if (!existingTag) {
      // Insert tag baru jika belum ada
      const { data: newTag, error: tagInsertError } = await supabase
        .from("tags")
        .insert([{ name: tagName }])
        .select()
        .single();

      if (tagInsertError) {
        console.error("Gagal menambahkan tag:", tagInsertError.message);
        continue;
      }

      tagId = newTag.id;
    }
    else {
      tagId = existingTag.id;
    }

    // Tambahkan relasi ke story_tags
    const { error: linkError } = await supabase
      .from("story_tags")
      .insert([{ story_id: insertedStory.id, tag_id: tagId }]);

    if (linkError) {
      console.error("Gagal membuat relasi tag ke cerita:", linkError.message);
    }
  }

  // ✅ Reset form
  setContent("");
  setSelectedTags([]);
  setImage(null);
  setImagePreview(null);
  setLocationName("");

  // Refresh cerita
  fetchStories();
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
              const file = e.target.files[0];
              setImage(file);
              const previewUrl = URL.createObjectURL(file);
              setImagePreview(previewUrl);
            }
          }}
        />
        <input
          type="text"
          placeholder="Tambah tag..."
          value={tagInput}
          onChange={(e) => {
            const value = e.target.value;
            setTagInput(value);
            if (value.length > 1) {
              fetchTagSuggestions(value);
            } else {
              setTagSuggestions([]);
            }
          }}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.25rem" }}
        />
        {tagSuggestions.length > 0 && (
          <div style={{ marginBottom: "0.5rem" }}>
            {tagSuggestions.map((suggestion) => (
              <button
                type="button"
                key={suggestion}
                onClick={() => {
                  if (!selectedTags.includes(suggestion)) {
                    setSelectedTags([...selectedTags, suggestion]);
                  }
                  setTagInput("");
                  setTagSuggestions([]);
                }}
                style={{
                  margin: "0.2rem",
                  padding: "0.3rem 0.6rem",
                  backgroundColor: "#eee",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                #{suggestion}
              </button>
            ))}
          </div>
        )}
        {/* Tag yang sudah dipilih */}
        <div style={{ marginBottom: "0.5rem" }}>
          {selectedTags.map((tag) => (
            <span
              key={tag}
              style={{
                display: "inline-block",
                marginRight: "0.5rem",
                marginBottom: "0.3rem",
                backgroundColor: "#d1ecf1",
                padding: "0.3rem 0.6rem",
                borderRadius: "10px",
              }}
            >
              #{tag}
              <button
                type="button"
                onClick={() =>
                  setSelectedTags(selectedTags.filter((t) => t !== tag))
                }
                style={{
                  marginLeft: "0.3rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {imagePreview && (
        <div style={{ marginBottom: "0.5rem" }}>
          <img
            src={imagePreview}
            alt="Preview"
            style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            style={{
              display: "block",
              marginTop: "0.5rem",
              padding: "0.3rem 0.7rem",
              backgroundColor: "#f8d7da",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Hapus Gambar
          </button>
        </div>
      )}

        <button type="submit" style={{ padding: "0.5rem 1rem" }}>Kirim Cerita</button>
        <button onClick={refreshLocation}>Perbarui Lokasi</button>

      </form>

      {position && (
        <p>📍 Posisi saat ini: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}</p>
      )}

      {position && (
        
      <MapContainer center={fixedCenter} zoom={13} scrollWheelZoom={false} style={{ height: "500px", width: "100%" }}>
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
        onDelete={() => {
          setSelectedStory(null);
          fetchStories(); // reload peta
  }}
      />
    )}


    </div>
  );
};

export default Geolocation;