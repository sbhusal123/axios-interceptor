const ACCESS_TOKEN = "@accessToken"
const REFRESH_TOKEN = "@refreshToken"

export default class Storage {
    static setTokens({accessToken, refreshToken}){
        localStorage.setItem(ACCESS_TOKEN, accessToken)
        localStorage.setItem(REFRESH_TOKEN, refreshToken)
    }

    static updateAccessToken({accessToken}){
        localStorage.setItem(ACCESS_TOKEN, accessToken)
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

    static getAllTokens(){
        return {
            accessToken: Storage.getAccessToken(),
            refreshToken: Storage.getRefreshToken()
        }
    }
}
