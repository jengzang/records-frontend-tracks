import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { getStays } from '../../services/trackService';
import { StaySegment } from '../../types/stay';
import { STAY_CATEGORY_COLORS } from '../../utils/constants';
import { formatDuration } from '../../utils/formatters';

interface StayAnnotationProps {
  map: mapboxgl.Map | null;
  visible: boolean;
  filter?: {
    startTime?: number;
    endTime?: number;
    minDuration?: number;
  };
}

const StayAnnotation: React.FC<StayAnnotationProps> = ({ map, visible, filter }) => {
  useEffect(() => {
    if (!map || !visible) return;

    const loadStayData = async () => {
      try {
        // Fetch stay segments
        const stays = await getStays(filter);

        // Remove existing layer and source if they exist
        if (map.getLayer('stay-layer')) {
          map.removeLayer('stay-layer');
        }
        if (map.getSource('stay-source')) {
          map.removeSource('stay-source');
        }

        // Convert stays to GeoJSON
        const geojson: GeoJSON.FeatureCollection = {
          type: 'FeatureCollection',
          features: stays.map((stay: StaySegment) => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [stay.center_lon, stay.center_lat],
            },
            properties: {
              category: stay.category,
              duration: stay.duration,
              confidence: stay.confidence,
              start_time: stay.start_time,
              end_time: stay.end_time,
            },
          })),
        };

        // Add source
        map.addSource('stay-source', {
          type: 'geojson',
          data: geojson,
        });

        // Add circle layer
        map.addLayer({
          id: 'stay-layer',
          type: 'circle',
          source: 'stay-source',
          paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['get', 'duration'],
              3600, 8,      // 1 hour = 8px
              86400, 20,    // 1 day = 20px
              604800, 30,   // 1 week = 30px
            ],
            'circle-color': [
              'match',
              ['get', 'category'],
              'HOME', STAY_CATEGORY_COLORS.HOME,
              'WORK', STAY_CATEGORY_COLORS.WORK,
              'TRANSIT', STAY_CATEGORY_COLORS.TRANSIT,
              'VISIT', STAY_CATEGORY_COLORS.VISIT,
              '#888888', // default
            ],
            'circle-opacity': 0.7,
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 2,
          },
        });

        // Add click handler
        map.on('click', 'stay-layer', (e) => {
          if (!e.features || e.features.length === 0) return;

          const feature = e.features[0];
          const props = feature.properties;

          const categoryLabels: Record<string, string> = {
            HOME: '家',
            WORK: '工作',
            TRANSIT: '中转',
            VISIT: '访问',
          };

          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(
              `
              <div class="p-2">
                <div><strong>类别:</strong> ${categoryLabels[props?.category || ''] || props?.category || 'N/A'}</div>
                <div><strong>时长:</strong> ${formatDuration(props?.duration || 0)}</div>
                <div><strong>置信度:</strong> ${((props?.confidence || 0) * 100).toFixed(1)}%</div>
                <div><strong>开始:</strong> ${new Date((props?.start_time || 0) * 1000).toLocaleString('zh-CN')}</div>
                <div><strong>结束:</strong> ${new Date((props?.end_time || 0) * 1000).toLocaleString('zh-CN')}</div>
              </div>
              `
            )
            .addTo(map);
        });

        // Change cursor on hover
        map.on('mouseenter', 'stay-layer', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'stay-layer', () => {
          map.getCanvas().style.cursor = '';
        });
      } catch (error) {
        console.error('Failed to load stay data:', error);
      }
    };

    loadStayData();

    // Cleanup
    return () => {
      if (map.getLayer('stay-layer')) {
        map.removeLayer('stay-layer');
      }
      if (map.getSource('stay-source')) {
        map.removeSource('stay-source');
      }
    };
  }, [map, visible, filter]);

  return null;
};

export default StayAnnotation;
