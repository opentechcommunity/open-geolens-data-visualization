import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Dropdown, Label, Segment, Loader } from 'semantic-ui-react';
import { ToastContainer, toast } from 'react-toastify';
import ReactGA from 'react-ga';

const JSZip = require('jszip');


function Filter({ setDistrictBoundary, onFilterChange, geo_json, setGeoJSON, loading, setLoading, setDataSizeIsLarge }) {
  const [districts, setDistricts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [data_types, setDataTypes] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedDataType, setSelectedDataType] = useState('');
  const [git_gj_map, setGITGJMap] = useState();

  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    const boundaries_name = "https://raw.githubusercontent.com/osmnepaldata/osm-nepal-ogl-data-metadata/main/boundaries.json";
    const categories_name = "https://raw.githubusercontent.com/osmnepaldata/osm-nepal-ogl-data-metadata/main/categories.json";
    const git_gj_map_url = 'https://api.github.com/repos/osmnepaldata/osm-nepal-ogl-data-metadata/contents/directory_geojson_mapping.zip?ref=main'
    axios.get(boundaries_name, {
        headers: {
          Accept: "application/octet-stream",
        },
        onDownloadProgress: (progressEvent) => {
          const percentage = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setDownloadProgress(percentage);
        },
      })
      .then((response) => {
        setDistricts(response.data);
        setLoading({...loading, districts: false})
      })
      .catch((error) => {
        console.error("Error fetching or extracting the .zip file:", error);
        setLoading({...loading, categories: false})
      });
    // setLoading({...loading, categories: true})
    axios.get(categories_name, {
        headers: {
          Accept: "application/octet-stream",
        },
        onDownloadProgress: (progressEvent) => {
          const percentage = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setDownloadProgress(percentage);
        },
      })
      .then((response) => {
        setCategories(response.data);
        // setLoading({...loading, categories: false})
      })
      .catch((error) => {
        console.error("Error fetching or extracting the .zip file:", error);
        // setLoading({...loading, categories: false})
      });
    axios.get(git_gj_map_url)
      .then(async response => {
        // Extract and decode the content
        const encodedContent = response.data.content;
        const decodedContent = atob(encodedContent);
        const zip = new JSZip();
        await zip.loadAsync(decodedContent)
        const geojsonContent = await zip.files[`directory_geojson_mapping.json`].async('text');
        const geojson = JSON.parse(geojsonContent);
        setGITGJMap(geojson)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

  }, []);

  // useEffect(() => {
  //   axios.get('/api/categories').then((response) => {
  //     setCategories(response.data);
  //   });
  // }, []);

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

  const handleDistrictChange = async (e, { value }) => {
    ReactGA.event({
      category: 'District Selection',
      action: 'Click',
      label: value, // optional
    });
    setLoading({...loading, map: true})
    setSelectedDistrict(value);
    setSelectedCategory('')
    setSelectedSubCategory('')
    setSelectedDataType('')
    const zipUrl = `https://api.github.com/repos/osmnepaldata/osm-nepal-ogl-data-metadata/contents/boundaries/${value}.geojson.zip?ref=main`
    if (zipUrl) {
      axios.get(zipUrl)
        .then(async response => {
          // Extract and decode the content
          setLoading({...loading, map: false})

          const encodedContent = response.data.content;
          const decodedContent = atob(encodedContent);
          const zip = new JSZip();
          await zip.loadAsync(decodedContent)
          const geojsonContent = await zip.files[`${value}.geojson`].async('text');
          const geojson = JSON.parse(geojsonContent);
          setDistrictBoundary(geojson)
          setGeoJSON()
        })
        .catch(error => {
          setLoading({...loading, map: false})
          console.error('Error fetching data:', error);
        });

    }
  };

  const handleCategoryChange = (e, { value }) => {
    ReactGA.event({
      category: 'Category Selection',
      action: 'Click',
      label: value, // optional
    });
    setLoading({...loading, subcategories: true})
    setSelectedCategory(value);
    setSelectedSubCategory('')
    setSelectedDataType('')
    const subCatUrl = `https://raw.githubusercontent.com/osmnepaldata/osm-nepal-ogl-data-metadata/main/categorized_infrastructure/${value}.json`
    if (value) {
      axios.get(subCatUrl)
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
    ReactGA.event({
      category: 'Subcategory Selection',
      action: 'Click',
      label: value, // optional
    });
    setSelectedSubCategory(value);
    setSelectedDataType('')
    if (value) {
      setDataTypes(Object.keys(subcategories[value]));
    } else {
      setDataTypes([]);
    }
  };

  const handleDataTypeChange = (e, { value }) => {
    ReactGA.event({
      category: 'Resource Selection',
      action: 'Click',
      label: value, // optional
    });
    setSelectedDataType(value);
  };

  const onSubmit = () => {
    ReactGA.event({
      category: 'Generate Map',
      action: 'Click',
    });
    setLoading({...loading, geojson: true})
    const filePath = `${selectedDistrict}__${selectedCategory}__${selectedSubCategory}__${selectedDataType}`;
    const repos = Object.keys(git_gj_map)
    const repo_id = repos.map(i=>(git_gj_map[i].map(j=>(j.split('.zip')[0]===filePath)).indexOf(true))).findIndex((element) => element > -1);
    const repo_name = repos[repo_id]
    const repoUrl = `https://api.github.com/repos/osmnepaldata/${repo_name}/contents/${filePath}.zip?ref=main`

    if (selectedDataType) {
      axios.get(repoUrl)
        .then(async response => {
          setLoading({...loading, geojson: false})
          const encodedContent = response.data.content;
          if (response.data.content.length === 0) {
            toast.info("Data size is large to render! Download instead.")
            setDataSizeIsLarge(response.data.download_url)
          } else {
            setDataSizeIsLarge()
          }
          const decodedContent = atob(encodedContent);
          const zip = new JSZip();
          await zip.loadAsync(decodedContent)
          const geojsonContent = await zip.files[`${filePath}.geojson`].async('text');
          const geojson = JSON.parse(geojsonContent);
          setGeoJSON(geojson)
          if (geojson.features.length === 0) {
            toast.info("Empty Dataset!")
          }
        })
        .catch(error => {
          setLoading({...loading, geojson: false})
          console.error('Error fetching data:', error);
        });
    }
  }
  return (
    <div>
    <ToastContainer />
    <>NEPAL 🇳🇵 | Last Update: Oct 1, 2023<a style={{float: 'right', textDecoration: 'underline'}} href="https://gautamarjun.com.np/contact">CONTACT</a></>
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
        options={Object.keys(subcategories).map((subcategory) => ({
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
      <Label>Resource / Infrastructure:</Label>
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
      GET MAP
    </Button>
  </div>
  );
}

export default Filter;
