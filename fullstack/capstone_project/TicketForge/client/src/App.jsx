import React, { useState, useEffect } from 'react';
import './styles/global.css';
import './styles/components.css';
import './styles/pages.css';

import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { WelcomePage } from './pages/WelcomePage';
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { SupportDashboard } from './pages/SupportDashboard';
import { ProfilePage } from './pages/ProfilePage';
import { TicketDetailPage } from './pages/TicketDetailPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { ConfirmModal } from './components/ConfirmModal';

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard', 'profile', 'users', 'ticket-detail'
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [authMode, setAuthMode] = useState('welcome'); // 'welcome', 'employee-login', 'it-support-login', 'register'
    const [authMessage, setAuthMessage] = useState('');
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // Check active session on initial load
    useEffect(() => {
        fetch('/api/auth/me', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.user) {
                    setUser(data.user);
                }
            })
            .catch(err => console.error('Session check failed:', err))
            .finally(() => setLoading(false));
    }, []);

    const handleNavigate = (page, ticketId = null) => {
        setCurrentPage(page);
        setSelectedTicketId(ticketId);
    };

    // Fallback protection for page states
    useEffect(() => {
        if (currentPage === 'ticket-detail' && !selectedTicketId) {
            setCurrentPage('dashboard');
        }
        if (currentPage === 'users' && user && user.role !== 'Administrator') {
            setCurrentPage('dashboard');
        }
    }, [currentPage, selectedTicketId, user]);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        handleNavigate('dashboard');
        setAuthMode('welcome');
        setAuthMessage('');
    };

    const handleRegisterSuccess = () => {
        setUser(null);
        handleNavigate('dashboard');
        setAuthMode('employee-login');
        setAuthMessage('Registration successful. Please sign in using your new account.');
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setUser(null);
            handleNavigate('dashboard');
            setAuthMode('welcome');
        }
    };

    const handleSelectTicket = (id) => {
        handleNavigate('ticket-detail', id);
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-dark)',
                color: 'var(--text-muted)'
            }}>
                Checking TicketForge Authentication Session...
            </div>
        );
    }

    // Unauthenticated View
    if (!user) {
        if (authMode === 'register') {
            return (
                <RegisterPage
                    onRegisterSuccess={handleRegisterSuccess}
                    onNavigateLogin={() => {
                        setAuthMode('employee-login');
                        setAuthMessage('');
                    }}
                    onNavigateBack={() => {
                        setAuthMode('employee-login');
                        setAuthMessage('');
                    }}
                />
            );
        }

        if (authMode === 'welcome') {
            return (
                <WelcomePage
                    onSelectPortal={(portal) => {
                        if (portal === 'it-support') setAuthMode('it-support-login');
                        else if (portal === 'admin') setAuthMode('admin-login');
                        else setAuthMode('employee-login');
                        setAuthMessage('');
                    }}
                />
            );
        }

        let portalType = 'employee';
        if (authMode === 'it-support-login') portalType = 'it-support';
        if (authMode === 'admin-login') portalType = 'admin';

        return (
            <LoginPage
                portal={portalType}
                onLoginSuccess={handleLoginSuccess}
                onNavigateRegister={() => {
                    setAuthMode('register');
                    setAuthMessage('');
                }}
                onNavigateBack={() => {
                    setAuthMode('welcome');
                    setAuthMessage('');
                }}
                successMessage={authMessage}
            />
        );
    }

    // Authenticated View
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar
                user={user}
                onLogout={() => setShowLogoutModal(true)}
                currentPage={currentPage}
                setCurrentPage={(page) => {
                    setCurrentPage(page);
                    if (page !== 'ticket-detail') setSelectedTicketId(null);
                }}
            />

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {currentPage === 'ticket-detail' && selectedTicketId && (
                    <TicketDetailPage
                        ticketId={selectedTicketId}
                        currentUser={user}
                        onBack={() => {
                            setCurrentPage('dashboard');
                            setSelectedTicketId(null);
                        }}
                    />
                )}

                {currentPage === 'dashboard' && user.role === 'Employee' && (
                    <EmployeeDashboard
                        user={user}
                        onSelectTicket={handleSelectTicket}
                    />
                )}

                {currentPage === 'dashboard' && (user.role === 'IT_Support' || user.role === 'Administrator') && (
                    <SupportDashboard
                        user={user}
                        onSelectTicket={handleSelectTicket}
                    />
                )}

                {currentPage === 'profile' && user && (
                    <ProfilePage
                        user={user}
                        onUpdateUser={(updatedUser) => setUser({ ...user, ...updatedUser })}
                        onDeleteAccount={handleLogout}
                        onClose={() => {
                            setCurrentPage('dashboard');
                            setSelectedTicketId(null);
                        }}
                    />
                )}

                {currentPage === 'users' && user.role === 'Administrator' && (
                    <UserManagementPage currentUser={user} />
                )}
            </main>

            <footer style={{
                borderTop: '1px solid var(--border-color)',
                padding: '1.25rem 2rem',
                textAlign: 'center',
                color: 'var(--text-dim)',
                fontSize: '0.82rem',
                background: 'var(--bg-dark)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                alignItems: 'center'
            }}>
                <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>TicketForge</div>
                <div>© 2026</div>
                <div>Enterprise Internal IT Service Management Platform</div>
                <div>Developed for Levitate IT</div>
            </footer>

            <ConfirmModal
                isOpen={showLogoutModal}
                title="Confirm Logout"
                message="You will be signed out of your current TicketForge session. Continue?"
                confirmText="Logout"
                confirmVariant="primary"
                onClose={() => setShowLogoutModal(false)}
                onConfirm={async () => {
                    setShowLogoutModal(false);
                    await handleLogout();
                }}
            />
        </div>
    );
}
