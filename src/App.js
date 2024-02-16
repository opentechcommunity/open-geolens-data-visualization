import React, { useState, useEffect } from 'react';
import Filter from './components/Filter';
import Map from './components/Map';
import bbox from '@turf/bbox';
import tokml from "geojson-to-kml";
import { Header, Card, Container, Grid, Segment, Button, Icon, Statistic } from 'semantic-ui-react'; // Import Semantic UI components

const turf = require('@turf/turf');
var togpx = require('togpx');

const StatsDisplay = ({ analysisResults }) => {
  const {
    overlayResult,
    aggregatedLengthInKm,
    counts,
    total_boundary_area
  } = analysisResults;
  return (
    <Card fluid>
      <Card.Content>
      <Header as="h2">Feature Analysis</Header>
      {Object.keys(analysisResults).length === 0 && <h3><i>Generate a map above to get stats</i></h3>}
      {Object.keys(analysisResults).length > 0 && <Grid columns={3} divided style={{textAlign: 'center'}}>
        <Grid.Row>
          <Grid.Column>
            <Statistic>
              <Statistic.Value>{total_boundary_area.toFixed(2)}</Statistic.Value>
              <Statistic.Label>Area Selected (km<sup>2</sup>)</Statistic.Label>
            </Statistic>
          </Grid.Column>
          <Grid.Column>
            <Statistic>
              <Statistic.Value>{counts?.points}</Statistic.Value>
              <Statistic.Label>Points</Statistic.Label>
            </Statistic>
          </Grid.Column>
          <Grid.Column>
            <Statistic>
              <Statistic.Value>{counts?.lines}</Statistic.Value>
              <Statistic.Label>Lines</Statistic.Label>
            </Statistic>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Statistic>
              <Statistic.Value>{counts?.polygons}</Statistic.Value>
              <Statistic.Label>Polygons</Statistic.Label>
            </Statistic>
          </Grid.Column>
          <Grid.Column>
            <Statistic>
              <Statistic.Value>{aggregatedLengthInKm?.toFixed(2)}</Statistic.Value>
              <Statistic.Label>Total Length of Line (km)</Statistic.Label>
            </Statistic>
          </Grid.Column>
          <Grid.Column>
            <Statistic>
              <Statistic.Value>{overlayResult?.pointOverlapOnPolygonCount}</Statistic.Value>
              <Statistic.Label>Point Overlaps on Polygon</Statistic.Label>
            </Statistic>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Statistic>
              <Statistic.Value>{overlayResult?.polygonOverlapOnPolygonCount}</Statistic.Value>
              <Statistic.Label>Polygon Overlaps on Polygon</Statistic.Label>
            </Statistic>
          </Grid.Column>
          <Grid.Column>
            <Statistic>
              <Statistic.Value>{(counts?.points/total_boundary_area).toFixed(2)}</Statistic.Value>
              <Statistic.Label>Points Density (counts/km<sup>2</sup>)</Statistic.Label>
            </Statistic>
          </Grid.Column>
          <Grid.Column>
            <Statistic>
              <Statistic.Value>{(counts?.polygons/total_boundary_area).toFixed(2)}</Statistic.Value>
              <Statistic.Label>Polygon Density (counts/km<sup>2</sup>)</Statistic.Label>
            </Statistic>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Statistic>
              <Statistic.Value>{(counts?.lines/total_boundary_area).toFixed(2)}</Statistic.Value>
              <Statistic.Label>Line Density (counts/km<sup>2</sup>)</Statistic.Label>
            </Statistic>
          </Grid.Column>
          <Grid.Column>
            <Statistic>
              <Statistic.Value>{(aggregatedLengthInKm?.toFixed(2)/total_boundary_area).toFixed(2)}</Statistic.Value>
              <Statistic.Label>Line length (in km) per km<sup>2</sup></Statistic.Label>
            </Statistic>
          </Grid.Column>
        </Grid.Row>
      </Grid>}
      </Card.Content>
    </Card>
  );
};

