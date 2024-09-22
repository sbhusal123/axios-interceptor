# Axios Interceptor for Refreshing Tokens with DRF Simple JWT

## 1. How does this works ??

Basically, the concept is to:
- Check the expiry of tokens in the request interceptor.
- If the token is expired, fetch the new token using a refresh token. (Does this by checking `exp` key in token payload)
- Tokens are stored in localstorage or may be any storage of your choice, just define the static methods define below.

**Packages:**
```
    "axios": "^1.7.7",
    "dayjs": "^1.11.13",
    "jwt-decode": "^4.0.0",
```

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

- ``tokenStorage`` : token storage class. Method signature is as above.

- ``onTokenFailure`` : called when new token request fails. ``tokenStorage, axiosConfig`` in a callback params.

- ``onTokenSuccess`` : called when new token request succeds. ``axiosConfig, accessToken`` in a callback params.

- ``getNewToken`` : async function that handles getting of new token with `refreshToken`. Note that this mustn't be the call from ``axiosInstance`` to prevent the request looping.

- ``expiryKey`` expiry key in JWT token, you can check the decoded token right [here](https://jwt.io/). If unset it's default value is `exp`

- ``authHeaderName`` auth header key to pass accessToken, if unset default value is``Authorization``

- ``tokenPrefix`` token prefix string, if unset default value is ``Bearer``


```js
import axios from 'axios';

import {requestInterceptor} from './utils'

const API_URL = "https://foo.com/api"

const REFRESH_TOKEN_URL = `${API_URL}/token/refresh/`

const api = axios.create({
    baseURL: API_URL
})

requestInterceptor({
    axiosInstance: api,
    tokenStorage: Storage,
    expiryKey: "exp",
    authHeaderName: "Authorization",
    tokenPrefix: "Bearer",
    getNewToken: async ({refreshToken}) => {
        const resp = await axios.post(`${API_URL}/token/refresh/`, {
            "refresh": refreshToken
        })
        const token = resp.data.access
        return token
    },
    onTokenFailure: ({tokenStorage, axiosConfig}) => {
        tokenStorage.removeTokens()
        window.location.reload()
    },
    onTokenSuccess: ({axiosConfig, accessToken}) => {
        console.log("Token successfully updated")
    
        if(axiosConfig.url == "/token/verify/" && accessToken){
            axiosConfig.data = {
                "token": accessToken
            }
        }
    }
})


export default api;
```

## Implementation Details:

- [Utils](./src/services/utils.jsx)
