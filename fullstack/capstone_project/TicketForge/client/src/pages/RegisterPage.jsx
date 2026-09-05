import React, { useState, useEffect } from 'react';
import { IconForge, IconArrowLeft } from '../assets/icons';
import { PasswordField } from '../components/PasswordField';

export function RegisterPage({ onRegisterSuccess, onNavigateLogin, onNavigateBack }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [department, setDepartment] = useState('Engineering');

    const [fieldErrors, setFieldErrors] = useState({});
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setError('');
        setSuccessMessage('');
        setFieldErrors({});
    }, [onNavigateLogin, onNavigateBack]);

    useEffect(() => {
        if (!successMessage) return;

        const timer = window.setTimeout(() => {
            setSuccessMessage('');
            onNavigateLogin();
        }, 2500);

        return () => window.clearTimeout(timer);
    }, [successMessage, onNavigateLogin]);

    useEffect(() => {
        if (!error) return;
        const timer = window.setTimeout(() => setError(''), 4000);
        return () => window.clearTimeout(timer);
    }, [error]);

    const validateForm = () => {
        const errors = {};
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();

        if (!trimmedName) {
            errors.name = 'Full Name is required.';
        } else if (trimmedName.length < 3) {
            errors.name = 'Name must be at least 3 characters long.';
        } else if (!/^[a-zA-Z\s]+$/.test(trimmedName)) {
            errors.name = 'Name must contain letters and spaces only.';
        }

        if (!trimmedEmail) {
            errors.email = 'Company Email is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            errors.email = 'Please enter a valid company email address.';
        }

        if (!password) {
            errors.password = 'Password is required.';
        } else if (password.length < 8) {
            errors.password = 'Password must be at least 8 characters long.';
        } else if (!/[A-Z]/.test(password)) {
            errors.password = 'Password must contain at least one uppercase letter.';
        } else if (!/[a-z]/.test(password)) {
            errors.password = 'Password must contain at least one lowercase letter.';
        } else if (!/[0-9]/.test(password)) {
            errors.password = 'Password must contain at least one number.';
        } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            errors.password = 'Password must contain at least one special character.';
        }

        if (confirmPassword !== password) {
            errors.confirmPassword = 'Passwords do not match.';
        }

        if (!department) {
            errors.department = 'Please select a department.';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.trim(), email: email.trim(), password, department })
            });

            const data = await res.json();
            if (data.success) {
                setSuccessMessage('Registration successful. Please sign in using your new account.');
                onRegisterSuccess();
            } else {
                setError(data.message || 'Registration failed.');
            }
        } catch (err) {
            setError('Could not connect to backend server.');
        } finally {
            setLoading(false);
        }
    };

    const clearMessages = () => {
        setError('');
        setSuccessMessage('');
        setFieldErrors({});
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
        if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: '' }));
        if (error) setError('');
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
        if (error) setError('');
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
        if (fieldErrors.confirmPassword && e.target.value === confirmPassword) {
            setFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
        }
        if (error) setError('');
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        if (fieldErrors.confirmPassword) setFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
        if (error) setError('');
    };

    const handleDepartmentChange = (e) => {
        setDepartment(e.target.value);
        if (fieldErrors.department) setFieldErrors(prev => ({ ...prev, department: '' }));
        if (error) setError('');
    };

    return (
        <main className="auth-container">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <section className="auth-card" aria-labelledby="register-title">
                            {onNavigateBack && (
                                <button
                                    type="button"
                                    className="auth-back-btn"
                                    onClick={() => { clearMessages(); onNavigateBack(); }}
                                    aria-label="Back to welcome screen"
                                    title="Back to welcome screen"
                                >
                                    <IconArrowLeft size={16} />
                                </button>
                            )}

                            <div className="auth-header">
                                <div className="auth-logo">
                                    <IconForge size={32} /> TicketForge
                                </div>
                                <h1 id="register-title" className="auth-title">Employee Account Registration</h1>
                            </div>

                            {successMessage && <div className="alert alert-success">{successMessage}</div>}
                            {error && <div className="alert alert-error">{error}</div>}

                            <form onSubmit={handleSubmit} noValidate>
                                <div className="form-group">
                                    <label htmlFor="reg-name">Full Name *</label>
                                    <input
                                        id="reg-name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        className={`form-input ${fieldErrors.name ? 'input-error' : ''}`}
                                        placeholder="e.g. Alex Morgan"
                                        value={name}
                                        onChange={handleNameChange}
                                        required
                                    />
                                    {fieldErrors.name && (
                                        <span style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: '0.25rem', display: 'block' }}>
                                            {fieldErrors.name}
                                        </span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="reg-email">Company Email Address *</label>
                                    <input
                                        id="reg-email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        className={`form-input ${fieldErrors.email ? 'input-error' : ''}`}
                                        placeholder="alex@levitateit.com"
                                        value={email}
                                        onChange={handleEmailChange}
                                        required
                                    />
                                    {fieldErrors.email && (
                                        <span style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: '0.25rem', display: 'block' }}>
                                            {fieldErrors.email}
                                        </span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="reg-dept">Department *</label>
                                    <select
                                        id="reg-dept"
                                        name="department"
                                        className="form-select"
                                        value={department}
                                        onChange={handleDepartmentChange}
                                        required
                                    >
                                        <option value="Engineering">Engineering</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Human Resources">Human Resources</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Operations">Operations</option>
                                        <option value="Sales">Sales</option>
                                        <option value="General">General</option>
                                    </select>
                                </div>

                                <PasswordField
                                    id="register-password"
                                    name="password"
                                    label="Password *"
                                    placeholder="8+ chars (Upper, Lower, Number, Symbol)"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    required={true}
                                    autoComplete="new-password"
                                />
                                {fieldErrors.password && (
                                    <span style={{ color: 'var(--danger)', fontSize: '0.78rem', marginBottom: '0.75rem', display: 'block' }}>
                                        {fieldErrors.password}
                                    </span>
                                )}

                                <PasswordField
                                    id="register-confirm-password"
                                    name="confirmPassword"
                                    label="Confirm Password *"
                                    placeholder="Re-enter password"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    required={true}
                                    autoComplete="new-password"
                                />
                                {fieldErrors.confirmPassword && (
                                    <span style={{ color: 'var(--danger)', fontSize: '0.78rem', marginBottom: '0.75rem', display: 'block' }}>
                                        {fieldErrors.confirmPassword}
                                    </span>
                                )}

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ width: '100%', marginTop: '0.75rem' }}
                                    disabled={loading}
                                >
                                    {loading ? 'Creating Account...' : 'Register Employee Account'}
                                </button>
                            </form>

                            <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                Already registered?{' '}
                                <a href="#login" onClick={(e) => { e.preventDefault(); clearMessages(); onNavigateLogin(); }}>
                                    Sign In here
                                </a>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