const analyzeGeoJSON = (district_boundary, geojsonInput) => {
  // Function to calculate distance between two points
  const calculateDistance = (point1, point2) => {
    return turf.distance(point1, point2, { units: 'kilometers' });
  };

  // Function to calculate area and perimeter of a polygon
  const calculatePolygonStats = (polygon) => {
    const area = turf.area(polygon);
    const perimeter = turf.length(polygon, { units: 'kilometers' });
    return { area, perimeter };
  };

  // Function to perform overlay analysis
  const overlayAnalysis = (features) => {
    const points = features.filter((feature) => feature.geometry.type === 'Point');
    const polygons = features.filter((feature) => feature.geometry.type === 'Polygon');

    // Initialize counters for overlapping points and polygons
    let pointOverlapOnPolygonCount = 0;
    let polygonOverlapOnPolygonCount = 0;
    // Iterate through each point and polygon feature
    points.forEach((point) => {
      polygons.forEach((polygon) => {
        if (turf.booleanPointInPolygon(point.geometry.coordinates, polygon)) {
          pointOverlapOnPolygonCount++;
        }
      });
    });

    // Iterate through each pair of polygons to check for overlaps
    for (let i = 0; i < polygons.length; i++) {
      for (let j = i + 1; j < polygons.length; j++) {
        if (turf.booleanOverlap(polygons[i], polygons[j])) {
          polygonOverlapOnPolygonCount++;
        }
      }
    }

    return { pointOverlapOnPolygonCount, polygonOverlapOnPolygonCount };
  };

  const calculateAggregatedLength = (features) => {
    const lineStrings = features.filter((feature) => feature.geometry.type === 'LineString');

    // Calculate the aggregated length
    const aggregatedLengthInKm = lineStrings.reduce((totalLength, lineString) => {
      return totalLength + turf.length(lineString.geometry, { units: 'kilometers' });
    }, 0);

    return aggregatedLengthInKm;
  };

  const calculateGeoJSONArea = (geojson) => {
    const area = turf.area(geojson) / 1e6; // Convert square meters to square kilometers
    return area;
  };

  // Main function
  const generateStats = () => {
    const features = geojsonInput.features;

    const overlayResult = overlayAnalysis(features);
    const aggregatedLengthInKm = calculateAggregatedLength(features);
    const total_boundary_area = calculateGeoJSONArea(district_boundary)

    const counts = {
      points: features.filter((feature) => feature.geometry.type === 'Point').length,
      lines: features.filter((feature) => feature.geometry.type === 'LineString').length,
      polygons: features.filter((feature) => feature.geometry.type === 'Polygon').length,
    };
    return {
      overlayResult,
      aggregatedLengthInKm,
      counts,
      total_boundary_area,
    };
  };

  // Call the main function
  return generateStats();
};

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
  const [analysisResults, setAnalysisResults] = useState({});
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

  useEffect(()=>{
    if (geo_json || district_boundary) {
        const bboxArray = bbox(district_boundary);
        const corner1 = [bboxArray[1], bboxArray[0]];
        const corner2 = [bboxArray[3], bboxArray[2]];
        if (isFinite(bboxArray[0]) && isFinite(bboxArray[1]) && isFinite(bboxArray[2]) && isFinite(bboxArray[3])) {
          setBounds([corner2, corner1])
        }
        try {
          const analysis = analyzeGeoJSON(district_boundary, geo_json);
          setAnalysisResults(analysis)
        } catch (e) {
          setAnalysisResults({})
          console.log(e);
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
      return (<Segment style={{padding: 5, margin: 5, position: 'absolute', zIndex: 1000, bottom: 0}}>
        <Button icon basic labelPosition='right' primary href={large_file}>
          Download (ZIP File)<Icon name='download' />
        </Button>
      </Segment>)
    } else if (geo_json && geo_json.features.length > 0) {
      return (<Segment style={{padding: 5, margin: 5, position: 'absolute', zIndex: 1000, bottom: 0}}>
        <Button icon basic labelPosition='right' primary onClick={downloadGeojson}>Export GeoJSON <Icon name='download' /></Button>
        <Button icon basic labelPosition='right' primary onClick={downloadKML}>Export KML <Icon name='download' /></Button>
        <Button icon basic labelPosition='right' primary onClick={downloadGPX}>Export GPX <Icon name='download' /></Button>
      </Segment>)
    } else {
      return <></>
    }
  }

  return (
    <Container fluid style={{padding: 20}}>
      <Header as='h1'>Open GeoLens [Nepal's data in OpenStreetMap]: Visualizing resources of Human Development</Header>
      <Grid stackable columns={2}>
        <Grid.Row>
          <Grid.Column width={6}>
            <Segment style={{marginTop: '5vh'}}>
              {/* Filter Component */}
              <Filter {...{onFilterChange, geo_json, setGeoJSON, setDistrictBoundary, loading, setLoading, setDataSizeIsLarge}}/>
            </Segment>
          </Grid.Column>
          <Grid.Column width={10}>
            <Segment>
              {/* Map Component */}
              <Map
                geoJSONData={geo_json}
                _switch={_switch}
                district={filteredData.district}
                bounds={bounds}
                district_boundary={district_boundary}
                loading={loading.map || loading.geojson}
                downloadOptions={downloadOptions}
              />
            </Segment>
            <StatsDisplay analysisResults={analysisResults} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
        </Grid.Row>
      </Grid>

    </Container>
  );
}

export default App;
