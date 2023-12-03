import { Header } from 'semantic-ui-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const TransportationInsights = ({ filteredJsonData }) => {
    if (!filteredJsonData || !filteredJsonData.features) {
        return <div>No data available</div>;
    }
    let surfaceCount = 0,
        highwayCount = 0,
        onewayCount = 0,
        bicycleCount = 0,
        footCount = 0;

    // Iterating for each road to count their properties
    filteredJsonData.features.forEach((feature) => {
        const { properties } = feature || {};
        const { surface, highway, oneway, bicycle, foot } = properties || {};

        if (surface === 'paved') {
            surfaceCount++;
        }

        if (highway === 'trunk') {
            highwayCount++;
        }
        if (oneway === 'yes') {
            onewayCount++;
        }
        if (bicycle === 'yes') {
            bicycleCount++;
        }
        if (foot === 'yes') {
            footCount++;
        }
    });

    //data for pi chart
    const data = [
        { name: 'Paved', value: surfaceCount },
        { name: 'Trunk', value: highwayCount },
        { name: 'One-way', value: onewayCount },
        { name: 'Bicycle', value: bicycleCount },
        { name: 'Foot', value: footCount },
    ];
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#BB9CC0', '#FA8742'];

    return (
        <div style={{ height: '80vh', width: '100%' }}>
            <Header size='medium' textAlign='center' style={{ margin: '30px 0' }}>Major Roads Insights</Header>
            <ResponsiveContainer width="100%" height="60%" >
                <PieChart width={400} height={200}>
                    <Pie
                        data={data}
                        cx="50%"

                        labelLine={false}
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Legend />
                </PieChart>
            </ResponsiveContainer>


        </div>
    );
};

export default TransportationInsights;
