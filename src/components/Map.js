import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import { Loader } from 'semantic-ui-react';

import { MapContainer, TileLayer, GeoJSON, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import MarkerClusterGroup from 'react-leaflet-cluster'

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const customStyle = {
  fillColor: 'white',      // White fill color with opacity
  fillOpacity: 0.4,        // Opacity of the fill color
  color: 'black',           // Border color of the polygon
  weight: 2,               // Border width
  dashArray: '5',          // Dash pattern for the border (5 pixels on, 5 pixels off)
};

const tiles = {
  wikimedia: "https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png",
  cartocdn: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  arcgisonline_topo: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
  arcgisonline_street: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
  arcgisonline: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  nationalmap: "https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}",
  stamen: "http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg",
  stadiamaps: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
  tile: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
}


const Map = ({ geoJSONData, district, bounds, district_boundary, _switch, downloadOptions, loading }) => {
  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.name) {
      layer.bindPopup(`
        <b>ID: ${feature.id.match(/(\d+)/)[0]}<br/><br/>${feature.properties.name}</b><br />
      `);
    }
  };

  return (
    <MapContainer
      zoom={8}
      bounds={bounds}
      style={{ height: '90vh', width: '100%' }}
      key={_switch}
    >
      {downloadOptions()}
      {loading && <Loader active inline style={{ textAlign: 'center', width: '100%', marginTop: '25%' }} />}

      <TileLayer
        url={tiles.tile}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MarkerClusterGroup>
        {district_boundary && (
          <GeoJSON data={district_boundary} style={customStyle} />
        )}
        {geoJSONData && (
          <GeoJSON data={geoJSONData} onEachFeature={onEachFeature} />
        )}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default Map;
