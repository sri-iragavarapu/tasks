import React, { useState, useEffect } from 'react';
import {
    IconTrash,
    IconUser,
    IconKey,
    IconCheckCircle,
    IconPlus,
    IconUsers,
    IconHeadphones,
    IconShield,
    IconPower
} from '../assets/icons';
import { ConfirmModal } from '../components/ConfirmModal';
import { PasswordField } from '../components/PasswordField';

export function UserManagementPage({ currentUser }) {
    const isAdmin = currentUser?.role === 'Administrator';

    const [users, setUsers] = useState([]);
    const [categorized, setCategorized] = useState({ employees: [], support: [], admins: [] });
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'employees', 'support', 'admins'
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Modal state for Add IT Support Member
    const [showAddSupportModal, setShowAddSupportModal] = useState(false);
    const [supportName, setSupportName] = useState('');
    const [supportEmail, setSupportEmail] = useState('');
    const [supportDept, setSupportDept] = useState('IT Support');
    const [supportPassword, setSupportPassword] = useState('Support@2026');
    const [addSupportLoading, setAddSupportLoading] = useState(false);

    // Modal state for Reset Password
    const [showResetModal, setShowResetModal] = useState(false);
    const [selectedUserForReset, setSelectedUserForReset] = useState(null);
    const [tempPassword, setTempPassword] = useState('Temp@2026');
    const [resetLoading, setResetLoading] = useState(false);

    // Modal state for Toggle Status (Deactivate / Activate)
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedUserForStatus, setSelectedUserForStatus] = useState(null);

    // Modal state for Delete Permanently
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUserForDelete, setSelectedUserForDelete] = useState(null);

    // Modal state for Reset Password Confirmation
    const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);

    const confirmDeleteUserPermanently = async () => {
        if (!selectedUserForDelete) return;
        setMessage('');
        setError('');

        try {
            const res = await fetch(`/api/users/${selectedUserForDelete.id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setMessage(data.message || `Account for ${selectedUserForDelete.name} permanently deleted.`);
                fetchUsers();
            } else {
                setError(data.message || 'Failed to delete user account.');
            }
        } catch (err) {
            setError('Error deleting user account.');
        } finally {
            setShowDeleteModal(false);
            setSelectedUserForDelete(null);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const endpoint = isAdmin ? '/api/users/all' : '/api/users/employees';
            const res = await fetch(endpoint, { credentials: 'include' });
            const data = await res.json();
            if (data.success) {
                if (isAdmin) {
                    setUsers(data.users || []);
                    setCategorized(data.categorized || { employees: [], support: [], admins: [] });
                } else {
                    setUsers(data.employees || []);
                }
            } else {
                setError(data.message || 'Failed to fetch directory.');
            }
        } catch (err) {
            setError('Could not connect to backend server.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [currentUser]);

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

    const [modalError, setModalError] = useState('');

    // Handle Add IT Support Member submit
    const handleAddSupport = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setModalError('');

        const trimmedName = supportName.trim();
        const trimmedEmail = supportEmail.trim();

        if (!trimmedName || trimmedName.length < 3 || !/^[a-zA-Z\s]+$/.test(trimmedName)) {
            setModalError('Name must be at least 3 characters long and contain letters/spaces only.');
            return;
        }

        if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            setModalError('Please enter a valid company email address.');
            return;
        }

        if (!supportPassword || supportPassword.length < 8) {
            setModalError('Password must be at least 8 characters long.');
            return;
        }

        if (!/[A-Z]/.test(supportPassword) || !/[a-z]/.test(supportPassword) || !/[0-9]/.test(supportPassword) || !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(supportPassword)) {
            setModalError('Password must include uppercase, lowercase, number, and special character.');
            return;
        }

        setAddSupportLoading(true);

        try {
            const res = await fetch('/api/users/support', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: trimmedName,
                    email: trimmedEmail,
                    password: supportPassword,
                    department: supportDept
                })
            });

            const data = await res.json();

            if (data.success) {
                setMessage(data.message || 'IT Support member added successfully!');
                setShowAddSupportModal(false);
                setSupportName('');
                setSupportEmail('');
                setSupportPassword('Support@2026');
                setModalError('');
                fetchUsers();
            } else {
                setModalError(data.message || 'Failed to add IT Support member.');
            }
        } catch (err) {
            setModalError('Error creating IT Support account.');
        } finally {
            setAddSupportLoading(false);
        }
    };

    // Handle Toggle Status (Deactivate / Activate)
    const confirmToggleStatus = async () => {
        if (!selectedUserForStatus) return;
        setMessage('');
        setError('');

        const newStatus = selectedUserForStatus.is_active === 1 ? 0 : 1;

        try {
            const res = await fetch(`/api/users/${selectedUserForStatus.id}/status`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: newStatus })
            });

            const data = await res.json();
            if (data.success) {
                setMessage(data.message);
                fetchUsers();
            } else {
                setError(data.message || 'Failed to update user status.');
            }
        } catch (err) {
            setError('Error updating user status.');
        } finally {
            setShowStatusModal(false);
            setSelectedUserForStatus(null);
        }
    };

    // Handle Reset Password submit
    const handleResetPasswordSubmit = async (e) => {
        e.preventDefault();
        if (!selectedUserForReset) return;
        setMessage('');
        setError('');
        setResetLoading(true);

        try {
            const res = await fetch(`/api/users/${selectedUserForReset.id}/reset-password`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tempPassword })
            });

            const data = await res.json();
            if (data.success) {
                setMessage(`Password for ${selectedUserForReset.name} reset to temporary password: "${data.tempPassword}"`);
                setShowResetModal(false);
                setSelectedUserForReset(null);
                setTempPassword('Temp@2026');
            } else {
                setError(data.message || 'Failed to reset password.');
            }
        } catch (err) {
            setError('Error resetting password.');
        } finally {
            setResetLoading(false);
        }
    };

    // Filtered users depending on active tab
    const getDisplayedUsers = () => {
        if (!isAdmin) return users;
        if (activeTab === 'employees') return categorized.employees;
        if (activeTab === 'support') return categorized.support;
        if (activeTab === 'admins') return categorized.admins;
        return users;
    };

    const displayedUsers = getDisplayedUsers();

    const getRoleTagClass = (role) => {
        if (role === 'Administrator') return 'role-tag role-admin';
        if (role === 'IT_Support') return 'role-tag role-support';
        return 'role-tag role-employee';
    };

    const getRoleLabel = (role) => {
        if (role === 'Administrator') return 'ADMINISTRATOR';
        if (role === 'IT_Support') return 'IT SUPPORT';
        return 'EMPLOYEE';
    };

    const renderUserTable = (userList) => {
        if (!userList || userList.length === 0) return null;
        return (
            <div className="table-shell">
                <div className="table-scroll">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>FULL NAME</th>
                                <th>COMPANY EMAIL</th>
                                <th>DEPARTMENT</th>
                                <th>ROLE</th>
                                <th>STATUS</th>
                                <th>REGISTERED DATE</th>
                                {isAdmin && <th style={{ textAlign: 'center', minWidth: '320px' }}>ACTIONS</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {userList.map((u) => {
                                const isSelf = currentUser?.id === u.id;
                                const isActive = u.is_active !== 0;

                                return (
                                    <tr key={u.id}>
                                        <td style={{ fontWeight: 600, color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                                            {`USR-${String(u.id).padStart(4, '0')}`}
                                        </td>
                                        <td style={{ fontWeight: isSelf ? 700 : 500 }}>
                                            {u.name} {isSelf && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>(You)</span>}
                                        </td>
                                        <td>{u.email}</td>
                                        <td>
                                            <span className="category-tag">{u.department || 'General'}</span>
                                        </td>
                                        <td>
                                            <span className={getRoleTagClass(u.role)}>{getRoleLabel(u.role)}</span>
                                        </td>
                                        <td>
                                            <span className={`status-tag ${isActive ? 'status-active' : 'status-deactivated'}`}>
                                                {isActive ? 'ACTIVE' : 'DEACTIVATED'}
                                            </span>
                                        </td>
                                        <td>{new Date(u.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                        {isAdmin && (
                                            <td style={{ minWidth: '320px' }}>
                                                <div className="user-actions-cell">
                                                    {/* Actions only available for non-Administrator users */}
                                                    {u.role !== 'Administrator' && (
                                                        <>
                                                            {/* Deactivate / Activate Button */}
                                                            <button
                                                                className={`btn btn-sm ${isActive ? 'btn-danger' : 'btn-success'} user-action-btn`}
                                                                onClick={() => {
                                                                    setSelectedUserForStatus(u);
                                                                    setShowStatusModal(true);
                                                                }}
                                                                title={isActive ? 'Deactivate Account' : 'Activate Account'}
                                                            >
                                                                <IconPower size={14} />
                                                                <span>{isActive ? 'Deactivate' : 'Activate'}</span>
                                                            </button>

                                                            {/* Reset Password Button */}
                                                            <button
                                                                className="btn btn-secondary btn-sm user-action-btn"
                                                                onClick={() => {
                                                                    setSelectedUserForReset(u);
                                                                    setTempPassword('Temp@2026');
                                                                    setShowResetConfirmModal(true);
                                                                }}
                                                                title="Reset Password to Temporary Password"
                                                            >
                                                                <IconKey size={14} />
                                                                <span>Reset Password</span>
                                                            </button>

                                                            {/* Delete Permanently Button */}
                                                            <button
                                                                className="btn btn-danger btn-sm user-action-btn"
                                                                onClick={() => {
                                                                    setSelectedUserForDelete(u);
                                                                    setShowDeleteModal(true);
                                                                }}
                                                                title="Delete Account Permanently"
                                                            >
                                                                <IconTrash size={14} />
                                                                <span>Delete</span>
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div style={{ textAlign: 'center', padding: '0.85rem', borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    Showing 1 to {userList.length} of {users.length} users
                </div>
            </div>
        );
    };

    return (
        <main className="app-container">
            <div className="container">
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">User Management</h1>
                        <p className="dashboard-subtitle">
                            Administrator Console - Access Control, Account Status & Support Staff Onboarding
                        </p>
                    </div>

                    {isAdmin && (
                        <button className="btn btn-primary" onClick={() => setShowAddSupportModal(true)}>
                            <IconPlus size={18} /> Add IT Support Member
                        </button>
                    )}
                </div>

                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-error">{error}</div>}

                {/* Directory Role Tabs */}
                {isAdmin && (
                    <div className="tabs-bar" role="tablist" aria-label="Filter users by role">
                        <button type="button" role="tab" aria-selected={activeTab === 'all'} className={`tab-item ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
                            <IconUsers size={16} />
                            <span>All Users</span>
                            <span className="tab-count-pill">{users.length}</span>
                        </button>
                        <button type="button" role="tab" aria-selected={activeTab === 'employees'} className={`tab-item ${activeTab === 'employees' ? 'active' : ''}`} onClick={() => setActiveTab('employees')}>
                            <IconUser size={16} />
                            <span>Employees</span>
                            <span className="tab-count-pill">{categorized.employees.length}</span>
                        </button>
                        <button type="button" role="tab" aria-selected={activeTab === 'support'} className={`tab-item ${activeTab === 'support' ? 'active' : ''}`} onClick={() => setActiveTab('support')}>
                            <IconHeadphones size={16} />
                            <span>IT Support</span>
                            <span className="tab-count-pill">{categorized.support.length}</span>
                        </button>
                        <button type="button" role="tab" aria-selected={activeTab === 'admins'} className={`tab-item ${activeTab === 'admins' ? 'active' : ''}`} onClick={() => setActiveTab('admins')}>
                            <IconShield size={16} />
                            <span>Administrators</span>
                            <span className="tab-count-pill">{categorized.admins.length}</span>
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="table-shell" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        Loading directory records...
                    </div>
                ) : displayedUsers.length === 0 ? (
                    <div className="table-shell" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        No accounts found.
                    </div>
                ) : (
                    renderUserTable(displayedUsers)
                )}

                {/* Modal 1: Add IT Support Member */}
                {showAddSupportModal && (
                    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="add-support-title" onClick={() => { setShowAddSupportModal(false); setModalError(''); }}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3 id="add-support-title">Add IT Support Member</h3>
                                <button type="button" className="modal-close" onClick={() => { setShowAddSupportModal(false); setModalError(''); }} aria-label="Close modal" title="Close modal">&times;</button>
                            </div>
                            <form onSubmit={handleAddSupport} noValidate>
                                <div className="modal-body">
                                    {modalError && <div className="alert alert-error">{modalError}</div>}

                                    <div className="form-group">
                                        <label htmlFor="add-support-name">Full Name *</label>
                                        <input
                                            id="add-support-name"
                                            name="name"
                                            type="text"
                                            autoComplete="name"
                                            className="form-input"
                                            placeholder="e.g. Robert Vance"
                                            value={supportName}
                                            onChange={(e) => setSupportName(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="add-support-email">Company Email Address *</label>
                                        <input
                                            id="add-support-email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            className="form-input"
                                            placeholder="robert@levitateit.com"
                                            value={supportEmail}
                                            onChange={(e) => setSupportEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="add-support-dept">Department / IT Unit *</label>
                                        <input
                                            id="add-support-dept"
                                            name="department"
                                            type="text"
                                            className="form-input"
                                            placeholder="IT Operations"
                                            value={supportDept}
                                            onChange={(e) => setSupportDept(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <PasswordField
                                        id="add-support-pass"
                                        name="password"
                                        label="Initial Password"
                                        placeholder="Support@2026"
                                        value={supportPassword}
                                        onChange={(e) => setSupportPassword(e.target.value)}
                                        required={true}
                                    />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => { setShowAddSupportModal(false); setModalError(''); }}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={addSupportLoading}>
                                        {addSupportLoading ? 'Creating...' : 'Add IT Support Member'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal 2: Reset Password Modal */}
                {showResetModal && selectedUserForReset && (
                    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="reset-pass-title" onClick={() => setShowResetModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3 id="reset-pass-title">Reset Password for {selectedUserForReset.name}</h3>
                                <button type="button" className="modal-close" onClick={() => setShowResetModal(false)} aria-label="Close modal" title="Close modal">&times;</button>
                            </div>
                            <form onSubmit={handleResetPasswordSubmit}>
                                <div className="modal-body">
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                                        Set a temporary password for <strong>{selectedUserForReset.email}</strong>. Provide this temporary password to the user so they can log in and update it in their profile.
                                    </p>

                                    <PasswordField
                                        id="temp-password-input"
                                        name="tempPassword"
                                        label="Temporary Password"
                                        placeholder="Temp@2026"
                                        value={tempPassword}
                                        onChange={(e) => setTempPassword(e.target.value)}
                                        required={true}
                                    />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowResetModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={resetLoading}>
                                        {resetLoading ? 'Resetting...' : 'Set Temporary Password'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal 3: Deactivate / Activate Confirmation Modal */}
                <ConfirmModal
                    isOpen={showStatusModal}
                    title={selectedUserForStatus?.is_active === 1 ? 'Deactivate Account?' : 'Activate Account?'}
                    message={selectedUserForStatus ? (
                        selectedUserForStatus.is_active === 1
                            ? `Are you sure you want to DEACTIVATE the account for ${selectedUserForStatus.name} (${selectedUserForStatus.email})? They will be blocked from logging into TicketForge until reactivated.`
                            : `Are you sure you want to REACTIVATE the account for ${selectedUserForStatus.name} (${selectedUserForStatus.email})? They will regain access to TicketForge.`
                    ) : ''}
                    confirmText={selectedUserForStatus?.is_active === 1 ? 'Deactivate Account' : 'Activate Account'}
                    confirmVariant={selectedUserForStatus?.is_active === 1 ? 'danger' : 'primary'}
                    onClose={() => setShowStatusModal(false)}
                    onConfirm={confirmToggleStatus}
                />

                {/* Modal 4: Reset Password Confirmation Modal */}
                <ConfirmModal
                    isOpen={showResetConfirmModal}
                    title="Reset User Password?"
                    message={selectedUserForReset ? `Are you sure you want to reset the password for ${selectedUserForReset.name} (${selectedUserForReset.email})?` : ''}
                    confirmText="Proceed to Reset"
                    confirmVariant="primary"
                    onClose={() => setShowResetConfirmModal(false)}
                    onConfirm={() => {
                        setShowResetConfirmModal(false);
                        setShowResetModal(true);
                    }}
                />

                {/* Modal 5: Delete Account Permanently Confirmation Modal */}
                <ConfirmModal
                    isOpen={showDeleteModal}
                    title="Delete Account Permanently?"
                    message={selectedUserForDelete ? `WARNING: Are you sure you want to PERMANENTLY DELETE the account for ${selectedUserForDelete.name} (${selectedUserForDelete.email})? All ticket history and messages for this user will be removed. THIS ACTION CANNOT BE UNDONE.` : ''}
                    confirmText="Yes, Delete Permanently"
                    confirmVariant="danger"
                    onClose={() => {
                        setShowDeleteModal(false);
                        setSelectedUserForDelete(null);
                    }}
                    onConfirm={confirmDeleteUserPermanently}
                />
            </div>
        </main>
    );
}
