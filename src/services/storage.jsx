const ACCESS_TOKEN = "@accessToken"
const REFRESH_TOKEN = "@refreshToken"

export default Storage  = {
    setTokens: ({accessToken, refreshToken}) => {
        localStorage.setItem(ACCESS_TOKEN, accessToken)
        localStorage.setItem(REFRESH_TOKEN, refreshToken)
    },

    updateAccessToken: ({accessToken}) => {
        localStorage.setItem(ACCESS_TOKEN, accessToken)
    },

    getAccessToken: () => {
        return localStorage.getItem(ACCESS_TOKEN)
    },

    getRefreshToken: () => {
        return localStorage.getItem(REFRESH_TOKEN)
    },

    removeTokens: () => {
        localStorage.removeItem(ACCESS_TOKEN)
        localStorage.removeItem(REFRESH_TOKEN)
    },

    getAllTokens: () => {
        return {
            accessToken: Storage.getAccessToken(),
            refreshToken: Storage.getRefreshToken()
        }
    }
}
