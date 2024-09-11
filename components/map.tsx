'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import ReactLeafletKml from 'react-leaflet-kml';
import { LoaderCircleIcon } from 'lucide-react';

export function Map({ id }: { id: string }) {
  const [kml, setKml] = useState<Document | null>(null);
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
        const all_coords = kml.getElementsByTagName('coordinates');
        if (all_coords.length > 0) {
          const [lng, lat] = all_coords[0].textContent
            ?.trim()
            .split(',') as string[];
          console.log('latlng', { lat: parseFloat(lat), lng: parseFloat(lng) });
          setLatLng({ lat: parseFloat(lat), lng: parseFloat(lng) });
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
        </MapContainer>
      )}
    </div>
  );
}
