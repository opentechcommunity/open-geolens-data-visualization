import React from 'react';
import EducationInsights from "./InsightsCharts/EducationInsights";
import HealthServicesInsights from "./InsightsCharts/HealthServicesInsights";
import TransportationInsights from "./InsightsCharts/TransportationInsights";

const Insights = ({ filteredJsonData, filteredData }) => {
  if (!filteredJsonData || !filteredJsonData.features || !filteredData) {
    return <h2>Insights loading...</h2>;
  }

  const { category } = filteredData;

  return (
    <div>
      <h2>Insights</h2>
      {category === 'educational-development' && (
        <EducationInsights filteredJsonData={filteredJsonData} filteredData={filteredData} />
      )}
      {category === 'healthy-living' && (
        <HealthServicesInsights filteredJsonData={filteredJsonData} filteredData={filteredData} />
      )}
      {category === 'economic-activities' && (
        <TransportationInsights filteredJsonData={filteredJsonData} filteredData={filteredData} />
      )}
    </div>
  );
};

export default Insights;
