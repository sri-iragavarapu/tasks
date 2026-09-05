import React, { useEffect, useState } from 'react'
import { API_BASE } from '../api'
import Button from '../components/Button'
import { useToast } from '../contexts/ToastContext'

export default function DepartmentsAdmin({ token }){
  const [departments, setDepartments] = useState([])
  const [name, setName] = useState('')
  const [error, setError] = useState(null)
  const toast = useToast()

  useEffect(()=>{ load() }, [])

  async function load(){
    try{
      const res = await fetch(API_BASE + '/users/departments', { headers: { Authorization: 'Bearer ' + token } })
      const data = await res.json(); if(!res.ok) throw data
      setDepartments(data)
    }catch(err){ console.error(err); toast.show('Could not load departments', { type:'error' }) }
  }

  async function create(e){
    e.preventDefault(); setError(null)
    if (!name) { const msg='Department name required'; setError(msg); toast.show(msg,{type:'error'}); return }
    try{
      const res = await fetch(API_BASE + '/users/departments', { method:'POST', headers:{'Content-Type':'application/json', Authorization: 'Bearer ' + token}, body: JSON.stringify({ name }) })
      const data = await res.json(); if(!res.ok) throw data
      setName('')
      toast.show('Department created', { type: 'success' })
      load()
    }catch(err){ const msg = err && err.error ? err.error : 'Could not create'; setError(msg); toast.show(msg,{type:'error'}) }
  }

  return (
    <div>
      <h3>Departments</h3>
      <form onSubmit={create} style={{display:'flex',gap:8,marginBottom:12}} aria-label="Create department">
        <input className="input" aria-label="Department name" placeholder="Department name" value={name} onChange={e=>setName(e.target.value)} />
        <Button type="submit">Create</Button>
      </form>
      {error && <div role="alert" style={{color:'crimson'}}>{error}</div>}
      <ul>
        {departments.map(d=> <li key={d.id}>{d.name}</li>)}
      </ul>
    </div>
  )
}
