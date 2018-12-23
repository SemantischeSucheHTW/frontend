"use strict";

import axios from 'axios';

axios.interceptors.request.use(config => {
    const baseUrl = "http://localhost:8108";
    config.baseURL = baseUrl;
    return config;
});

export default axios;