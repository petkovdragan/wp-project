import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://127.0.0.1:5000/',
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
});

export default instance;