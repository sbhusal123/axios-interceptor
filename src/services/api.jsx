import axios from 'axios';

import {requestInterceptor} from './utils'

const ACCESS_TOKEN = "@accessToken"
const REFRESH_TOKEN = "@refreshToken"

const API_URL = "http://localhost:8000/api"

const api = axios.create({
    baseURL: API_URL
})

class Storage {
    /**
     * Note that Storage class should have following methods defined:
     * getAllTokens
     * removeTokens
     * updateAccessToken
     * setTokens
    */

    static setTokens({accessToken, refreshToken}){
        localStorage.setItem(ACCESS_TOKEN, accessToken)
        localStorage.setItem(REFRESH_TOKEN, refreshToken)
    }

    static updateAccessToken({accessToken}){
        localStorage.setItem(ACCESS_TOKEN, accessToken)
    }

    static removeTokens(){
        localStorage.removeItem(ACCESS_TOKEN)
        localStorage.removeItem(REFRESH_TOKEN)
    }

    static getAllTokens(){
        return {
            accessToken: localStorage.getItem(ACCESS_TOKEN),
            refreshToken: localStorage.getItem(REFRESH_TOKEN)
        }
    }
}

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
