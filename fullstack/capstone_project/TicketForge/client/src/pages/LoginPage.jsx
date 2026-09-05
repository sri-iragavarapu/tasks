import React, { useState, useEffect } from 'react';
import { IconForge, IconArrowLeft } from '../assets/icons';
import { PasswordField } from '../components/PasswordField';

export function LoginPage({ onLoginSuccess, onNavigateRegister, onNavigateBack, portal = 'employee', successMessage = '' }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [loading, setLoading] = useState(false);
    const [visibleSuccessMessage, setVisibleSuccessMessage] = useState(successMessage);
    const [liveDemoCreds, setLiveDemoCreds] = useState({
        admin: { email: 'admin@levitateit.com', password: 'Admin@2026' },
        support: { email: 'support@levitateit.com', password: 'admin123' },
        employee: { email: 'john@levitateit.com', password: 'password123' }
    });

    useEffect(() => {
        fetch('/api/auth/demo-credentials', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.credentials) {
                    setLiveDemoCreds(data.credentials);
                }
            })
            .catch(err => console.error('Error fetching live demo credentials:', err));
    }, []);

    useEffect(() => {
        setError('');
        setEmailError('');
    }, [portal]);

    useEffect(() => {
        setVisibleSuccessMessage(successMessage);
    }, [successMessage]);

    useEffect(() => {
        if (!visibleSuccessMessage) return;

        const timer = window.setTimeout(() => {
            setVisibleSuccessMessage('');
        }, 4000);

        return () => window.clearTimeout(timer);
    }, [visibleSuccessMessage]);

    useEffect(() => {
        if (!error) return;

        const timer = window.setTimeout(() => {
            setError('');
        }, 4000);

        return () => window.clearTimeout(timer);
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setEmailError('');

        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            setEmailError('Email address is required.');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            setEmailError('Please enter a valid email address.');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: trimmedEmail, password })
            });

            const data = await res.json();
            if (data.success) {
                onLoginSuccess(data.user);
            } else {
                setError(data.message || 'Invalid email or password');
            }
        } catch (err) {
            setError('Could not connect to backend server. Make sure server is running.');
        } finally {
            setLoading(false);
        }
    };

    const fillDemoUser = (userEmail, userPass) => {
        setEmail(userEmail);
        setPassword(userPass);
        setError('');
        setEmailError('');
        setVisibleSuccessMessage('');
    };

    const handleNavigateRegister = () => {
        setError('');
        setEmailError('');
        setVisibleSuccessMessage('');
        onNavigateRegister();
    };

    const handleNavigateBack = () => {
        setError('');
        setEmailError('');
        setVisibleSuccessMessage('');
        onNavigateBack();
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (emailError) setEmailError('');
        if (error) setError('');
        if (visibleSuccessMessage) setVisibleSuccessMessage('');
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (error) setError('');
        if (visibleSuccessMessage) setVisibleSuccessMessage('');
    };

    const isITSupport = portal === 'it-support';
    const isAdmin = portal === 'admin';

    let pageTitle = 'Employee Sign In';
    let subtitle = 'Internal IT Service Management Platform';
    let primaryButtonLabel = 'Sign In to Portal';

    if (isITSupport) {
        pageTitle = 'IT Support Sign In';
        subtitle = 'Use your IT Support credentials to access the support console.';
        primaryButtonLabel = 'Sign In to Support Portal';
    } else if (isAdmin) {
        pageTitle = 'Administrator Sign In';
        subtitle = 'Access Levitate IT Administration and user account management console.';
        primaryButtonLabel = 'Sign In to Admin Portal';
    }

    return (
        <main className="auth-container">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <section className="auth-card" aria-labelledby="login-title">
                            {onNavigateBack && (
                                <button
                                    type="button"
                                    className="auth-back-btn"
                                    onClick={handleNavigateBack}
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
                                <h1 id="login-title" className="auth-title">{pageTitle}</h1>
                                <div className="auth-subtitle">{subtitle}</div>
                            </div>

                            {visibleSuccessMessage && <div className="alert alert-success">{visibleSuccessMessage}</div>}
                            {error && <div className="alert alert-error">{error}</div>}

                            <form onSubmit={handleSubmit} noValidate>
                                <div className="form-group">
                                    <label htmlFor="login-email">Company Email Address</label>
                                    <input
                                        id="login-email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        className={`form-input ${emailError ? 'input-error' : ''}`}
                                        placeholder="username@levitateit.com"
                                        value={email}
                                        onChange={handleEmailChange}
                                        required
                                    />
                                    {emailError && (
                                        <span style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: '0.25rem', display: 'block' }}>
                                            {emailError}
                                        </span>
                                    )}
                                </div>

                                <PasswordField
                                    id="login-password"
                                    name="password"
                                    label="Password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    required={true}
                                    autoComplete="current-password"
                                />

                                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
                                    {loading ? 'Authenticating...' : primaryButtonLabel}
                                </button>
                            </form>

                            {!isITSupport && !isAdmin && onNavigateRegister && (
                                <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    Don't have an account?{' '}
                                    <a href="#register" onClick={(e) => { e.preventDefault(); handleNavigateRegister(); }}>
                                        Register as Employee
                                    </a>
                                </div>
                            )}

                            <div className="demo-credentials">
                                <h4>Demo Account</h4>
                                <div>
                                    {isAdmin ? (
                                        <button className="demo-btn" type="button" onClick={() => fillDemoUser(liveDemoCreds.admin.email, liveDemoCreds.admin.password)}>
                                            Administrator ({liveDemoCreds.admin.email})
                                        </button>
                                    ) : isITSupport ? (
                                        <button className="demo-btn" type="button" onClick={() => fillDemoUser(liveDemoCreds.support.email, liveDemoCreds.support.password)}>
                                            IT Support (Sarah)
                                        </button>
                                    ) : (
                                        <button className="demo-btn" type="button" onClick={() => fillDemoUser(liveDemoCreds.employee.email, liveDemoCreds.employee.password)}>
                                            Employee (John Doe)
                                        </button>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
