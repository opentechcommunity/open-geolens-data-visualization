import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Rectangle } from 'recharts';

const HospitalServicesInsights = ({ filteredJsonData }) => {
    const [hospitalPropertyCount, setHospitalPropertyCount] = useState({
        emergency: { yes: 0, no: 0, nullValue: 0 },
        ambulance: { yes: 0, no: 0, nullValue: 0 },
        icu: { yes: 0, no: 0, nullValue: 0 },
    });

    useEffect(() => {
        if (filteredJsonData && filteredJsonData.features) {
            let updatedCount = {
                emergency: { yes: 0, no: 0, nullValue: 0 },
                ambulance: { yes: 0, no: 0, nullValue: 0 },
                icu: { yes: 0, no: 0, nullValue: 0 },
            };

            filteredJsonData.features.forEach((feature) => {
                const { properties } = feature;
                const { emergency, 'facility:ambulance': ambulance, 'facility:icu': icu } = properties || {};

                // emergency service
                if (emergency === 'yes') {
                    updatedCount.emergency.yes++;
                } else if (emergency === 'no') {
                    updatedCount.emergency.no++;
                } else {
                    updatedCount.emergency.nullValue++;
                }

                // ambulance service
                if (ambulance === 'yes') {
                    updatedCount.ambulance.yes++;
                } else if (ambulance === 'no') {
                    updatedCount.ambulance.no++;
                } else {
                    updatedCount.ambulance.nullValue++;
                }

                // icu service
                if (icu === 'yes') {
                    updatedCount.icu.yes++;
                } else if (icu === 'no') {
                    updatedCount.icu.no++;
                } else {
                    updatedCount.icu.nullValue++;
                }
            });

            setHospitalPropertyCount(updatedCount);
        }
    }, [filteredJsonData]);

    const hospitalPropertyData = [
        {
            name: 'Emergency',
            Yes: hospitalPropertyCount.emergency.yes,
            No: hospitalPropertyCount.emergency.no,
            Unknown: hospitalPropertyCount.emergency.nullValue,
        },
        {
            name: 'Ambulance',
            Yes: hospitalPropertyCount.ambulance.yes,
            No: hospitalPropertyCount.ambulance.no,
            Unknown: hospitalPropertyCount.ambulance.nullValue,
        },
        {
            name: 'ICU',
            Yes: hospitalPropertyCount.icu.yes,
            No: hospitalPropertyCount.icu.no,
            Unknown: hospitalPropertyCount.icu.nullValue,
        },
    ];

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    width={500}
                    height={200}
                    data={hospitalPropertyData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Yes" fill="#FFC300" activeBar={<Rectangle fill="#FFD700" />} />
                    <Bar dataKey="No" fill="#82ca9d" activeBar={<Rectangle fill="#20B2AA" />} />
                    <Bar dataKey="Unknown" fill="#8884d8" activeBar={<Rectangle fill="#6495ED" />} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default HospitalServicesInsights;
