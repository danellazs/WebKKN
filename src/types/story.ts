// src/types/story.ts

export interface Story {
  id: number;
  latitude: number;
  longitude: number;
  content: string;
  image_url?: string;
  location_name: string | null; // Gunakan null (bukan undefined)
  users?: {
    name: string;
  };
    user_id?: string;
}
