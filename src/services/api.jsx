import axios from 'axios';

import {handleGetNewAccessToken, isTokenExired, getAllTokens} from './utils'

const API_URL = "http://localhost:8000/api"

const api = axios.create({
    baseURL: API_URL
})


api.interceptors.request.use(async (config) => {
    const {accessToken, refreshToken} = getAllTokens()

    if(accessToken && refreshToken) {
        try {
            const accessTokenExpired = isTokenExired(accessToken);
            if (accessTokenExpired) {
                await handleGetNewAccessToken({refreshToken: refreshToken, axiosConfig: config});
            } else {
                config.headers["Authorization"] = `Bearer ${accessToken}`
            }
        } catch (err) {
            window.location.reload()
            return config
        }
    }
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
