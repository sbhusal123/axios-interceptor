# Axios Interceptor for Refreshing Tokens with DRF Simple JWT

Basically, the concept is to:
- Check the expiry of tokens in the request interceptor.
- Tokens stored in localstorage.


## Utils Class
```js
import axios from 'axios';

import Storage from './storage';

import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';

const API_URL = "http://localhost:8000/api"

export const getAllTokens = () => {
    return {
        accessToken: Storage.getAccessToken(),
        refreshToken: Storage.getRefreshToken()
    }
}

export const isTokenExired = (token) => {
    try {
        const payload = jwtDecode(token)
        const expiryTime = payload.exp
        return dayjs.unix(expiryTime).diff(dayjs()) < 1
    } catch(err){
        return true
    }
}

export const handleGetNewAccessToken = async ({refreshToken, axiosConfig}) => {
    console.log("Getting and updating new access token:::")
    try {
        const resp = await axios.post(`${API_URL}/token/refresh/`, {
            "refresh": refreshToken
        })
        const token = resp.data.access
        Storage.updateAccessToken({
            accessToken: token
        })

        if(axiosConfig.url == "/token/verify/" && token){
            axiosConfig.data = {
                "token": token
            }
        } else {
            axiosConfig.headers["Authorization"] = `Bearer ${token}`;
        }

        return token
    } catch(ex){
        Storage.removeTokens()
        throw ex
    }
}
```

## Interceptor

```js
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

```