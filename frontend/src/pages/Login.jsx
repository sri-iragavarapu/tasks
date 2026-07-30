import React, { useState } from 'react'
import { login } from '../api'

export default function Login({ onLogin }){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  async function submit(e){
    e.preventDefault(); setError(null);
    try{
      const data = await login(email, password)
      onLogin(data.token, data.user)
    }catch(err){
      setError(err.error || 'Login failed')
    }
  }

  return (
    <div style={{maxWidth:420, margin:'40px auto', padding:20, border:'1px solid #ddd', borderRadius:8}}>
      <h2>Sign in</h2>
      {error && <div style={{color:'crimson'}}>{error}</div>}
      <form onSubmit={submit}>
        <div style={{marginBottom:10}}>
          <label>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%'}} />
        </div>
        <div style={{marginBottom:10}}>
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%'}} />
        </div>
        <button type="submit">Sign in</button>
      </form>
      <div style={{marginTop:12, fontSize:13, color:'#666'}}>
        Use seeded admin: admin@example.com / Password123!
      </div>
    </div>
  )
}
