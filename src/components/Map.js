import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
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

const Map = ({ geoJSONData, district, bounds, district_boundary, _switch }) => {
  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.name) {
      layer.bindPopup(`
        <b>OSM ID: ${feature.id}<br/><br/>${feature.properties.name}</b><br />
      `);
    }
  };

  return (
    <MapContainer
      zoom={8}
      bounds={bounds}
      style={{ height: '500px', width: '100%' }}
      key={_switch}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MarkerClusterGroup>
      {district_boundary && (
        <GeoJSON data={district_boundary} style={customStyle} />
      )}
      {geoJSONData && (
          <GeoJSON data={geoJSONData} onEachFeature={onEachFeature}/>
      )}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default Map;
