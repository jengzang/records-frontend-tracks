import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { getRenderingMetadata, RenderingMetadata } from '../../services/trackService';
import { TRANSPORT_MODE_COLORS } from '../../utils/constants';

interface TrajectoryLayerProps {
  map: mapboxgl.Map | null;
  visible: boolean;
  filter?: {
    startTime?: number;
    endTime?: number;
    modes?: string[];
  };
}

const TrajectoryLayer: React.FC<TrajectoryLayerProps> = ({ map, visible, filter }) => {
  useEffect(() => {
    if (!map || !visible) return;

    const loadTrajectoryData = async () => {
      try {
        // Fetch rendering metadata
        const metadata = await getRenderingMetadata(filter);

        // Remove existing layer and source if they exist
        if (map.getLayer('trajectory-layer')) {
          map.removeLayer('trajectory-layer');
        }
        if (map.getSource('trajectory-source')) {
          map.removeSource('trajectory-source');
        }

        // Convert metadata to GeoJSON
        const geojson: GeoJSON.FeatureCollection = {
          type: 'FeatureCollection',
          features: metadata.map((point: RenderingMetadata) => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [point.longitude, point.latitude],
            },
            properties: {
              mode: point.mode,
              speed: point.speed,
              timestamp: point.timestamp,
              render_width: point.render_width,
              render_opacity: point.render_opacity,
            },
          })),
        };

        // Add source
        map.addSource('trajectory-source', {
          type: 'geojson',
          data: geojson,
        });

        // Add line layer
        map.addLayer({
          id: 'trajectory-layer',
          type: 'line',
          source: 'trajectory-source',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': [
              'match',
              ['get', 'mode'],
              'WALK', TRANSPORT_MODE_COLORS.WALK,
              'CAR', TRANSPORT_MODE_COLORS.CAR,
              'TRAIN', TRANSPORT_MODE_COLORS.TRAIN,
              'FLIGHT', TRANSPORT_MODE_COLORS.FLIGHT,
              'STAY', TRANSPORT_MODE_COLORS.STAY,
              '#888888', // default
            ],
            'line-width': ['get', 'render_width'],
            'line-opacity': ['get', 'render_opacity'],
          },
        });

        // Add click handler
        map.on('click', 'trajectory-layer', (e) => {
          if (!e.features || e.features.length === 0) return;

          const feature = e.features[0];
          const props = feature.properties;

          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(
              `
              <div class="p-2">
                <div><strong>模式:</strong> ${props?.mode || 'N/A'}</div>
                <div><strong>速度:</strong> ${props?.speed || 0} km/h</div>
                <div><strong>时间:</strong> ${new Date((props?.timestamp || 0) * 1000).toLocaleString('zh-CN')}</div>
              </div>
              `
            )
            .addTo(map);
        });

        // Change cursor on hover
        map.on('mouseenter', 'trajectory-layer', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'trajectory-layer', () => {
          map.getCanvas().style.cursor = '';
        });
      } catch (error) {
        console.error('Failed to load trajectory data:', error);
      }
    };

    loadTrajectoryData();

    // Cleanup
    return () => {
      if (map.getLayer('trajectory-layer')) {
        map.removeLayer('trajectory-layer');
      }
      if (map.getSource('trajectory-source')) {
        map.removeSource('trajectory-source');
      }
    };
  }, [map, visible, filter]);

  return null;
};

export default TrajectoryLayer;
