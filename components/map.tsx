'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import ReactLeafletKml from 'react-leaflet-kml';

export function Map({ id }: { id: string }) {
  const [kml, setKml] = useState<Document | null>(null);
  useEffect(() => {
    fetch(`https://utfs.io/f/${id}`)
      .then((res) => res.text())
      .then((kmlText) => {
        const parser = new DOMParser();
        const kml = parser.parseFromString(kmlText, 'text/xml');
        setKml(kml);
        console.log('kml=', kml);
      });
  }, [id]);

  return (
    <div className="h-screen w-full">
      <MapContainer
        style={{ height: '100%', width: '100%', backgroundColor: '#a1cdd9' }}
        zoom={10}
        center={{ lat: -20.51417, lng: 57.572495 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap={true}
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {kml && <ReactLeafletKml kml={kml} />}
      </MapContainer>
    </div>
  );
}
