import { useEffect, useState } from "react";
import AuthApi from "../services/authApi";
import Storage from "../services/storage";

export default function useIndex() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
  
    const [loggedIn, setLoggedIn] = useState(false)
  
    useEffect(() => {
      const accessToken = Storage.getAccessToken()
      if(accessToken){
        AuthApi.verifyAccessToken(accessToken).then((resp) => {
            setLoggedIn(true)
          }).catch(err => {
            console.log("Error verifying token",err)
        })
      }
    }, [])
  
    const handleLogin = () => {
      AuthApi.login(username, password).then((resp) => {
        const data = resp.data
        Storage.setTokens(data)
        setLoggedIn(true)
        alert("Logged In.")
      }).catch(err => {
        console.log(err)
        alert("Invalid credentials..")
      }).finally(() => {
        console.log("finally")
        setUsername("")
        setPassword("")
      })
    }

    const handleLogout = () => {
        const refreshToken = Storage.getRefreshToken()
        AuthApi.handleLogout(refreshToken).then((_) => {
            setLoggedIn(false)
            Storage.removeTokens()
        }).catch(err => {
            console.log("Error logging out::", err)
        })

    }

    const handleTokenRefresh = () => {
        const refreshToken = Storage.getRefreshToken()
        AuthApi.refreshToken(refreshToken).then((resp) => {
            const data = resp.data
            Storage.updateAccessToken(data)
        }).catch(() => {
            console.log("Unable to refreshToken")
        })
    }

    return {
        username,
        setUsername,
        password,
        setPassword,
        handleLogin,
        loggedIn,
        handleTokenRefresh,
        handleLogout
    }
}