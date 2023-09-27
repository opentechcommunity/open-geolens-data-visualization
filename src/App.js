import React, { useState, useEffect } from 'react';
import Filter from './components/Filter';
import Map from './components/Map';
import bbox from '@turf/bbox';
import { Container, Grid, Segment } from 'semantic-ui-react'; // Import Semantic UI components

function App() {
  const [filteredData, setFilteredData] = useState({});
  const [geo_json, setGeoJSON] = useState();
  const [district_boundary, setDistrictBoundary] = useState();
  const [bounds, setBounds] = useState([[26.6, 84], [30, 86]]);
  const [_switch, setSwitch] = useState(true);

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
    }
    setSwitch(!_switch)
  }, [geo_json, district_boundary])

  return (
    <Container fluid>
      <Grid stackable columns={2}>
        <Grid.Row>
          <Grid.Column width={6}>
            <Segment>
              {/* Filter Component */}
              <Filter {...{onFilterChange, geo_json, setGeoJSON, setDistrictBoundary}}/>
            </Segment>
          </Grid.Column>
          <Grid.Column width={10}>
            <Segment>
              {/* Map Component */}
              <Map geoJSONData={geo_json} _switch={_switch} district={filteredData.district} bounds={bounds} district_boundary={district_boundary}/>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default App;
