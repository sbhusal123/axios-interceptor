# Axios Interceptor for Refreshing Tokens with DRF Simple JWT

## 1. How does this works ??

Basically, the concept is to:
- Check the expiry of tokens in the request interceptor.
- If the token is expired, fetch the new token using a refresh token.
- Tokens are stored in localstorage.

## 2. Usage:

### 2.1 Define Storage Class:

This storage class will be used to retrive, update and remove the tokens in. Class would look something like below.

```js
class Storage {
    /**
     * Note that Storage class should have following methods defined:
     * getAllTokens
     * removeTokens
     * updateAccessToken
     * setTokens
    */

    static setTokens({accessToken, refreshToken}){
        localStorage.setItem("ACCESS_TOKEN", accessToken)
        localStorage.setItem("REFRESH_TOKEN", refreshToken)
    }

    static updateAccessToken({accessToken}){
        localStorage.setItem("ACCESS_TOKEN", accessToken)
    }

    static removeTokens(){
        localStorage.removeItem("ACCESS_TOKEN")
        localStorage.removeItem("REFRESH_TOKEN")
    }

    static getAllTokens(){
        return {
            accessToken: localStorage.getItem("ACCESS_TOKEN"),
            refreshToken: localStorage.getItem("REFRESH_TOKEN")
        }
    }
}
```

## 2.2. Usage with Axios:

``requestInterceptor`` accepts following params:

- ``axiosInstance`` : actual axios instance.

- ``tokenStorage`` : token storage class.

- ``onTokenFailure`` : called when new token request fails. ``tokenStorage`` as a callback params.

- ``onTokenSuccess`` : called when new token request succeds. ``axiosConfig, accessToken`` as a callback params.

- ``getNewToken`` : axios api call to handle refreshing of token. It must return the string.

```js
import axios from 'axios';

import {requestInterceptor} from './utils'

const API_URL = "https://foo.com/api"

const api = axios.create({
    baseURL: API_URL
})

requestInterceptor({
    axiosInstance: api,
    tokenStorage: Storage,
    getNewToken: async ({refreshToken}) => {
        const resp = await axios.post(`${API_URL}/token/refresh/`, {
            "refresh": refreshToken
        })
        const token = resp.data.access
        return token
    },
    onTokenFailure: ({tokenStorage}) => {
        tokenStorage.removeTokens()
        window.location.reload()
    },
    onTokenSuccess: ({axiosConfig, accessToken}) => {
        console.log("Token successfully updated")
    
        if(axiosConfig.url == "/token/verify/" && accessToken){
            axiosConfig.data = {
                "token": accessToken
            }
        } else {
            axiosConfig.headers["Authorization"] = `Bearer ${accessToken}`;
        }
    }
})


export default api;
```

## Implementation Details:

- [Utils](./src/services/utils.jsx)
