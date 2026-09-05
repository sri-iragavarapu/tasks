import React, { useState } from 'react';

export function PasswordField({
    label,
    value,
    onChange,
    placeholder,
    required = false,
    minLength,
    autoComplete,
    id,
    name,
    disabled = false
}) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="form-group">
            <label htmlFor={id}>{label}</label>
            <div style={{ position: 'relative' }}>
                <input
                    id={id}
                    name={name}
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    minLength={minLength}
                    autoComplete={autoComplete}
                    disabled={disabled}
                    style={{ paddingRight: '3.25rem' }}
                />
                <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    title={showPassword ? 'Hide password' : 'Show password'}
                >
                    {showPassword ? (
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                            <path d="M10.6 10.6a2.5 2.5 0 103.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                            <path d="M9 6.2A10.2 10.2 0 0112 6c3.3 0 6.4 1.6 8.8 4.8a15 15 0 01-2.3 2.8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                            <path d="M5.8 8.8A15.2 15.2 0 002 10.8c2.8 4.4 6.3 6.7 10 6.7 1.1 0 2.1-.2 3.1-.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" fill="none" stroke="currentColor" strokeWidth="1.7" />
                            <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.7" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
}
