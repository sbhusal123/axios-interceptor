import axios from 'axios';

import Storage from './storage';

import AuthApi from './authApi';

import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';


const API_URL = "http://localhost:8000/api"

const api = axios.create({
    baseURL: API_URL
})

//interceptors: https://axios-http.com/docs/interceptors

api.interceptors.request.use((config) => {
    const accessToken = Storage.getAccessToken()
    if(accessToken){
        config.headers["Authorization"] = `Bearer ${accessToken}`
    }
    return config
}, error => Promise.reject(error))

// const isTokenExired = (token) => {
//     try {
//         const payload = jwtDecode(token)
//         const expiryTime = payload.exp
//         return dayjs.unix(expiryTime).diff(dayjs()) < 1
//     } catch(err){
//         return true
//     }
// }

// api.interceptors.request.use(async (config) => {
//     const accessToken = Storage.getAccessToken();
//     const refreshToken = Storage.getRefreshToken();

//     if(accessToken && refreshToken) {

//         let token = ""

//         try {
//             const accessTokenExpired = isTokenExired(accessToken);
//             const refreshTokenExpired = isTokenExired(refreshToken);

//             delete config.headers["Authorization"]
    
//             if (!refreshTokenExpired && accessTokenExpired) {
//                 const resp = await AuthApi.refreshToken(refreshToken);
//                 const newAccessToken = resp.data.access;
//                 Storage.updateAccessToken(newAccessToken);
//                 token = newAccessToken
//             } else if (!accessTokenExpired) {
//                 token = accessToken
//             }
//             config.headers["Authorization"] = `Bearer ${accessToken}`;
//         } catch (err) {
//             console.error("Token error:", err);
//             return config
//         }

//     }

    
//     return config;
// }, (error) => {
//     return Promise.reject(error);
// });

export default api;
