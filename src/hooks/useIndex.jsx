import { useEffect, useState } from "react";

import AuthApi from "../services/authApi";
import ChatApi from "../services/chatApi";

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
        Storage.setTokens({
          accessToken: data.access,
          refreshToken: data.refresh
        })
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
        ChatApi.sendMessage().then((resp) => {
          console.log("Message sent::", resp.data)
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