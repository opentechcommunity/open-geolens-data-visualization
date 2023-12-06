import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Rectangle, PieChart, Pie, Cell } from 'recharts';

const Insights = ({ filteredJsonData, filteredData }) => {
  const [booleanData, setBooleanData] = useState([]);
  // const [repeatedValues, setRepeatedValues] = useState({});
  const { category, subCategory, dataType } = filteredData;

  useEffect(() => {
    if (!category || !subCategory || !dataType || !filteredJsonData || !filteredJsonData.features) {
      setBooleanData([]);
      return;
    }

    const booleanProps = {};
    const propertyOccurrences = {};

    filteredJsonData.features.forEach((feature) => {
      const properties = feature.properties;

      Object.entries(properties).forEach(([key, value]) => {
        // Filtering boolean values
        if (value === true || value === false || value === 'yes' || value === 'no') {
          booleanProps[key] = (booleanProps[key] || 0) + 1;
        }

        // Filtering categorical values
        if (typeof value === 'string' && value.trim() !== '') {
          if (!propertyOccurrences[key]) {
            propertyOccurrences[key] = {};
          }
          propertyOccurrences[key][value] = (propertyOccurrences[key][value] || 0) + 1;
        }
      });
    });

    // Converting booleanProps to an array of objects for visualization
    const booleanDataArray = Object.entries(booleanProps)
      .map(([name, count]) => ({ name, count }))
      .slice(0, 7);

    setBooleanData(booleanDataArray);

    // Filtering categorical values for repeated occurrences
    // const repeatedValues = {};
    // Object.keys(propertyOccurrences).forEach((key) => {
    //   repeatedValues[key] = Object.keys(propertyOccurrences[key])
    //     .filter((value) => propertyOccurrences[key][value] > 1)
    //     .reduce((acc, value) => {
    //       acc[value] = propertyOccurrences[key][value];
    //       return acc;
    //     }, {});
    // });

    // setRepeatedValues(repeatedValues);

  }, [filteredJsonData, category, subCategory, dataType]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#BB9CC0', '#FA8742', '#FA7842', '#F23742', '#FG4742'];

  return (
    <div>
      <h2>Insights</h2>
      {category && subCategory && dataType ? (
        <div style={{ height: '80vh', width: '100%' }}>

          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              width={500}
              height={200}
              data={booleanData}
              margin={{
                top: 5,
                right: 0,
                left: -30,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" activeBar={<Rectangle fill="#8884f8" />} />
            </BarChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="100%" height="60%" >
            <PieChart width={400} height={400}>
              <Pie
                data={booleanData}
                cx="50%"
                labelLine={false}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {booleanData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          {/* <div>
            <h1>Categorical Insights</h1>
            {Object.keys(repeatedValues).map((key) => (
              <div key={key}>

                <ul>
                  {Object.entries(repeatedValues[key]).map(([value, count]) => (
                    <li key={`${key}-${value}`}>
                      {value} - Count: {count}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div> */}
        </div>
      ) : (
        <p>Please select District, Category, Subcategory, and Resource/Infrastructure.</p>
      )}
    </div>
  );
};

export default Insights;
