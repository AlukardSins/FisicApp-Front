//Base imports
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'
import LocalStorageService from './services/local-storage';

//Pages Import
import Front from './pages/front-page';

axios.interceptors.request.use(function (config) {
    config.headers.Authorization =  LocalStorageService.getValue('token');
    return config;
});

ReactDOM.render(<Front />, document.getElementById('root'));