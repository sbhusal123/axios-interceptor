import api from "./api";

export default class AuthApi {
    static login(username, password) {
        return api.post("/token/", {
            username,
            password
        })
    }

    static verifyAccessToken(accessToken){
        return api.post("/token/verify/", {
            "token": accessToken
        })
    }


    static handleLogout(refreshToken){
        return api.post("/logout/", {
            "refresh": refreshToken
        })
    }
}