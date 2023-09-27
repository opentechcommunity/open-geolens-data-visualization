// axiosConfig.js

import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000', // Set the base URL to your server's URL
});

export default instance;
