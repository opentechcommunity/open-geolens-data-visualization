import HealthServicesInsights from "./InsightsCharts/HealthServicesInsights"

const Insights = ({ filteredJsonData }) => {
  return (
    <div>
      <h1>Insights</h1>
      <HealthServicesInsights filteredJsonData={filteredJsonData} />
    </div>
  )
}
export default Insights