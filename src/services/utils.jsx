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