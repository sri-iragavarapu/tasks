import React, { useEffect, useState } from 'react'
import { fetchLeaves, submitLeave, reviewLeave, listUsers } from '../api'

export default function Dashboard({ token, user, onLogout }){
  const [leaves, setLeaves] = useState([])
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ start_date:'', end_date:'', type:'', reason:'' })
  const [error, setError] = useState(null)

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

  async function submit(e){
    e.preventDefault(); setError(null);
    try{
      await submitLeave(token, form)
      setForm({ start_date:'', end_date:'', type:'', reason:'' })
      load()
    }catch(err){ setError(err.error || 'Submit failed') }
  }

  async function review(id, action){
    try{ await reviewLeave(token, id, action); load(); } catch(err){ console.error(err) }
  }

  return (
    <div style={{maxWidth:1000, margin:'20px auto'}}>
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h1>Welcome, {user.name} ({user.role})</h1>
        <div>
          <button onClick={onLogout}>Logout</button>
        </div>
      </header>

      <section style={{display:'flex', gap:20}}>
        <div style={{flex:1}}>
          <h2>Apply for leave</h2>
          {error && <div style={{color:'crimson'}}>{error}</div>}
          <form onSubmit={submit}>
            <div>
              <label>Start</label>
              <input type="date" value={form.start_date} onChange={e=>setForm({...form, start_date:e.target.value})} />
            </div>
            <div>
              <label>End</label>
              <input type="date" value={form.end_date} onChange={e=>setForm({...form, end_date:e.target.value})} />
            </div>
            <div>
              <label>Type</label>
              <input value={form.type} onChange={e=>setForm({...form, type:e.target.value})} />
            </div>
            <div>
              <label>Reason</label>
              <textarea value={form.reason} onChange={e=>setForm({...form, reason:e.target.value})} />
            </div>
            <button type="submit">Submit</button>
          </form>

          <h2 style={{marginTop:30}}>My Leaves / All Leaves</h2>
          <table style={{width:'100%', borderCollapse:'collapse'}}>
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
                <tr key={l.id} style={{borderTop:'1px solid #eee'}}>
                  <td>{l.employee_name || user.name}</td>
                  <td>{l.start_date}</td>
                  <td>{l.end_date}</td>
                  <td>{l.type}</td>
                  <td>{l.reason}</td>
                  <td>{l.status}</td>
                  <td>
                    {user.role === 'admin' && l.status === 'pending' && (
                      <>
                        <button onClick={()=>review(l.id, 'approve')}>Approve</button>
                        <button onClick={()=>review(l.id, 'reject')}>Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <aside style={{width:320}}>
          <h3>Quick info</h3>
          <div>Role: {user.role}</div>
          {user.role === 'admin' && (
            <>
              <h4 style={{marginTop:12}}>Users</h4>
              <ul>
                {users.map(u=> <li key={u.id}>{u.name} — {u.role}</li>)}
              </ul>
            </>
          )}
        </aside>
      </section>

    </div>
  )
}
