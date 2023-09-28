import React, { useState, useEffect } from 'react';
import axios from './axiosConfig';
import { Button, Dropdown, Label, Segment, Loader } from 'semantic-ui-react';
import { ToastContainer, toast } from 'react-toastify';

function Filter({ setDistrictBoundary, onFilterChange, geo_json, setGeoJSON }) {
  const init_loading = {
    districts: true,
    categories: false,
    subcategories: false,
    data_types: false,
    geojson: false,
  }
  const [loading, setLoading] = useState(init_loading)
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
      setLoading({...loading, districts: false})
    }).catch(e=>setLoading({...loading, districts: false}));

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
    setSelectedCategory('')
    setSelectedSubCategory('')
    setSelectedDataType('')
    if (value) {
      axios.get(`/api/district/${value}`)
        .then((response) => {
          if (response?.data) {
            setDistrictBoundary(JSON.parse(response.data))
            setGeoJSON()
          }
        })
        .catch((error) => {
        });
    }
  };

  const handleCategoryChange = (e, { value }) => {
    setLoading({...loading, subcategories: true})
    setSelectedCategory(value);
    setSelectedSubCategory('')
    setSelectedDataType('')
    if (value) {
      axios.get(`/api/subcategories/${value}`)
        .then((response) => {
          if (response?.data) {
            setSubcategories(response.data);
            setLoading({...loading, subcategories: false})
          }
        })
        .catch((error) => {
          setLoading({...loading, subcategories: false})
        });
    } else {
      setSubcategories([]);
    }
  };

  const handleSubCategoryChange = (e, { value }) => {
    setLoading({...loading, data_types: true})
    setSelectedSubCategory(value);
    setSelectedDataType('')
    if (value) {
      axios.get(`/api/data-types/${selectedCategory}/${value}`)
        .then((response) => {
          if (response?.data) {
            setDataTypes(response.data);
            setLoading({...loading, data_types: false})
          }
        })
        .catch((error) => {
          setLoading({...loading, data_types: false})
        });
    } else {
      setDataTypes([]);
    }
  };

  const handleDataTypeChange = (e, { value }) => {
    setSelectedDataType(value);
  };

  const onSubmit = () => {
    setLoading({...loading, geojson: true})
    const filePath = `${selectedDistrict}__${selectedCategory}__${selectedSubCategory}__${selectedDataType}`;
    if (selectedDataType) {
      axios.get(`/api/geojson/${filePath}`)
        .then((response) => {
          setLoading({...loading, geojson: false})
          setGeoJSON(JSON.parse(response.data))
          if (JSON.parse(response.data).features.length === 0) {
            toast.info("Empty Dataset!")
          }
        })
        .catch((error) => {
          setLoading({...loading, geojson: false})
        });
    }
  }
  return (
    <div>
    <ToastContainer />
    <>NEPAL 🇳🇵</>
    {loading &&
      (loading && Object.keys(loading).length > 0 && Object.keys(loading).map(i=>loading[i]).indexOf(true) > -1) &&
      <Loader active inline size="tiny" style={{marginLeft: 20}}/>
    }
    <h1>
      Get map information for:
    </h1>
    <Segment vertical>
      <Label>District:</Label>
      <Dropdown
        placeholder={loading.districts ? "Fetching districts..." : "Select District"}
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
        placeholder={loading.categories ? "Fetching categories..." : "Select Category"}
        selection
        search
        options={categories.map((category) => ({
          key: category.replace(/\.json$/, ''),
          text: category.replace(/\.json$/, '').replace(/-/g, ' ').replace(/^./, category[0].toUpperCase()),
          value: category.replace(/\.json$/, ''),
        }))}
        onChange={handleCategoryChange}
        value={selectedCategory}
        disabled={!selectedDistrict}
      />
    </Segment>

    <Segment vertical>
      <Label>Sub Category:</Label>
      <Dropdown
        placeholder={loading.subcategories ? "Loading subcategories..." : "Select Sub Category"}
        selection
        search
        options={subcategories.map((subcategory) => ({
          key: subcategory,
          text: subcategory.replace(/_/g, ' ').replace(/^./, subcategory[0].toUpperCase()),
          value: subcategory,
        }))}
        onChange={handleSubCategoryChange}
        value={selectedSubCategory}
        disabled={!selectedCategory || loading.subcategories}
      />
    </Segment>

    <Segment vertical>
      <Label>Infrastructure:</Label>
      <Dropdown
        placeholder="Select Data Type"
        placeholder={loading.data_types ? "Loading infrastructure..." : "Select Infrastructure"}
        selection
        search
        options={data_types.map((data_type) => ({
          key: data_type,
          text: data_type.replace(/_/g, ' ').replace(/^./, data_type[0].toUpperCase()),
          value: data_type,
        }))}
        onChange={handleDataTypeChange}
        value={selectedDataType}
        disabled={!selectedSubCategory || loading.data_types}
      />
    </Segment>
    <Button
      primary
      style={{marginTop: 20, marginBottom: 20}}
      onClick={onSubmit}
      disabled={(selectedDataType).length === 0 || loading.geojson}
      loading={loading.geojson}
    >
      GENERATE
    </Button>
  </div>
  );
}

export default Filter;
