const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export async function api(path, { method = 'GET', token, body } = {}){
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export async function login(email, password){
  return api('/auth/login', { method: 'POST', body: { email, password } });
}

export async function fetchLeaves(token){
  return api('/leaves', { token });
}

export async function submitLeave(token, payload){
  return api('/leaves', { method: 'POST', token, body: payload });
}

export async function reviewLeave(token, id, action){
  return api(`/leaves/${id}/review`, { method: 'POST', token, body: { action } });
}

export async function listUsers(token){
  return api('/users', { token });
}
