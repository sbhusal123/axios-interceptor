import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';

export const isTokenExired = ({token, expiryKey}) => {
    try {
        const payload = jwtDecode(token)
        const expiryTime = payload[`${expiryKey}`]
        return dayjs.unix(expiryTime).diff(dayjs()) < 1
    } catch(err){
        return true
    }
}

export const handleTokenRequest = async ({
    axiosConfig,
    tokenStorage,
    getNewToken,
    onTokenSuccess,
    onTokenFailure,
}) => {
    const { refreshToken } = tokenStorage.getAllTokens()
    try {
        const token = await getNewToken({refreshToken})
        tokenStorage.updateAccessToken({
            accessToken: token
        })
        onTokenSuccess({
            axiosConfig: axiosConfig,
            accessToken: token
        })
        return token
    } catch(ex){
        onTokenFailure({tokenStorage: tokenStorage, axiosConfig: axiosConfig})
        throw ex
    }
}

export const requestInterceptor = ({
    axiosInstance,
    getNewToken,
    onTokenFailure,
    onTokenSuccess,
    tokenStorage,
    expiryKey="exp",
    authHeaderName="Authorization",
    tokenPrefix="Bearer",
}) => {
    axiosInstance.interceptors.request.use(async (axiosConfig) => {
        const {accessToken, refreshToken} = tokenStorage.getAllTokens()
    
        if(accessToken && refreshToken) {
            let newToken = accessToken
            try {
                const accessTokenExpired = isTokenExired({
                    token: accessToken,
                    expiryKey
                });
                if (accessTokenExpired) {
                    newToken = await handleTokenRequest({
                        axiosConfig,
                        getNewToken,
                        onTokenFailure,
                        onTokenSuccess,
                        tokenStorage
                    });
                }
                axiosConfig.headers[`${authHeaderName}`] = `${tokenPrefix} ${newToken}`
            } catch (err) {
                return config
            }
        }
        
        return axiosConfig;
    }, (error) => {
        return Promise.reject(error);
    });
}