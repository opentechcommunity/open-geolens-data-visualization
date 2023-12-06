// import React, { useEffect, useState } from 'react';
// import HealthyLiving from './InsightsCharts/HealthyLiving';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Rectangle } from 'recharts';

// const Insights = ({ filteredJsonData, filteredData }) => {
//     const [booleanData, setBooleanData] = useState([]);
//     const [categoricalData, setCategoricalData] = useState([]);

//     useEffect(() => {
//         if (filteredJsonData && filteredJsonData.features) {
//             const booleanProps = {};
//             const categoricalProps = {};

//             filteredJsonData.features.forEach((feature) => {
//                 const properties = feature.properties;

//                 Object.entries(properties).forEach(([key, value]) => {
//                     if (value === true || value === false || value === 'yes' || value === 'no') {
//                         if (!booleanProps[key]) {
//                             booleanProps[key] = 1;
//                         } else {
//                             booleanProps[key]++;
//                         }
//                     } else {
//                         if (!categoricalProps[key]) {
//                             categoricalProps[key] = {};
//                             categoricalProps[key][value] = 1;
//                         } else {
//                             if (!categoricalProps[key][value]) {
//                                 categoricalProps[key][value] = 1;
//                             } else {
//                                 categoricalProps[key][value]++;
//                             }
//                         }
//                     }
//                 });
//             });

//             const sortedBooleanData = Object.entries(booleanProps)
//                 .map(([key, value]) => ({ name: key, count: value }))
//                 .sort((a, b) => b.count - a.count) // Sort by count in descending order
//                 .slice(0, 4); // Take the top 6 properties

//             setBooleanData(sortedBooleanData);

//             const categoricalDataArray = Object.entries(categoricalProps)
//                 .map(([key, value]) => ({ name: key, count: Object.keys(value).length }));

//             setCategoricalData(categoricalDataArray);
//         }
//     }, [filteredJsonData]);

//     return (
//         <div>
//             <h2>Insights</h2>
//             <div style={{ height: '80vh', width: '100%' }}>
//                 <ResponsiveContainer width="100%" height="90%">
//                     <BarChart
//                         width={500}
//                         height={200}
//                         data={booleanData}
//                         margin={{
//                             top: 5,
//                             right: 0,
//                             left: -30,
//                             bottom: 5,
//                         }}
//                     >
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="name" />
//                         <YAxis />
//                         <Tooltip />
//                         <Legend />
//                         <Bar dataKey="count" fill="#8884d8" activeBar={<Rectangle fill="#8884f8" />} />
//                     </BarChart>
//                 </ResponsiveContainer>
//             </div>
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Property</th>
//                         <th>Count</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {categoricalData.map((entry, index) => (
//                         <tr key={index}>
//                             <td>{entry.name}</td>
//                             <td>{entry.count}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//             <HealthyLiving />
//         </div>
//     );
// };

// export default Insights;