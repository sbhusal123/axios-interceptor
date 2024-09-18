const ACCESS_TOKEN = "@accessToken"
const REFRESH_TOKEN = "@refreshToken"

export default class Storage {
    static setTokens(resp){
        localStorage.setItem(ACCESS_TOKEN, resp.access)
        localStorage.setItem(REFRESH_TOKEN, resp.refresh)
    }

    static updateAccessToken(resp){
        localStorage.setItem(ACCESS_TOKEN, resp.access)
    }

    static getAccessToken(){
        return localStorage.getItem(ACCESS_TOKEN)
    }

    static getRefreshToken(){
        return localStorage.getItem(REFRESH_TOKEN)
    }

    static removeTokens(){
        localStorage.removeItem(ACCESS_TOKEN)
        localStorage.removeItem(REFRESH_TOKEN)
    }
}
