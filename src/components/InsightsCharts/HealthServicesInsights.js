// import { useEffect, useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Rectangle } from 'recharts';

// const HospitalServicesInsights = ({ filteredJsonData }) => {
//     const [hospitalPropertyCount, setHospitalPropertyCount] = useState({
//         emergency: { yes: 0, no: 0 },
//         ambulance: { yes: 0, no: 0 },
//         icu: { yes: 0, no: 0 },
//         dispensing: { yes: 0, no: 0 },
//         xray: { yes: 0, no: 0 },

//     });

//     useEffect(() => {
//         if (filteredJsonData && filteredJsonData.features) {
//             let updatedCount = {
//                 emergency: { yes: 0, no: 0 },
//                 ambulance: { yes: 0, no: 0 },
//                 icu: { yes: 0, no: 0 },
//                 dispensing: { yes: 0, no: 0 },
//                 xray: { yes: 0, no: 0 },
//             };

//             // function to increment count
//             const updateCount = (category, value) => {
//                 if (value === 'yes') {
//                     updatedCount[category].yes++;
//                 } else if (value === 'no') {
//                     updatedCount[category].no++
//                 }
//             }


//             //count and increase the occurrence of yes and no in each using above function
//             filteredJsonData.features.forEach(({ properties }) => {
//                 const {
//                     emergency,
//                     'facility:ambulance': ambulance,
//                     'facility:icu': icu,
//                     dispensing,
//                     'facility:x-ray': xray,
//                 } = properties || {};

//                 updateCount('emergency', emergency);
//                 updateCount('ambulance', ambulance);
//                 updateCount('icu', icu);
//                 updateCount('dispensing', dispensing);
//                 updateCount('xray', xray);
//             });

//             setHospitalPropertyCount(updatedCount);
//         }
//     }, [filteredJsonData]);

//     //generate data for chart
//     const serviceTypes = ['emergency', 'ambulance', 'icu', 'dispensing', 'xray'];

//     const hospitalPropertyData = serviceTypes.filter(service => hospitalPropertyCount[service].yes !== 0 || hospitalPropertyCount[service].no !== 0).map(service => ({
//         name: service.charAt(0).toUpperCase() + service.slice(1),
//         Yes: hospitalPropertyCount[service].yes,
//         No: hospitalPropertyCount[service].no,
//     }));


//     return (
//         <div style={{ height: '80vh', width: '100%' }}>
//             <ResponsiveContainer width="100%" height="90%">
//                 <BarChart
//                     width={500}
//                     height={200}
//                     data={hospitalPropertyData}
//                     margin={{
//                         top: 5,
//                         right: 0,
//                         left: -30,
//                         bottom: 5,
//                     }}
//                 >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="Yes" fill="#8884d8" activeBar={<Rectangle fill="#8884f8" />} />
//                     <Bar dataKey="No" fill="#82ca9d" activeBar={<Rectangle fill="#20B2AA" />} />

//                 </BarChart>
//             </ResponsiveContainer>
//         </div>
//     );
// };

// export default HospitalServicesInsights;
