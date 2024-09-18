import axios from 'axios';

import Storage from './storage';

import AuthApi from './authApi';


const API_URL = "http://localhost:8000/api"

const api = axios.create({
    baseURL: API_URL
})

//interceptors: https://axios-http.com/docs/interceptors

api.interceptors.request.use(config => {
    const token = Storage.getAccessToken()
    
    if(token){
        config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
}, error => {
    return Promise.reject(error)
})

// api.interceptors.response.use(response => {
//     return response
// }, error => {
//     const originalRequest = error.config;
//     const isInvalidToken = error?.response?.data?.code === "token_not_valid"
//     if(isInvalidToken ){
//         const refreshToken = Storage.getRefreshToken()
//         AuthApi.refreshToken(refreshToken).then((resp) => {
//             const data = resp.data
//             Storage.updateAccessToken(data)
//             return api
//         })
//     }

//     return Promise.reject(error)
// })

export default api;
