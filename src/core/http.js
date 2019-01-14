"use strict";

import axios from 'axios';

axios.interceptors.request.use(config => {
    const baseUrl = "http://abteilung6.com:5000";
    config.baseURL = baseUrl;
    return config;
});

export default axios;