import { Circle } from "react-leaflet";
import StoryMarkerGroup, { groupStoriesByLocation } from "./storyGroup";
import type { Story } from "../types/story";

interface StoryMapProps {
  stories: Story[];
  onSelectStory: (story: Story) => void;
}

const StoryMap = ({ stories, onSelectStory }: StoryMapProps) => {
  const groupedStories = groupStoriesByLocation(stories);

  return (
    <>
      {groupedStories.map((group, index) => {
        const { latitude, longitude } = group[0];
        const isHotspot = group.length >= 3;

        return (
          <div key={index}>
            {isHotspot && (
              <Circle
                center={[latitude, longitude]}
                radius={30}
                pathOptions={{
                  color: "red",
                  fillColor: "red",
                  fillOpacity: 0.2,
                }}
              />
            )}

            <StoryMarkerGroup
              stories={group}
              onSelectStory={onSelectStory}
              isHotspot={isHotspot}
            />
          </div>
        );
      })}
    </>
  );
};

export default StoryMap;
