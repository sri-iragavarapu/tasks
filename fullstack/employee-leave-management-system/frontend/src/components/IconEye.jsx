import React from 'react'

export default function IconEye({ open = false, size = 18 }){
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      {open ? (
        <>
          <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" stroke="#111" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="3" stroke="#111" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </>
      ) : (
        <>
          <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-6 0-10-7-10-7a21.56 21.56 0 0 1 5.06-6.06" stroke="#111" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1 1l22 22" stroke="#111" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </>
      )}
    </svg>
  )
}
