import React, { useState, useEffect } from 'react';
import { IconTrash } from '../assets/icons';
import { ConfirmModal } from '../components/ConfirmModal';
import { PasswordField } from '../components/PasswordField';

export function ProfilePage({ user, onUpdateUser, onDeleteAccount, onClose }) {
    const [name, setName] = useState(user?.name || '');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        if (!message) return;
        const timer = window.setTimeout(() => setMessage(''), 4000);
        return () => window.clearTimeout(timer);
    }, [message]);

    useEffect(() => {
        if (!error) return;
        const timer = window.setTimeout(() => setError(''), 4000);
        return () => window.clearTimeout(timer);
    }, [error]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        const trimmedName = name.trim();
        if (!trimmedName || trimmedName.length < 3 || !/^[a-zA-Z\s]+$/.test(trimmedName)) {
            setError('Name must be at least 3 characters long and contain letters and spaces only.');
            return;
        }

        if (newPassword && newPassword.trim() !== '') {
            const pass = newPassword.trim();
            if (pass.length < 8) {
                setError('New password must be at least 8 characters long.');
                return;
            }
            if (!/[A-Z]/.test(pass) || !/[a-z]/.test(pass) || !/[0-9]/.test(pass) || !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass)) {
                setError('New password must contain uppercase, lowercase, number, and special character.');
                return;
            }
        }

        setLoading(true);
        try {
            const res = await fetch('/api/users/profile', {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: trimmedName, newPassword: newPassword.trim() })
            });

            const data = await res.json();
            if (data.success) {
                setMessage(data.message || 'Profile updated successfully!');
                setNewPassword('');
                if (data.user) {
                    onUpdateUser(data.user);
                }
            } else {
                setError(data.message || 'Failed to update profile.');
            }
        } catch (err) {
            setError('Server connection error.');
        } finally {
            setLoading(false);
        }
    };

    const confirmDeleteMe = async () => {
        try {
            const res = await fetch('/api/users/me', { method: 'DELETE', credentials: 'include' });
            const data = await res.json();
            if (data.success) {
                onDeleteAccount();
            } else {
                setError(data.message || 'Failed to delete account.');
            }
        } catch (err) {
            setError('Error deleting account.');
        } finally {
            setShowDeleteModal(false);
        }
    };

    if (!user) return null;
    const initialChar = user.name ? user.name[0].toUpperCase() : 'U';

    return (
        <main className="app-container">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <section className="detail-main" style={{ maxWidth: '640px', margin: '0 auto' }} aria-labelledby="profile-heading">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                                <div>
                                    <h1 id="profile-heading" style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                                        {user?.role === 'Administrator' ? 'Administrator Profile Settings' : user?.role === 'IT_Support' ? 'IT Support Profile Settings' : 'Employee Profile Settings'}
                                    </h1>
                                    <span className="category-tag">{user?.department || 'General'} Department</span>
                                </div>
                                {onClose && (
                                    <button
                                        type="button"
                                        className="modal-close"
                                        onClick={onClose}
                                        aria-label="Close profile and return to dashboard"
                                        title="Close profile and return to dashboard"
                                        style={{ position: 'static', padding: '0.25rem 0.5rem', fontSize: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                                    >
                                        &times;
                                    </button>
                                )}
                            </div>

                            {message && <div className="alert alert-success">{message}</div>}
                            {error && <div className="alert alert-error">{error}</div>}

                            <form onSubmit={handleUpdate} noValidate>
                                <div className="form-group">
                                    <label htmlFor="profile-email">Company Email (Read-Only)</label>
                                    <input
                                        id="profile-email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        className="form-input"
                                        value={user.email}
                                        disabled
                                        style={{ opacity: 0.7, cursor: 'not-allowed', background: 'rgba(255,255,255,0.02)' }}
                                    />
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                                        Email address is locked to company domain and cannot be modified.
                                    </span>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="profile-name">Full Name *</label>
                                    <input
                                        id="profile-name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        className="form-input"
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                            if (error) setError('');
                                        }}
                                        required
                                    />
                                </div>

                                <PasswordField
                                    id="profile-password"
                                    name="newPassword"
                                    label="Change Password (Leave blank to keep existing password)"
                                    placeholder="8+ chars (Upper, Lower, Number, Symbol)"
                                    value={newPassword}
                                    onChange={(e) => {
                                        setNewPassword(e.target.value);
                                        if (error) setError('');
                                    }}
                                    autoComplete="new-password"
                                />

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', gap: '1rem', flexWrap: 'wrap' }}>
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={() => setShowDeleteModal(true)}
                                    >
                                        <IconTrash size={16} /> Delete My Account
                                    </button>

                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? 'Saving...' : 'Update Profile'}
                                    </button>
                                </div>
                            </form>
                        </section>

                        <ConfirmModal
                            isOpen={showDeleteModal}
                            title="Delete Employee Account?"
                            message="Are you sure you want to permanently delete your account? All your raised tickets will be removed. This action cannot be undone."
                            confirmText="Yes, Delete My Account"
                            confirmVariant="danger"
                            onClose={() => setShowDeleteModal(false)}
                            onConfirm={confirmDeleteMe}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
