import React, { useEffect, useState } from 'react'
import { listUsers, API_BASE } from '../api'
import Button from '../components/Button'
import { useToast } from '../contexts/ToastContext'

const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export default function UsersAdmin({ token }){
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'employee', department_id: '' })
  const [error, setError] = useState(null)
  const toast = useToast()

  useEffect(()=>{ load() }, [])

  async function load(){
    setLoading(true)
    try{ const data = await listUsers(token); setUsers(data) }catch(err){ console.error(err); toast.show('Could not load users', { type:'error' }) }
    setLoading(false)
  }

  async function create(e){
    e.preventDefault(); setError(null)
    if (!form.name || !form.email || !form.password) { const msg='Name, email and password are required'; setError(msg); toast.show(msg, {type:'error'}); return }
    if (!emailRe.test(form.email)){ const msg='Enter a valid email'; setError(msg); toast.show(msg,{type:'error'}); return }
    try{
      const res = await fetch(API_BASE + '/users', {
        method: 'POST', headers: { 'Content-Type':'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw data
      setForm({ name:'', email:'', password:'', role:'employee', department_id: '' })
      toast.show('User created', { type: 'success' })
      load()
    }catch(err){ const msg = err && err.error ? err.error : 'Could not create user'; setError(msg); toast.show(msg, { type: 'error' }) }
  }

  return (
    <div>
      <h3>Users</h3>
      <div style={{marginBottom:12}}>
        <form onSubmit={create} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}} aria-label="Create user form">
          <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} aria-label="Name" />
          <input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} aria-label="Email" />
          <input className="input" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} aria-label="Password" />
          <select className="input" value={form.role} onChange={e=>setForm({...form, role:e.target.value})} aria-label="Role">
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
          <div style={{gridColumn:'1 / -1', display:'flex', gap:8}}>
            <Button type="submit">Create user</Button>
            {error && <div role="alert" style={{color:'crimson'}}>{error}</div>}
          </div>
        </form>
      </div>

      <div>
        <h4>Existing</h4>
        {loading ? <div>Loading...</div> : (
          <table className="table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Dept</th></tr></thead>
            <tbody>
              {users.map(u=> (
                <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td><td>{u.department || ''}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
