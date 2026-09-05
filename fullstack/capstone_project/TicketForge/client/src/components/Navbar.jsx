import React, { useState, useEffect, useRef } from 'react';
import { IconForge, IconLogout, IconUser, IconTicket } from '../assets/icons';

export function Navbar({ user, onLogout, currentPage, setCurrentPage }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 900);
    const menuRef = useRef(null);
    const toggleRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            const nextIsMobile = window.innerWidth <= 900;
            setIsMobile(nextIsMobile);
            if (!nextIsMobile) {
                setMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!mobileMenuOpen) return;

        const handleClickOutside = (event) => {
            const clickedInsideMenu = menuRef.current && menuRef.current.contains(event.target);
            const clickedToggle = toggleRef.current && toggleRef.current.contains(event.target);

            if (!clickedInsideMenu && !clickedToggle) {
                setMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [mobileMenuOpen]);

    if (!user) return null;

    const initials = user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

    const handleNavigate = (page) => {
        setCurrentPage(page);
        setMobileMenuOpen(false);
    };

    const showProfileLink = true;
    const showUserManagementLink = user.role === 'Administrator';

    const displayName = (user.name || '').replace(/IT Helpdesk \((.*?)\)/i, '$1');

    const getRoleCardStyle = (role) => {
        if (role === 'Administrator') return { bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.25)', text: '#C084FC' };
        if (role === 'IT_Support') return { bg: 'rgba(14, 165, 233, 0.12)', border: 'rgba(14, 165, 233, 0.25)', text: '#38BDF8' };
        return { bg: 'rgba(99, 102, 241, 0.12)', border: 'rgba(99, 102, 241, 0.25)', text: '#818CF8' };
    };

    const getRoleLabel = (role) => {
        if (role === 'Administrator') return 'Administrator';
        if (role === 'IT_Support') return 'IT Helpdesk';
        return 'Employee';
    };

    const cardStyle = getRoleCardStyle(user.role);

    return (
        <header className="navbar">
            <div
                className="brand"
                style={{ cursor: 'pointer' }}
                onClick={() => handleNavigate('dashboard')}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNavigate('dashboard'); }}
                role="button"
                tabIndex={0}
                aria-label="Go to TicketForge Dashboard"
            >
                <IconForge className="brand-icon" size={28} />
                <span>TicketForge</span>
            </div>

            <nav className="nav-right" aria-label="Main Navigation">
                <div className="nav-actions desktop-nav">
                    <button
                        type="button"
                        className={`nav-link-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
                        onClick={() => handleNavigate('dashboard')}
                        aria-label="Navigate to Dashboard"
                    >
                        <IconTicket size={16} /> Dashboard
                    </button>

                    {showProfileLink && (
                        <button
                            type="button"
                            className={`nav-link-btn ${currentPage === 'profile' ? 'active' : ''}`}
                            onClick={() => handleNavigate('profile')}
                            aria-label="Navigate to Profile Settings"
                        >
                            <IconUser size={16} /> Profile
                        </button>
                    )}

                    {showUserManagementLink && (
                        <button
                            type="button"
                            className={`nav-link-btn ${currentPage === 'users' ? 'active' : ''}`}
                            onClick={() => handleNavigate('users')}
                            aria-label="Navigate to User Management Directory"
                        >
                            <IconUser size={16} /> User Management
                        </button>
                    )}

                    <div className="user-badge" style={{
                        background: cardStyle.bg,
                        border: `1px solid ${cardStyle.border}`,
                        borderRadius: '10px',
                        padding: '0.35rem 0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem'
                    }}>
                        <div className="user-avatar" style={{ width: '32px', height: '32px', fontSize: '0.85rem' }}>{initials}</div>
                        <div className="user-info" style={{ display: 'flex', flexDirection: 'column', gap: '1px', textAlign: 'left' }}>
                            <span className="user-name" style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--text-main)', display: 'block', lineHeight: 1.2 }}>{displayName}</span>
                            <span style={{ fontSize: '0.74rem', color: cardStyle.text, fontWeight: 500, display: 'block', lineHeight: 1.2 }}>
                                {getRoleLabel(user.role)}
                            </span>
                        </div>
                    </div>

                    <button type="button" className="nav-link-btn nav-logout-btn" onClick={onLogout} title="Logout" aria-label="Sign out of your session">
                        <span>Logout</span> <IconLogout size={16} />
                    </button>
                </div>

                <button
                    ref={toggleRef}
                    type="button"
                    className="nav-mobile-toggle"
                    onClick={() => setMobileMenuOpen((open) => !open)}
                    aria-expanded={mobileMenuOpen}
                    aria-label="Toggle mobile navigation menu"
                    title="Toggle navigation menu"
                >
                    ☰
                </button>
            </nav>

            {mobileMenuOpen && (
                <div ref={menuRef} className="mobile-nav-panel">
                    <button type="button" className={`mobile-nav-item ${currentPage === 'dashboard' ? 'active' : ''}`} onClick={() => handleNavigate('dashboard')}>
                        Dashboard
                    </button>

                    {showProfileLink && (
                        <button type="button" className={`mobile-nav-item ${currentPage === 'profile' ? 'active' : ''}`} onClick={() => handleNavigate('profile')}>
                            Profile
                        </button>
                    )}

                    {showUserManagementLink && (
                        <button type="button" className={`mobile-nav-item ${currentPage === 'users' ? 'active' : ''}`} onClick={() => handleNavigate('users')}>
                            User Management
                        </button>
                    )}

                    <button type="button" className="mobile-nav-item mobile-nav-logout" onClick={onLogout} aria-label="Sign out of your session">
                        <span>Logout</span> <IconLogout size={15} />
                    </button>
                </div>
            )}
        </header>
    );
}
