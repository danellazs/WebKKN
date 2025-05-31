import L from "leaflet";
import { useMap } from "react-leaflet";
import { useEffect } from "react";

type PulsingCircleProps = {
  position: [number, number];
};

const PulsingCircle = ({ position }: PulsingCircleProps) => {
  const map = useMap();

  useEffect(() => {
    const div = L.divIcon({
      className: "pulsing-hotspot",
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      html: '<div class="pulse-ring"></div>',
    });

    const marker = L.marker(position, { icon: div }).addTo(map);

    return () => {
      map.removeLayer(marker);
    };
  }, [map, position]);

  return null;
};

export default PulsingCircle;
