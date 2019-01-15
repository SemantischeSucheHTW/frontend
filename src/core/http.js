"use strict";

import axios from 'axios';

axios.interceptors.request.use(config => {
//    const baseUrl = process.env.VUE_APP_BASE_URL;
//    config.baseURL = baseUrl;
    return config;
});

export default axios;