import type { Story } from "../types/story";

export function haversineDistance(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371e3; // radius bumi dalam meter
  const φ1 = (a.lat * Math.PI) / 180;
  const φ2 = (b.lat * Math.PI) / 180;
  const Δφ = ((b.lat - a.lat) * Math.PI) / 180;
  const Δλ = ((b.lng - a.lng) * Math.PI) / 180;
  const x = Δλ * Math.cos((φ1 + φ2) / 2);
  const d = Math.sqrt(Δφ * Δφ + x * x) * R;
  return d;
}

export type ClusteredStoryGroup = {
  lat: number;
  lng: number;
  stories: Story[];
};

export function getClusteredGroups(stories: Story[], radius = 25): ClusteredStoryGroup[] {
  const rawClusters = clusterNearbyStories(stories, radius);

  return rawClusters.map((group) => {
    const lat = group.reduce((sum, s) => sum + s.latitude, 0) / group.length;
    const lng = group.reduce((sum, s) => sum + s.longitude, 0) / group.length;
    return { lat, lng, stories: group };
  });
}

export function clusterNearbyStories(stories: Story[], radius: number): Story[][] {
  const clusters: Story[][] = [];
  const visited = new Set<number>();

  for (let i = 0; i < stories.length; i++) {
    if (visited.has(i)) continue;

    const cluster: Story[] = [];
    const queue: number[] = [i];
    visited.add(i);

    while (queue.length > 0) {
      const currentIndex = queue.shift()!;
      const currentStory = stories[currentIndex];
      cluster.push(currentStory);

      for (let j = 0; j < stories.length; j++) {
        if (visited.has(j)) continue;

        const dist = haversineDistance(
          { lat: currentStory.latitude, lng: currentStory.longitude },
          { lat: stories[j].latitude, lng: stories[j].longitude }
        );

        if (dist <= radius) {
          queue.push(j);
          visited.add(j);
        }
      }
    }

    clusters.push(cluster);
  }

  return clusters;
}
