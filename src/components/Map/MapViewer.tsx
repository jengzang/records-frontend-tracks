import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mapbox access token - MUST be set via environment variable
// Create a .env file with: VITE_MAPBOX_TOKEN=your_token_here
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

interface MapViewerProps {
  onMapLoad?: (map: mapboxgl.Map) => void;
  center?: [number, number];
  zoom?: number;
  style?: string;
}

const MapViewer: React.FC<MapViewerProps> = ({
  onMapLoad,
  center = [104, 35], // Center of China
  zoom = 4,
  style = 'mapbox://styles/mapbox/streets-v12',
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Set Mapbox access token
    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style,
      center,
      zoom,
      attributionControl: false,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add scale control
    map.current.addControl(
      new mapboxgl.ScaleControl({
        maxWidth: 100,
        unit: 'metric',
      }),
      'bottom-left'
    );

    // Call onMapLoad when map is ready
    map.current.on('load', () => {
      if (map.current && onMapLoad) {
        onMapLoad(map.current);
      }
    });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [center, zoom, style, onMapLoad]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-full"
      style={{ minHeight: '500px' }}
    />
  );
};

export default MapViewer;
