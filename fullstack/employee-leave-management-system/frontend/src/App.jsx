import React, { useState, useEffect } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ToastProvider from './contexts/ToastContext'

class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state = {error:null, info:null} }
  componentDidCatch(error, info){
    console.error('ErrorBoundary caught', error, info)
    this.setState({ error, info })
  }
  render(){
    if (this.state.error) {
      return (
        <div style={{padding:20}}>
          <h2>Something went wrong</h2>
          <pre style={{whiteSpace:'pre-wrap',background:'#fff',padding:12,borderRadius:8}}>{String(this.state.error)}\n{this.state.info && this.state.info.componentStack}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

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

  return (
    <ToastProvider>
      <ErrorBoundary>
        {token && user ? (
          <Dashboard token={token} user={user} onLogout={()=>{setToken(null); setUser(null)}} />
        ) : (
          <Login onLogin={(tok, u)=>{ setToken(tok); setUser(u); localStorage.setItem('user', JSON.stringify(u)) }} />
        )}
      </ErrorBoundary>
    </ToastProvider>
  )
}

export default App
