import React from 'react'

export default function Badge({ status }){
  const cls = status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'pending'
  const text = status ? status.charAt(0).toUpperCase()+status.slice(1) : 'Unknown'
  return <span className={"badge " + cls}>{text}</span>
}
