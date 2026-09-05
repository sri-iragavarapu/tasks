import React, { useEffect, useState } from 'react'
import { fetchLeaves, submitLeave, reviewLeave, listUsers } from '../api'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Button from '../components/Button'
import UsersAdmin from './UsersAdmin'
import DepartmentsAdmin from './DepartmentsAdmin'
import { useToast } from '../contexts/ToastContext'

export default function Dashboard({ token, user, onLogout }){
  const [leaves, setLeaves] = useState([])
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ start_date:'', end_date:'', type:'', reason:'' })
  const [error, setError] = useState(null)
  const [view, setView] = useState('overview') // overview | users | departments

  useEffect(()=>{
    load()
    if(user.role === 'admin') loadUsers()
  }, [])

  async function load(){
    try{
      const data = await fetchLeaves(token)
      setLeaves(data)
    }catch(err){ console.error(err); }
  }

  async function loadUsers(){
    try{
      const data = await listUsers(token)
      setUsers(data)
    }catch(err){ console.error(err); }
  }

  const toast = useToast()

  async function submit(e){
    e.preventDefault(); setError(null);
    // validation
    if (!form.start_date || !form.end_date) { const msg = 'Start and end dates are required'; setError(msg); toast.show(msg, { type: 'error' }); return }
    if (new Date(form.start_date) > new Date(form.end_date)){ const msg = 'Start date cannot be after end date'; setError(msg); toast.show(msg, { type: 'error' }); return }
    setError(null)
    try{
      await submitLeave(token, form)
      setForm({ start_date:'', end_date:'', type:'', reason:'' })
      toast.show('Leave submitted', { type: 'success' })
      load()
    }catch(err){ const msg = err && err.error ? err.error : 'Submit failed'; setError(msg); toast.show(msg, { type: 'error' }) }
  }

  async function review(id, action){
    try{ await reviewLeave(token, id, action); toast.show(`Leave ${action}d`, { type:'success' }); load(); } catch(err){ const msg = err && err.error ? err.error : 'Action failed'; toast.show(msg, { type: 'error' }); console.error(err) }
  }

  const stats = {
    pending: leaves.filter(l=>l.status === 'pending').length,
    approved: leaves.filter(l=>l.status === 'approved').length,
    rejected: leaves.filter(l=>l.status === 'rejected').length,
  }

  return (
    <div className="container">
      <header className="header">
        <div>
          <div className="brand">Employee Leave Management</div>
          <div style={{marginTop:6}} className="nav">
            <button className="btn ghost" onClick={()=>setView('overview')} style={{padding:'6px 10px'}}>Overview</button>
            {user.role === 'admin' && <button className="btn ghost" onClick={()=>setView('users')} style={{padding:'6px 10px'}}>Users</button>}
            {user.role === 'admin' && <button className="btn ghost" onClick={()=>setView('departments')} style={{padding:'6px 10px'}}>Departments</button>}
          </div>
        </div>
        <div className="nav">
          <div className="small">{user.name} ({user.role})</div>
          <Button className="ghost" onClick={onLogout}>Logout</Button>
        </div>
      </header>

      <div className="cards">
        <div className="stat card">
          <div style={{fontSize:12,color:'#6b7280'}}>Pending</div>
          <div style={{fontSize:22,fontWeight:700}}>{stats.pending}</div>
        </div>
        <div className="stat card">
          <div style={{fontSize:12,color:'#6b7280'}}>Approved</div>
          <div style={{fontSize:22,fontWeight:700}}>{stats.approved}</div>
        </div>
        <div className="stat card">
          <div style={{fontSize:12,color:'#6b7280'}}>Rejected</div>
          <div style={{fontSize:22,fontWeight:700}}>{stats.rejected}</div>
        </div>
      </div>

      <div className="grid">
        <div style={{flex:1}}>
          {view === 'overview' && (
            <>
              <Card>
                <h3>Apply for leave</h3>
                {error && <div style={{color:'crimson'}}>{error}</div>}
                <form onSubmit={submit} style={{display:'grid',gap:8}}>
                  <div>
                    <label className="small">Start</label>
                    <input className="input" type="date" value={form.start_date} onChange={e=>setForm({...form, start_date:e.target.value})} />
                  </div>
                  <div>
                    <label className="small">End</label>
                    <input className="input" type="date" value={form.end_date} onChange={e=>setForm({...form, end_date:e.target.value})} />
                  </div>
                  <div>
                    <label className="small">Type</label>
                    <input className="input" value={form.type} onChange={e=>setForm({...form, type:e.target.value})} />
                  </div>
                  <div>
                    <label className="small">Reason</label>
                    <textarea className="input" rows={3} value={form.reason} onChange={e=>setForm({...form, reason:e.target.value})} />
                  </div>
                  <div style={{display:'flex',gap:8}}>
                    <Button type="submit">Submit</Button>
                  </div>
                </form>
              </Card>

              <Card style={{marginTop:20}}>
                <h3 style={{marginTop:0}}>Leaves</h3>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Start</th>
                      <th>End</th>
                      <th>Type</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaves.map(l=> (
                      <tr key={l.id}>
                        <td>{l.employee_name || user.name}</td>
                        <td>{l.start_date}</td>
                        <td>{l.end_date}</td>
                        <td>{l.type}</td>
                        <td>{l.reason}</td>
                        <td><Badge status={l.status} /></td>
                        <td>
                          {user.role === 'admin' && l.status === 'pending' && (
                            <>
                              <Button onClick={()=>review(l.id, 'approve')}>Approve</Button>
                              <Button className="ghost" onClick={()=>review(l.id, 'reject')}>Reject</Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </>
          )}

          {view === 'users' && user.role === 'admin' && (
            <div>
              <UsersAdmin token={token} />
            </div>
          )}

          {view === 'departments' && user.role === 'admin' && (
            <div>
              <DepartmentsAdmin token={token} />
            </div>
          )}
        </div>

        <aside className="aside">
          <Card>
            <h4>Quick info</h4>
            <div>Role: {user.role}</div>
            {user.role === 'admin' && (
              <>
                <h4 style={{marginTop:12}}>Users</h4>
                <ul>
                  {users.map(u=> <li key={u.id}>{u.name} — {u.role}</li>)}
                </ul>
              </>
            )}
          </Card>
        </aside>
      </div>

    </div>
  )
}
