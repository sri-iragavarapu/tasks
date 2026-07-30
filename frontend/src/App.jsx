import React, { useState, useEffect } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App(){
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'))

  useEffect(()=>{
    if(token){
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }, [token])

  return token && user ? (
    <Dashboard token={token} user={user} onLogout={()=>{setToken(null); setUser(null)}} />
  ) : (
    <Login onLogin={(tok, u)=>{ setToken(tok); setUser(u); localStorage.setItem('user', JSON.stringify(u)) }} />
  )
}

export default App
