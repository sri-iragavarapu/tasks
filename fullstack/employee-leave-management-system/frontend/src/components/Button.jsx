import React from 'react'

export default function Button({ children, className = '', onClick, type = 'button' }){
  return (
    <button type={type} onClick={onClick} className={"btn " + className}>{children}</button>
  )
}
