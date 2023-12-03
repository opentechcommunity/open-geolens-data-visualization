import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EducationInsights = ({ filteredJsonData }) => {
    const [educationPropertyCount, setEducationPropertyCount] = useState({
        operator: { private: 0, government: 0, community: 0 },
        level: { primary: 0, secondary: 0, higher_secondary: 0, college: 0 },
    });

    useEffect(() => {
        if (filteredJsonData && filteredJsonData.features) {
            let updatedCount = {
                operator: { private: 0, government: 0, community: 0 },
                level: { primary: 0, secondary: 0, higher_secondary: 0, college: 0 },
            };

            const updateCount = (category, value) => {
                if (value !== undefined && value !== '') {
                    updatedCount[category][value]++;
                }
            };

            filteredJsonData.features.forEach((feature) => {
                const { properties } = feature || {};
                const { 'isced:level': level, 'operator:type': operator } = properties || {};

                updateCount('operator', operator);
                updateCount('level', level);
            });

            setEducationPropertyCount(updatedCount);
        }
    }, [filteredJsonData]);

    const educationChartData = [
        {
            name: 'Operator Type',
            Private: educationPropertyCount.operator.private,
            Government: educationPropertyCount.operator.government,
            Community: educationPropertyCount.operator.community,
        },
        {
            name: 'Isced Level',
            Primary: educationPropertyCount.level.primary,
            Secondary: educationPropertyCount.level.secondary,
            HigherSecondary: educationPropertyCount.level.higher_secondary,
            College: educationPropertyCount.level.college,
        }
    ];

    return (
        <div style={{ height: '80vh', width: '100%' }}>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart
                    width={500}
                    height={200}
                    data={educationChartData}
                    margin={{
                        top: 5,
                        right: 0,
                        left: -20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Private" fill="#8884d8" />
                    <Bar dataKey="Government" fill="#82ca9d" />
                    <Bar dataKey="Community" fill="#FF5733" />
                    <Bar dataKey="Primary" fill="#FFC300" />
                    <Bar dataKey="Secondary" fill="#e41a1c" />
                    <Bar dataKey="HigherSecondary" fill="#377eb8" />
                    <Bar dataKey="College" fill="#4daf4a" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default EducationInsights;
