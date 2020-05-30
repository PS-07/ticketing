import axios from 'axios';

export default ({ req }) => {
    if (typeof window === 'undefined') {
        // We are on the server
        // the baseUrl is extracted from Ingress-Nginx's pod
        // req.headers is also passed since it contains cookies
        return axios.create({
            baseURL: 'http://172.17.0.4',
            headers: req.headers
        });
    }
    else {
        return axios.create({
            baseURL: '/'
        });
    }
};