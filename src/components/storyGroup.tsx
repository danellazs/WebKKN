import { useState } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { Story } from "../types/story";

interface Props {
  stories: Story[];
  onSelectStory: (story: Story) => void;
  isHotspot?: boolean;
  position: {
    lat: number;
    lng: number;
  };
}


const StoryMarkerGroup = ({ stories, onSelectStory, isHotspot = false, position }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentStory = stories[currentIndex];

  const customIcon = L.divIcon({
    className: "",
    html: `
      <div style="position: relative; width: 40px; height: 40px;">
        ${
          isHotspot
            ? `<img src="/pin-fire.png" style="position: absolute; top: 0; left: 0; width: 40px; height: 40px;"/>`
            : ""
        }
        <img src="https://cdn-icons-png.flaticon.com/512/854/854878.png" style="position: absolute; top: 4px; left: 4px; width: 32px; height: 32px;"/>
      </div>
    `,
    iconSize: [40, 40],
  });

  return (
    <Marker
      position={[position.lat, position.lng]}
      icon={customIcon}
      eventHandlers={{
        click: () => onSelectStory(stories[0]),
      }}
    >
      <Popup>
        <strong>{currentStory.location_name ?? "Tanpa Nama Lokasi"}</strong><br />
        <em>oleh: {currentStory.users?.name ?? "Anonim"}</em><br />
        {isHotspot ? <strong>🔥 Hotspot! ({stories.length} cerita)</strong> : null}
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
