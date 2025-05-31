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

export function getClusteredGroups(stories: Story[], radius = 20): ClusteredStoryGroup[] {
  const rawClusters = clusterNearbyStories(stories, radius);

  return rawClusters.map((group) => {
    const lat = group.reduce((sum, s) => sum + s.latitude, 0) / group.length;
    const lng = group.reduce((sum, s) => sum + s.longitude, 0) / group.length;
    return { lat, lng, stories: group };
  });
}

export function clusterNearbyStories(stories: Story[], radius: number): Story[][] {
  const clusters: Story[][] = [];
  const visited = new Array(stories.length).fill(false);

  for (let i = 0; i < stories.length; i++) {
    if (visited[i]) continue;

    const cluster = [stories[i]];
    visited[i] = true;

    for (let j = i + 1; j < stories.length; j++) {
      if (visited[j]) continue;

      const dist = haversineDistance(
        { lat: stories[i].latitude, lng: stories[i].longitude },
        { lat: stories[j].latitude, lng: stories[j].longitude }
      );

      if (dist <= radius) {
        cluster.push(stories[j]);
        visited[j] = true;
      }
    }

    clusters.push(cluster);
  }

  return clusters;
}
