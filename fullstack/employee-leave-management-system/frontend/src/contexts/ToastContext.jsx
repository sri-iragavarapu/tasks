import React, { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext()

export function useToast(){
  return useContext(ToastContext)
}

export default function ToastProvider({ children }){
  const [toasts, setToasts] = useState([])

  const show = useCallback((message, { type='info', duration=3500 } = {}) => {
    const id = Math.random().toString(36).slice(2,9)
    setToasts(t => [...t, { id, message, type }])
    setTimeout(()=> setToasts(t => t.filter(x => x.id !== id)), duration)
  }, [])

  const value = { show }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" aria-atomic="true" style={{position:'fixed', right:20, bottom:20, zIndex:9999}}>
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`} role="status" style={{marginBottom:8, minWidth:220}}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
