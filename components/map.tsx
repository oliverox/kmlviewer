'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import ReactLeafletKml from 'react-leaflet-kml';
import { LoaderCircleIcon } from 'lucide-react';
import { useMap } from 'react-leaflet/hooks';

function calcBoundingBox(coords: { lat: number; lng: number }[]) {
  const lats = [];
  const lngs = [];
  for (const coord of coords) {
    lats.push(coord.lat);
    lngs.push(coord.lng);
  }
  const minlat = Math.min(...lats),
    maxlat = Math.max(...lats);
  const minlng = Math.min(...lngs),
    maxlng = Math.max(...lngs);
  const bbox = [
    [minlat, minlng],
    [maxlat, maxlng],
  ];
  console.log('bbox=', bbox);
  return bbox;
}

function FitBoundsComponent({ bbox }: { bbox: number[][] | null }) {
  const map = useMap();
  if (!bbox) return null;
  if (
    isNaN(bbox[0][0]) ||
    isNaN(bbox[0][1]) ||
    isNaN(bbox[1][0]) ||
    isNaN(bbox[0][1])
  ) {
    return null;
  }
  map.fitBounds([
    [bbox[0][0], bbox[0][1]],
    [bbox[1][0], bbox[1][1]],
  ]);
  console.log(
    'FitBoundsComponent: map center, zoom:',
    map.getCenter(),
    map.getZoom()
  );
  return null;
}

export function Map({ id }: { id: string }) {
  const [kml, setKml] = useState<Document | null>(null);
  const [bbox, setBbox] = useState<number[][] | null>(null);
  const [latlng, setLatLng] = useState<{ lat: number; lng: number } | null>(
    null
  );
  useEffect(() => {
    fetch(`https://utfs.io/f/${id}`)
      .then((res) => res.text())
      .then((kmlText) => {
        const parser = new DOMParser();
        const kml = parser.parseFromString(kmlText, 'text/xml');
        setKml(kml);
        console.log('kml=', kml);
        const all_coords_str = kml.getElementsByTagName('coordinates');
        console.log('all_coords_str=', all_coords_str);
        if (all_coords_str.length > 0) {
          const all_coords: { lat: number; lng: number }[] = [];
          all_coords_str[0].textContent
            ?.trim()
            .split(' ')
            .forEach((coord, index) => {
              const [lng, lat] = coord.split(',');
              console.log('index, coord=', index, coord);
              if (index === 0) {
                setLatLng({ lat: parseFloat(lat), lng: parseFloat(lng) });
              }
              all_coords.push({ lat: parseFloat(lat), lng: parseFloat(lng) });
            });
          setBbox(calcBoundingBox(all_coords));
        }
      });
  }, [id]);

  return (
    <div className="h-screen w-full">
      {!latlng && (
        <div className="flex flex-col items-center justify-center gap-2">
          <LoaderCircleIcon className="w-10 h-10 animate-spin" />
          <span>Loading the map...</span>
        </div>
      )}
      {latlng && (
        <MapContainer
          style={{ height: '100%', width: '100%', backgroundColor: '#a1cdd9' }}
          zoom={7}
          center={latlng}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            noWrap={true}
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {kml && <ReactLeafletKml kml={kml} />}
          <FitBoundsComponent bbox={bbox} />
        </MapContainer>
      )}
    </div>
  );
}
