import useIndex from "./hooks/useIndex"


function App() {
  const {password, setPassword, username, setUsername, handleLogin, loggedIn, verifyAccessToken, handleLogout} = useIndex()

  return (
    <>
      <div className="p-10 bg-gray-900 text-white">
        <h1 className="text-center font-bold text-2xl mb-4">React Axios Interceptor</h1>

        <div className="flex flex-col space-y-4 w-1/4">
          <div className="flex flex-row space-x-4">
            <p>Username</p>
            <input 
              type="text" 
              placeholder="janedoe123" 
              className="text-black rounded-sm px-1"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
          </div>
          <div className="flex flex-row space-x-5">
            <p>Password</p>
            <input 
              type="password" 
              className="text-black rounded-sm px-1" 
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <div className="flex flex-row space-x-6">
            <button 
              onClick={handleLogin}
              className={`bg-pink-500 px-4 py-2 rounded-lg disabled:bg-slate-500`}
              disabled={loggedIn ? true : false}
            >
              {loggedIn ? 'Logged In' : 'Login'}
            </button>
            {loggedIn ? (
              <button
                onClick={handleLogout}
                className={`bg-pink-500 px-4 py-2 rounded-lg disabled:bg-slate-500`}
              >
                Logout
              </button>
            ) : null}
          </div>
        </div>
      </div>
      
      {loggedIn ? (
        <div className="p-10 bg-green-900 text-white mb-10">
          <div className="flex flex-row space-x-6">
                <button 
                  onClick={verifyAccessToken}
                  className={`bg-pink-500 px-4 py-2 rounded-lg disabled:bg-slate-500`}
                >
                  Verify Token
                </button>
          </div>
        </div>
      ) : null}
    </>

  )
}

export default App
