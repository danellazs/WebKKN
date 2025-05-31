import StoryMarkerGroup from "./storyGroup";
import type { Story } from "../types/story";
import PulsingCircle from "./pulsingCircle";

interface StoryMapProps {
  stories: Story[][]; 
  onSelectStory: (story: Story) => void;
}

const StoryMap = ({ stories, onSelectStory }: StoryMapProps) => {
  const groupedStories = stories; 

  return (
    <>
      {groupedStories.map((group, index) => {
        const { latitude, longitude } = group[0];
        const isHotspot = group.length >= 3;

        return (
          <div key={index}>
            {isHotspot && <PulsingCircle position={[latitude, longitude]} />}
            <StoryMarkerGroup
              stories={group}
              onSelectStory={onSelectStory}
              isHotspot={isHotspot}
              position={{ lat: latitude, lng: longitude }}
            />
          </div>
        );
      })}
    </>
  );
};

export default StoryMap;
