import React, { useState } from 'react'
import { login } from '../api'
import IconEye from '../components/IconEye'
import Button from '../components/Button'
import { useToast } from '../contexts/ToastContext'

const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export default function Login({ onLogin }){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  async function submit(e){
    e.preventDefault(); setError(null);
    if (!email || !password){ setError('Email and password are required'); return }
    if (!emailRe.test(email)) { setError('Please enter a valid email'); return }
    setLoading(true)
    try{
      const data = await login(email, password)
      toast.show('Signed in', { type: 'success' })
      onLogin(data.token, data.user)
    }catch(err){
      const msg = err && err.error ? err.error : 'Login failed'
      setError(msg)
      toast.show(msg, { type: 'error' })
    } finally { setLoading(false) }
  }

  return (
    <main className="form" aria-labelledby="signin-title">
      <h2 id="signin-title">Sign in</h2>
      {error && <div role="alert" style={{color:'crimson', marginBottom:8}}>{error}</div>}
      <form onSubmit={submit}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" aria-label="Email" className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <div style={{display:'flex', alignItems:'center', gap:8}}>
            <input id="password" aria-label="Password" className="input" type={showPassword ? 'text' : 'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password" />
            <button type="button" onClick={()=>setShowPassword(s=>!s)} aria-pressed={showPassword} aria-label={showPassword ? 'Hide password' : 'Show password'} title={showPassword ? 'Hide password' : 'Show password'} className="btn ghost" style={{display:'inline-flex',alignItems:'center',gap:6}}>
              <IconEye open={showPassword} />
            </button>
          </div>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <Button type="submit" aria-disabled={loading} disabled={loading}>{loading ? 'Signing...' : 'Sign in'}</Button>
          <Button className="ghost" type="button" onClick={()=>{ setEmail('admin@example.com'); setPassword('Password123!'); toast.show('Seeded credentials filled', { type: 'info' }) }}>Use seeded admin</Button>
        </div>
      </form>
      <div className="footer-note">
        Tip: click "Use seeded admin" to autofill credentials for demo.
      </div>
    </main>
  )
}
