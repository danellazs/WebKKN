// components/StoryMarkerGroup.tsx
import { useState } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { Story } from "../types/story";

interface Props {
  stories: Story[];
  onSelectStory: (story: Story) => void;
}

export function groupStoriesByLocation(stories: Story[]) {
  const grouped: { [key: string]: Story[] } = {};

  stories.forEach((story) => {
    const key = `${story.latitude.toFixed(4)},${story.longitude.toFixed(4)}`;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(story);
  });

  return Object.values(grouped);
}

const StoryMarkerGroup = ({ stories, onSelectStory }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentStory = stories[currentIndex];
  const position = {
    lat: Number(currentStory.latitude),
    lng: Number(currentStory.longitude),
  };

  return (
    <Marker
      position={position}
      icon={L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
        iconSize: [32, 32],
      })}
    >
      <Popup>
        <strong>{currentStory.location_name ?? "Tanpa Nama Lokasi"}</strong><br />
        <em>oleh: {currentStory.users?.name ?? "Anonim"}</em><br />
        {currentStory.content}<br />
        {currentStory.image_url && (
          <img
            src={currentStory.image_url}
            alt="Story"
            style={{ width: "100%", maxHeight: "100px" }}
          />
        )}
        <br />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
          <button
            onClick={(e) => {
              e.preventDefault();
              setCurrentIndex((prev) => (prev === 0 ? stories.length - 1 : prev - 1));
            }}
          >
            &lt;
          </button>
          <span style={{ fontSize: "0.8rem" }}>
            {currentIndex + 1} / {stories.length}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              setCurrentIndex((prev) => (prev + 1) % stories.length);
            }}
          >
            &gt;
          </button>
        </div>
        <br />
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSelectStory(currentStory);
          }}
          style={{ fontSize: "0.8rem", color: "#007bff" }}
        >
          Perbesar
        </a>
      </Popup>
    </Marker>
  );
};

export default StoryMarkerGroup;


