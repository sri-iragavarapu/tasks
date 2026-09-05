import React from 'react';
import { IconForge, IconTicket, IconUser } from '../assets/icons';

export function WelcomePage({ onSelectPortal }) {
    return (
        <main className="auth-container welcome-page">
            <div className="container">
                <div className="welcome-shell">
                    <div className="welcome-header">
                        <div className="auth-logo">
                            <IconForge size={32} /> TicketForge
                        </div>
                        <h1>Choose your service portal</h1>
                        <p>Select the portal that matches your role to continue to the secure sign-in experience.</p>
                    </div>

                    <div className="welcome-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))' }}>
                        <button type="button" className="welcome-card" onClick={() => onSelectPortal('employee')} aria-label="Open Employee Sign In Portal">
                            <div className="welcome-card-icon">
                                <IconUser size={28} />
                            </div>
                            <h2>Employee Portal</h2>
                            <p>Access your tickets, submit new requests, and manage your support activity.</p>
                            <span className="welcome-card-action">Open Employee Sign In</span>
                        </button>

                        <button type="button" className="welcome-card welcome-card-support" onClick={() => onSelectPortal('it-support')} aria-label="Open IT Support Sign In Portal">
                            <div className="welcome-card-icon">
                                <IconTicket size={28} />
                            </div>
                            <h2>IT Support Portal</h2>
                            <p>Review company-wide tickets, assign work, and keep service operations moving.</p>
                            <span className="welcome-card-action">Open IT Support Sign In</span>
                        </button>

                        <button type="button" className="welcome-card" style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12), rgba(15, 23, 42, 0.95))' }} onClick={() => onSelectPortal('admin')} aria-label="Open Administrator Sign In Portal">
                            <div className="welcome-card-icon" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#A855F7' }}>
                                <IconUser size={28} />
                            </div>
                            <h2>Administrator Console</h2>
                            <p>Manage accounts, add IT Support staff, reset passwords, and system security.</p>
                            <span className="welcome-card-action" style={{ color: '#A855F7' }}>Open Admin Sign In</span>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
