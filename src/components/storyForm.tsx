import { useState, type FormEvent } from "react";
import { supabase } from "../supabase-client";
import TagInput from "./tagInput";
import ImageUpload from "./imageUpload";
import type { Session } from "@supabase/supabase-js";

type StoryFormProps = {
  position: { lat: number; lng: number; timestamp: number };
  session: Session;
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

    setContent("");
    setLocationName("");
    setSelectedTags([]);
    setImage(null);
    setImagePreview(null);

    await fetchStories();
    onSubmitted();
  };

  return (
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
      <ImageUpload
        image={image}
        imagePreview={imagePreview}
        setImage={setImage}
        setImagePreview={setImagePreview}
      />
      <TagInput selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
      <button type="submit" style={{ padding: "0.5rem 1rem" }}>Kirim Cerita</button>
      <button type="button" onClick={refreshLocation}>
        Perbarui Lokasi
      </button>
    </form>
  );
};

export default StoryForm;
