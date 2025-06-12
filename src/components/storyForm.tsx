import { useState, type FormEvent } from "react";
import { supabase } from "../supabase-client";
import TagInput from "./tagInput";
import ImageUpload from "./imageUpload";
import type { Session } from "@supabase/supabase-js";

type StoryFormProps = {
  position: { lat: number; lng: number; timestamp: number };
  session: Session | null;
  onSubmitted: () => void;
  fetchStories: () => Promise<void>;
  refreshLocation: () => void;   
};

const StoryForm = ({ position, session, onSubmitted, fetchStories, refreshLocation}: StoryFormProps) => {
  const [content, setContent] = useState("");
  const [locationName, setLocationName] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
    const now = Date.now();
    const locationAge = now - position.timestamp;

    if (!session) {
    alert("Tolong login terlebih dahulu sebelum add pin");
    return;
  }

    if (locationAge > 5 * 60 * 1000) {
      alert("Lokasi terlalu lama. Mohon tunggu hingga lokasi diperbarui.");
      return;
    }

    const { lat: latitude, lng: longitude } = position;
    const email = session.user.email;
    const userId = session.user.id;

    let imageUrl: string | null = null;
    if (image) imageUrl = await uploadImage(image);

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

    for (const tagName of selectedTags) {
      let { data: existingTag } = await supabase
        .from("tags")
        .select("id")
        .eq("name", tagName)
        .maybeSingle();

      let tagId: number | null = existingTag?.id || null;

      if (!existingTag) {
        const { data: newTag } = await supabase
          .from("tags")
          .insert([{ name: tagName }])
          .select()
          .single();
        tagId = newTag?.id;
      }

      if (tagId) {
        await supabase.from("story_tags").insert([{ story_id: insertedStory.id, tag_id: tagId }]);
      }
    }

    const { error: pointsError } = await supabase
      .from("points")
      .insert({
        user_id: userId,
        value: 20, 
        source: `Menambahkan cerita di lokasi: ${locationName || "Tanpa Nama"}`
      });

    if (pointsError) {
      console.error("Gagal menambahkan poin:", pointsError.message);
    }

    setContent("");
    setLocationName("");
    setSelectedTags([]);
    setImage(null);
    setImagePreview(null);

    await fetchStories();
    onSubmitted();
  };

  return (
    <form onSubmit={handleSubmit} className="story-form">
      <textarea
        placeholder="Isi ceritamu..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        type="text"
        placeholder="Nama lokasi (opsional)"
        value={locationName}
        onChange={(e) => setLocationName(e.target.value)}
      />
      <ImageUpload
        image={image}
        imagePreview={imagePreview}
        setImage={setImage}
        setImagePreview={setImagePreview}
        
      />
      <TagInput selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
      <div className="story-buttons">
        <button type="submit" className="story-submit-button">Kirim Cerita</button>
        <button type="button" onClick={refreshLocation} className="story-refresh-button">
          Perbarui Lokasi
        </button>
      </div>
    </form>
  );
};

export default StoryForm;
