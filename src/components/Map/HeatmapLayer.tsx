import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { getGridCells, GridCell } from '../../services/trackService';

interface HeatmapLayerProps {
  map: mapboxgl.Map | null;
  visible: boolean;
  gridLevel?: number;
  mode?: 'count' | 'duration';
  filter?: {
    startTime?: number;
    endTime?: number;
  };
}

const HeatmapLayer: React.FC<HeatmapLayerProps> = ({
  map,
  visible,
  gridLevel = 3,
  mode = 'count',
  filter,
}) => {
  useEffect(() => {
    if (!map || !visible) return;

    const loadHeatmapData = async () => {
      try {
        // Fetch grid cells
        const cells = await getGridCells({ ...filter, level: gridLevel });

        // Remove existing layer and source if they exist
        if (map.getLayer('heatmap-layer')) {
          map.removeLayer('heatmap-layer');
        }
        if (map.getSource('heatmap-source')) {
          map.removeSource('heatmap-source');
        }

        // Convert cells to GeoJSON
        const geojson: GeoJSON.FeatureCollection = {
          type: 'FeatureCollection',
          features: cells.map((cell: GridCell) => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [cell.center_lon, cell.center_lat],
            },
            properties: {
              point_count: cell.point_count,
              duration: cell.duration_seconds,
              value: mode === 'count' ? cell.point_count : cell.duration_seconds,
            },
          })),
        };

        // Add source
        map.addSource('heatmap-source', {
          type: 'geojson',
          data: geojson,
        });

        // Add heatmap layer
        map.addLayer({
          id: 'heatmap-layer',
          type: 'heatmap',
          source: 'heatmap-source',
          paint: {
            // Increase weight as value increases
            'heatmap-weight': [
              'interpolate',
              ['linear'],
              ['get', 'value'],
              0, 0,
              100, 1,
            ],
            // Increase intensity as zoom level increases
            'heatmap-intensity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, 1,
              9, 3,
            ],
            // Color ramp for heatmap
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0, 'rgba(33,102,172,0)',
              0.2, 'rgb(103,169,207)',
              0.4, 'rgb(209,229,240)',
              0.6, 'rgb(253,219,199)',
              0.8, 'rgb(239,138,98)',
              1, 'rgb(178,24,43)',
            ],
            // Adjust radius by zoom level
            'heatmap-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, 2,
              9, 20,
            ],
            // Transition from heatmap to circle layer by zoom level
            'heatmap-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7, 1,
              9, 0,
            ],
          },
        });

        // Add circle layer for high zoom levels
        map.addLayer({
          id: 'heatmap-circle-layer',
          type: 'circle',
          source: 'heatmap-source',
          minzoom: 7,
          paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['get', 'value'],
              1, 4,
              100, 20,
            ],
            'circle-color': [
              'interpolate',
              ['linear'],
              ['get', 'value'],
              0, 'rgba(33,102,172,0.5)',
              50, 'rgba(209,229,240,0.5)',
              100, 'rgba(178,24,43,0.5)',
            ],
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7, 0,
              8, 1,
            ],
          },
        });

        // Add hover tooltip
        map.on('mouseenter', 'heatmap-circle-layer', (e) => {
          if (!e.features || e.features.length === 0) return;
          map.getCanvas().style.cursor = 'pointer';

          const feature = e.features[0];
          const props = feature.properties;

          new mapboxgl.Popup({ closeButton: false })
            .setLngLat(e.lngLat)
            .setHTML(
              `
              <div class="p-2">
                <div><strong>点数:</strong> ${props?.point_count || 0}</div>
                <div><strong>时长:</strong> ${Math.round((props?.duration || 0) / 3600)} 小时</div>
              </div>
              `
            )
            .addTo(map);
        });

        map.on('mouseleave', 'heatmap-circle-layer', () => {
          map.getCanvas().style.cursor = '';
        });
      } catch (error) {
        console.error('Failed to load heatmap data:', error);
      }
    };

    loadHeatmapData();

    // Cleanup
    return () => {
      if (map.getLayer('heatmap-circle-layer')) {
        map.removeLayer('heatmap-circle-layer');
      }
      if (map.getLayer('heatmap-layer')) {
        map.removeLayer('heatmap-layer');
      }
      if (map.getSource('heatmap-source')) {
        map.removeSource('heatmap-source');
      }
    };
  }, [map, visible, gridLevel, mode, filter]);

  return null;
};

export default HeatmapLayer;
