import React, { useState, useEffect } from 'react';
import axios from './axiosConfig';
import { Button, Dropdown, Label, Segment } from 'semantic-ui-react';

function Filter({ setDistrictBoundary, onFilterChange, geo_json, setGeoJSON }) {
  const [districts, setDistricts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [data_types, setDataTypes] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedDataType, setSelectedDataType] = useState('');

  useEffect(() => {
    // Fetch district and category data from your server or file system
    axios.get('/api/districts').then((response) => {
      setDistricts(response.data);
    });

    axios.get('/api/categories').then((response) => {
      setCategories(response.data);
    });
  }, []);

  useEffect(() => {
    // Notify the parent component (App.js) when any filter changes
    onFilterChange({
      district: selectedDistrict,
      category: selectedCategory,
      subCategory: selectedSubCategory,
      dataType: selectedDataType,
    });
  }, [selectedDistrict, selectedCategory, selectedSubCategory, selectedDataType]);

  // Event handlers for dropdown selections

  const handleDistrictChange = (e, { value }) => {
    setSelectedDistrict(value);
    if (value) {
      axios.get(`/api/district/${value}`)
        .then((response) => {
          if (response?.data) {
            setDistrictBoundary(JSON.parse(response.data))
            setGeoJSON()
            setSelectedCategory('')
          }
        })
        .catch((error) => {
          // Handle errors
        });
    }
  };

  const handleCategoryChange = (e, { value }) => {
    setSelectedCategory(value);
    if (value) {
      axios.get(`/api/subcategories/${value}`)
        .then((response) => {
          if (response?.data) {
            setSubcategories(response.data);
            setSelectedSubCategory('')
            setSelectedDataType('')
          }
        })
        .catch((error) => {
          // Handle errors
        });
    } else {
      setSubcategories([]);
    }
  };

  const handleSubCategoryChange = (e, { value }) => {
    setSelectedSubCategory(value);
    if (value) {
      axios.get(`/api/data-types/${selectedCategory}/${value}`)
        .then((response) => {
          if (response?.data) {
            setDataTypes(response.data);
            setSelectedDataType('')
          }
        })
        .catch((error) => {
          // Handle errors
        });
    } else {
      setDataTypes([]);
    }
  };

  const handleDataTypeChange = (e, { value }) => {
    setSelectedDataType(value);
  };

  const onSubmit = () => {
    const filePath = `${selectedDistrict}__${selectedCategory}__${selectedSubCategory}__${selectedDataType}`;
    if (selectedDataType) {
      axios.get(`/api/geojson/${filePath}`)
        .then((response) => {
          setGeoJSON(JSON.parse(response.data))
        })
        .catch((error) => {
          // Handle errors
        });
    }
  }

  return (
    <div>
    <h1>
    Fetch Insight For
    </h1>
    <Segment vertical>
      <Label>District:</Label>
      <Dropdown
        placeholder="Select District"
        selection
        search
        options={districts.map((district) => ({
          key: district,
          text: district,
          value: district,
        }))}
        onChange={handleDistrictChange}
        value={selectedDistrict}
      />
    </Segment>

    <Segment vertical>
      <Label>Category:</Label>
      <Dropdown
        placeholder="Select Category"
        selection
        search
        options={categories.map((category) => ({
          key: category.replace(/\.json$/, ''),
          text: category.replace(/\.json$/, '').replace(/-/g, ' ').replace(/^./, category[0].toUpperCase()),
          value: category.replace(/\.json$/, ''),
        }))}
        onChange={handleCategoryChange}
        value={selectedCategory}
      />
    </Segment>

    <Segment vertical>
      <Label>Sub Category:</Label>
      <Dropdown
        placeholder="Select Sub Category"
        selection
        search
        options={subcategories.map((subcategory) => ({
          key: subcategory,
          text: subcategory.replace(/_/g, ' ').replace(/^./, subcategory[0].toUpperCase()),
          value: subcategory,
        }))}
        onChange={handleSubCategoryChange}
        value={selectedSubCategory}
        disabled={!selectedCategory}
      />
    </Segment>

    <Segment vertical>
      <Label>Infrastructure:</Label>
      <Dropdown
        placeholder="Select Data Type"
        selection
        search
        options={data_types.map((data_type) => ({
          key: data_type,
          text: data_type.replace(/_/g, ' ').replace(/^./, data_type[0].toUpperCase()),
          value: data_type,
        }))}
        onChange={handleDataTypeChange}
        value={selectedDataType}
        disabled={!selectedSubCategory}
      />
    </Segment>
    <Button
      primary
      style={{marginTop: 20, marginBottom: 20}}
      onClick={onSubmit}
      disabled={(selectedDataType).length === 0}
    >
      Submit
    </Button>
  </div>
  );
}

export default Filter;
