import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';

export const isTokenExired = (token) => {
    try {
        const payload = jwtDecode(token)
        const expiryTime = payload.exp
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
    onTokenFailure
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
        onTokenFailure({tokenStorage: tokenStorage})
        throw ex
    }
}

export const requestInterceptor = ({
    axiosInstance,
    getNewToken,
    onTokenFailure,
    onTokenSuccess,
    tokenStorage
}) => {
    axiosInstance.interceptors.request.use(async (axiosConfig) => {
        const {accessToken, refreshToken} = tokenStorage.getAllTokens()
    
        if(accessToken && refreshToken) {
            try {
                const accessTokenExpired = isTokenExired(accessToken);
                if (accessTokenExpired) {
                    await handleTokenRequest({
                        axiosConfig,
                        getNewToken,
                        onTokenFailure,
                        onTokenSuccess,
                        tokenStorage
                    });
                } else {
                    axiosConfig.headers["Authorization"] = `Bearer ${accessToken}`
                }
            } catch (err) {
                return config
            }
        }
        
        return axiosConfig;
    }, (error) => {
        return Promise.reject(error);
    });
}