import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://geolens.corpolatech.com',
});

export default instance;
