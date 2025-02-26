import { useState, useEffect } from 'react'

const App = () => {
  const [inputUsername, setInputUsername] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const attemptToLogInWithToken = async() => {
      const localStorageToken = localStorage.getItem('token');

      if(localStorageToken) {
        const response = await fetch('/api/v1/login', {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            "Authorization": localStorageToken
          }
        });

        const x = await response.json();
        console.log(x);
      }
    }

    attemptToLogInWithToken();
  })

  const logIn = async(event) => {
    event.preventDefault();
    
    const response = await fetch('/api/v1/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: inputUsername,
        password: inputPassword
      })
    });

    const tokenObj = await response.json();
    setToken(tokenObj.token);
    localStorage.setItem("token", tokenObj.token);
  }

  const logOut = () => {
    localStorage.removeItem('token');
    setToken('');
  }

  return (
    <>
      <h1>Review App</h1>
      {
        token ?
          <>
            <h1>Welcome to Review App</h1>
            <button onClick={ logOut }>Log Out</button>
          </> :
          <form onSubmit={logIn} >
            <input 
              placeholder="username"
              onChange={(event) => { setInputUsername(event.target.value) }}
            />
            <input 
              placeholder="password"
              onChange={(event) => { setInputPassword(event.target.value) }}
              type="password"
            />
    
            <button>Log In</button>
          </form>
      }

    </>
  )
}

export default App
