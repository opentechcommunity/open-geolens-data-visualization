import React, { useState, useEffect } from 'react';
import Filter from './components/Filter';
import Map from './components/Map';
import bbox from '@turf/bbox';
import tokml from "geojson-to-kml";
import { Header, Container, Grid, Segment, Button, Icon } from 'semantic-ui-react';
import Insights from './components/Insights';
var togpx = require('togpx');

function App() {
  const init_loading = {
    districts: true,
    categories: false,
    subcategories: false,
    data_types: false,
    geojson: false,
    map: false,
  }
  const [filteredData, setFilteredData] = useState({});
  const [geo_json, setGeoJSON] = useState();
  const [district_boundary, setDistrictBoundary] = useState();
  const [bounds, setBounds] = useState([[26.6, 84], [30, 86]]);
  const [_switch, setSwitch] = useState(true);
  const [loading, setLoading] = useState(init_loading)
  const [large_file, setDataSizeIsLarge] = useState()



  const onFilterChange = (filters) => {
    const { district, category, subCategory, dataType } = filters;
    setFilteredData({ district, category, subCategory, dataType })
  };

  useEffect(() => {
    if (geo_json || district_boundary) {
      const bboxArray = bbox(district_boundary);
      const corner1 = [bboxArray[1], bboxArray[0]];
      const corner2 = [bboxArray[3], bboxArray[2]];
      if (isFinite(bboxArray[0]) && isFinite(bboxArray[1]) && isFinite(bboxArray[2]) && isFinite(bboxArray[3])) {
        setBounds([corner2, corner1])
      }
    }
    setSwitch(!_switch)
  }, [geo_json, district_boundary])

  const downloadFile = (filename, blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename; // Specify the filename
    a.click();
  }

  const downloadGeojson = () => {
    const blob = new Blob([JSON.stringify(geo_json)], { type: 'application/json' });
    downloadFile('data.geojson', blob)
  }
  const downloadKML = () => {
    const kml = tokml(geo_json);
    const blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
    downloadFile('data.kml', blob)
  }
  const downloadGPX = () => {
    const gpxData = togpx(geo_json)
    const blob = new Blob([gpxData], { type: 'application/gpx+xml' });
    downloadFile('data.gpx', blob)
  }

  const downloadOptions = () => {
    if (large_file) {
      return (<Segment style={{ padding: 5, margin: 5, position: 'absolute', zIndex: 1000, bottom: 0 }}>
        <Button icon basic labelPosition='right' primary href={large_file}>
          Download (ZIP File)<Icon name='download' />
        </Button>
      </Segment>)
    } else if (geo_json && geo_json.features.length > 0) {
      return (<Segment style={{ padding: 5, margin: 5, position: 'absolute', zIndex: 1000, bottom: 0 }}>
        <Button icon basic labelPosition='right' primary onClick={downloadGeojson}>Export GeoJSON <Icon name='download' /></Button>
        <Button icon basic labelPosition='right' primary onClick={downloadKML}>Export KML <Icon name='download' /></Button>
        <Button icon basic labelPosition='right' primary onClick={downloadGPX}>Export GPX <Icon name='download' /></Button>
      </Segment>)
    } else {
      return <></>
    }
  }

  return (
    <Container fluid style={{ padding: 20 }}>
      <Header as='h1'>Open GeoLens [Nepal's data in OpenStreetMap]: Visualizing resources of Human Development</Header>
      <Grid stackable columns={3}>
        <Grid.Row>

          {/* Filter Component */}
          <Grid.Column width={3} style={{ padding: '0', }}>
            <Segment >
              <Filter {...{ onFilterChange, geo_json, setGeoJSON, setDistrictBoundary, loading, setLoading, setDataSizeIsLarge }} />
            </Segment>
            <a style={{ float: 'left', marginLeft: '14px' }} href="https://gautamarjun.com.np/contact">CONTACT</a>
          </Grid.Column>


          <Grid.Column width={4} >
            <Segment >
              <Insights filteredJsonData={geo_json} filteredData={filteredData} />

            </Segment>
          </Grid.Column>

          <Grid.Column width={9} style={{ padding: '0', }}>
            {/* Map Component */}
            <Map
              geoJSONData={geo_json}
              _switch={_switch}
              district={filteredData.district}
              bounds={bounds}
              district_boundary={district_boundary}
              loading={loading.map || loading.geojson}
              downloadOptions={downloadOptions}
              style={{ padding: '0', }}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>

    </Container>
  );
}
export default App;
