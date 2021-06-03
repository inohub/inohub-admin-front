import axios from "axios";

// eslint-disable-next-line no-unused-vars
const PROD = 'https://api.inohub.kz/api'
// eslint-disable-next-line no-unused-vars
const DEV = 'http://inohub-api.test/api';

let instance = axios.create({
    baseURL : PROD
});

instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem('user-token');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
})

export default instance;

