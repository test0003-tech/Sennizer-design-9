'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { MapPin, Crosshair, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MapPickerProps {
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (lat: number, lng: number) => void;
}

export default function MapPicker({ latitude, longitude, onLocationChange }: MapPickerProps) {
  const [localLat, setLocalLat] = useState<string>(latitude?.toString() || '');
  const [localLng, setLocalLng] = useState<string>(longitude?.toString() || '');
  const [isLocating, setIsLocating] = useState(false);
  const [mapError, setMapError] = useState<string>('');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<InstanceType<typeof import('leaflet').default.Map> | null>(null);

  // Default center: India
  const centerLat = latitude ?? 20.5937;
  const centerLng = longitude ?? 78.9629;

  useEffect(() => {
    let L: typeof import('leaflet').default;

    const initMap = async () => {
      try {
        L = (await import('leaflet')).default;

        if (!mapRef.current) return;

        const map = L.map(mapRef.current, {
          center: [centerLat, centerLng],
          zoom: latitude ? 15 : 5,
          scrollWheelZoom: true,
          zoomControl: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        // When the map is panned/zoomed, the center IS the pin location.
        // Since pin is always centered, map center = selected location.
        map.on('moveend', () => {
          const center = map.getCenter();
          const lat = parseFloat(center.lat.toFixed(6));
          const lng = parseFloat(center.lng.toFixed(6));
          setLocalLat(lat.toString());
          setLocalLng(lng.toString());
          onLocationChange(lat, lng);
        });

        // Also update on move for smoother feedback (don't call onLocationChange to avoid excessive updates)
        map.on('move', () => {
          const center = map.getCenter();
          const lat = parseFloat(center.lat.toFixed(6));
          const lng = parseFloat(center.lng.toFixed(6));
          setLocalLat(lat.toString());
          setLocalLng(lng.toString());
        });

        // When user clicks/taps on the map, pan the map so the clicked point
        // moves to the center (under the pin)
        map.on('click', (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          map.panTo([lat, lng], { animate: true });
        });

        // Critical: invalidateSize after the container is in the DOM and visible
        setTimeout(() => {
          map.invalidateSize();
        }, 200);

        mapInstanceRef.current = map;
      } catch (err) {
        console.error('Map initialization error:', err);
        setMapError('Failed to load map. Please refresh the page.');
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateMapView = useCallback(async (lat: number, lng: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 15, { animate: true });
    }
  }, []);

  const handleManualLatLong = useCallback(() => {
    const lat = parseFloat(localLat);
    const lng = parseFloat(localLng);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return;
    }
    onLocationChange(lat, lng);
    updateMapView(lat, lng);
  }, [localLat, localLng, onLocationChange, updateMapView]);

  const handleCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setMapError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setMapError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = parseFloat(position.coords.latitude.toFixed(6));
        const lng = parseFloat(position.coords.longitude.toFixed(6));
        setLocalLat(lat.toString());
        setLocalLng(lng.toString());
        onLocationChange(lat, lng);
        updateMapView(lat, lng);
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setMapError('Location permission denied. Please enable location access.');
            break;
          case error.POSITION_UNAVAILABLE:
            setMapError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setMapError('Location request timed out.');
            break;
          default:
            setMapError('An unknown error occurred while getting location.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [onLocationChange, updateMapView]);

  return (
    <div className="space-y-4">
      {/* Map Container with centered pin overlay */}
      <div className="relative rounded-lg overflow-hidden border border-border shadow-sm">
        {/* Centered Pin - Always stays at center of map */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1000]">
          <div className="relative -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="36" height="54" className="drop-shadow-lg">
              <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="#DC2626"/>
              <circle cx="12" cy="12" r="5" fill="white"/>
            </svg>
            {/* Small shadow circle at pin tip */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-4 h-2 rounded-full bg-black/20 blur-[2px]" />
          </div>
        </div>

        {/* Leaflet Map */}
        <div
          ref={mapRef}
          className="w-full h-[450px]"
          style={{ background: '#e5e7eb' }}
        />

        {mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/80 z-[1001]">
            <div className="text-center p-4">
              <p className="text-destructive text-sm font-medium">{mapError}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setMapError('')}
              >
                Dismiss
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Map Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleCurrentLocation}
          disabled={isLocating}
          className="flex-1"
        >
          {isLocating ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Locating...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Crosshair className="h-4 w-4" />
              Use My Current Location
            </div>
          )}
        </Button>
      </div>

      {/* Manual Lat/Long Input */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
        <div className="space-y-1.5">
          <Label htmlFor="latitude" className="text-sm font-medium">
            Latitude <span className="text-destructive">*</span>
          </Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            placeholder="e.g. 28.613895"
            value={localLat}
            onChange={(e) => setLocalLat(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="longitude" className="text-sm font-medium">
            Longitude <span className="text-destructive">*</span>
          </Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            placeholder="e.g. 77.209005"
            value={localLng}
            onChange={(e) => setLocalLng(e.target.value)}
          />
        </div>
        <Button
          type="button"
          variant="default"
          onClick={handleManualLatLong}
          className="h-[38px] px-4"
        >
          <Navigation className="h-4 w-4 mr-1.5" />
          Pin It
        </Button>
      </div>

      {/* Instructions */}
      <div className="flex items-start gap-2 rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
        <div>
          <span className="font-medium text-foreground">Tap or drag the map</span> to position the pin. The red pin always stays centered &mdash; tap anywhere and the map will pan so that point appears under the pin. You can also use &quot;Use My Current Location&quot; or enter coordinates manually.
        </div>
      </div>
    </div>
  );
}
