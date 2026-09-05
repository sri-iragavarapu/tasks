import React, { useState, useEffect } from 'react';
import { StatusTimeline } from '../components/StatusTimeline';
import { TicketChat } from '../components/TicketChat';
import { ConfirmModal } from '../components/ConfirmModal';
import { IconArrowLeft, IconUser, IconTrash, IconCheckCircle } from '../assets/icons';

export function TicketDetailPage({ ticketId, currentUser, onBack }) {
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionMsg, setActionMsg] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [assigning, setAssigning] = useState(false);

    const fetchTicketDetails = async () => {
        try {
            const res = await fetch(`/api/tickets/${ticketId}`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) {
                setTicket(data.ticket);
            } else {
                setError(data.message || 'Ticket not found.');
            }
        } catch (err) {
            setError('Error loading ticket details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (ticketId) {
            fetchTicketDetails();
        }
    }, [ticketId]);

    useEffect(() => {
        if (!error) return;
        const timer = window.setTimeout(() => setError(''), 4000);
        return () => window.clearTimeout(timer);
    }, [error]);

    useEffect(() => {
        if (!actionMsg) return;
        const timer = window.setTimeout(() => setActionMsg(''), 4000);
        return () => window.clearTimeout(timer);
    }, [actionMsg]);

    // Action: Assign ticket to logged-in IT Support agent / Admin
    const handleAssignToMe = async () => {
        setAssigning(true);
        setActionMsg('');
        try {
            const res = await fetch(`/api/tickets/${ticketId}/assign`, {
                method: 'PUT',
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setActionMsg('Ticket assigned to you and status changed to In Progress!');
                fetchTicketDetails();
            } else {
                setError(data.message || 'Failed to assign ticket.');
            }
        } catch (err) {
            setError('Error assigning ticket.');
        } finally {
            setAssigning(false);
        }
    };

    // Action: Unassign ticket (IT Support / Admin)
    const handleUnassignTicket = async () => {
        setAssigning(true);
        setActionMsg('');
        try {
            const res = await fetch(`/api/tickets/${ticketId}/unassign`, {
                method: 'PUT',
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setActionMsg('Ticket unassigned and status set to Open.');
                fetchTicketDetails();
            } else {
                setError(data.message || 'Failed to unassign ticket.');
            }
        } catch (err) {
            setError('Error unassigning ticket.');
        } finally {
            setAssigning(false);
        }
    };

    // Action: Update status (IT Support)
    const handleStatusChange = async (newStatus) => {
        setActionMsg('');
        try {
            const res = await fetch(`/api/tickets/${ticketId}/status`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                setActionMsg(`Status updated to ${newStatus.replace('_', ' ')}.`);
                fetchTicketDetails();
            } else {
                setError(data.message || 'Failed to update status.');
            }
        } catch (err) {
            setError('Error updating status.');
        }
    };

    // Action: Close Ticket (Employee)
    const handleCloseTicket = async () => {
        setActionMsg('');
        try {
            const res = await fetch(`/api/tickets/${ticketId}/close`, {
                method: 'PUT',
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setActionMsg('Ticket closed successfully.');
                fetchTicketDetails();
            } else {
                setError(data.message || 'Failed to close ticket.');
            }
        } catch (err) {
            setError('Error closing ticket.');
        }
    };

    // Action: Delete Ticket (IT Support)
    const confirmDeleteTicket = async () => {
        try {
            const res = await fetch(`/api/tickets/${ticketId}`, { method: 'DELETE', credentials: 'include' });
            const data = await res.json();
            if (data.success) {
                onBack();
            } else {
                setError(data.message || 'Failed to delete ticket.');
            }
        } catch (err) {
            setError('Error deleting ticket.');
        } finally {
            setShowDeleteModal(false);
        }
    };

    if (loading) {
        return (
            <div className="app-container" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                Loading ticket details...
            </div>
        );
    }

    if (error || !ticket) {
        return (
            <div className="app-container">
                <button className="btn btn-secondary btn-sm" onClick={onBack} style={{ marginBottom: '1rem' }}>
                    <IconArrowLeft size={16} /> Back to Dashboard
                </button>
                <div className="alert alert-error">{error || 'Ticket not found.'}</div>
            </div>
        );
    }

    const formattedTicketNum = `TF-${String(ticket.id).padStart(4, '0')}`;

    const formatDateTime = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <main className="app-container">
            <div className="container">
            {/* Top Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={onBack} aria-label="Back to tickets dashboard">
                    <IconArrowLeft size={16} /> Back to Tickets
                </button>

                <span className="ticket-number" style={{ fontSize: '1rem', background: 'var(--bg-card)', padding: '4px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    {formattedTicketNum}
                </span>
            </div>

            {actionMsg && <div className="alert alert-success">{actionMsg}</div>}

            {/* Layout Grid */}
            <div className="ticket-detail-layout">
                {/* Main Column */}
                <div className="detail-main">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <span className="category-tag" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
                                {ticket.category}
                            </span>
                            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
                                {ticket.title}
                            </h1>
                        </div>
                    </div>

                    {/* Status Timeline */}
                    <StatusTimeline status={ticket.status} />

                    {/* Description Box */}
                    <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', margin: '1.5rem 0' }}>
                        <h4 style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                            Problem Description
                        </h4>
                        <p style={{ color: 'var(--text-main)', whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '0.95rem' }}>
                            {ticket.description}
                        </p>
                    </div>

                    {/* Interactive Discussion Thread */}
                    <TicketChat ticketId={ticket.id} currentUser={currentUser} />
                </div>

                {/* Sidebar Details Column */}
                <div className="detail-sidebar">
                    {/* Metadata Card */}
                    <div className="side-card">
                        <h4>Ticket Information</h4>

                        <div className="meta-item">
                            <div className="meta-label">Ticket Number</div>
                            <div className="meta-value">{formattedTicketNum}</div>
                        </div>

                        <div className="meta-item">
                            <div className="meta-label">Raised By</div>
                            <div className="meta-value">{ticket.creator_name} ({ticket.creator_department})</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{ticket.creator_email}</div>
                        </div>

                        <div className="meta-item">
                            <div className="meta-label">Created Date & Time</div>
                            <div className="meta-value">{formatDateTime(ticket.created_at)}</div>
                        </div>

                        <div className="meta-item">
                            <div className="meta-label">Assigned IT Agent</div>
                            <div className="meta-value" style={{ color: ticket.assignee_name ? 'var(--primary)' : 'var(--warning)' }}>
                                {ticket.assignee_name ? ticket.assignee_name.replace(/IT Helpdesk \((.*?)\)/i, '$1') : 'Unassigned'}
                            </div>
                        </div>

                        {ticket.assigned_at && (
                            <div className="meta-item">
                                <div className="meta-label">Assigned Date & Time</div>
                                <div className="meta-value">{formatDateTime(ticket.assigned_at)}</div>
                            </div>
                        )}

                        <div className="meta-item">
                            <div className="meta-label">Category</div>
                            <div className="meta-value">{ticket.category}</div>
                        </div>

                        <div className="meta-item">
                            <div className="meta-label">Priority</div>
                            <div className="meta-value">{ticket.priority}</div>
                        </div>

                        <div className="meta-item">
                            <div className="meta-label">Current Status</div>
                            <div className="meta-value">{ticket.status.replace('_', ' ')}</div>
                        </div>
                    </div>

                    {/* IT Support Action Panel */}
                    {currentUser.role === 'IT_Support' && (
                        <div className="side-card">
                            <h4>IT Support Controls</h4>

                            {ticket.assigned_to ? (
                                <button
                                    className="btn btn-secondary"
                                    style={{ width: '100%', marginBottom: '1rem' }}
                                    onClick={handleUnassignTicket}
                                    disabled={assigning}
                                >
                                    {assigning ? 'Updating...' : 'Unassign'}
                                </button>
                            ) : (
                                <button
                                    className="btn btn-primary"
                                    style={{ width: '100%', marginBottom: '1rem' }}
                                    onClick={handleAssignToMe}
                                    disabled={assigning}
                                >
                                    <IconUser size={16} /> {assigning ? 'Assigning...' : 'Assign to Me'}
                                </button>
                            )}

                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label htmlFor="change-ticket-status">Change Ticket Status</label>
                                <select
                                    id="change-ticket-status"
                                    name="status"
                                    className="form-select"
                                    value={ticket.status}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    disabled={currentUser.role === 'IT_Support' && ticket.assigned_to !== currentUser.id}
                                    aria-label="Change ticket status"
                                >
                                    <option value="Open">Open</option>
                                    <option value="In_Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                    <option value="Closed">Closed</option>
                                </select>
                                {currentUser.role === 'IT_Support' && ticket.assigned_to !== currentUser.id && (
                                    <span style={{ fontSize: '0.76rem', color: 'var(--warning)', marginTop: '6px', display: 'block', lineHeight: 1.3 }}>
                                        Please assign this ticket to yourself before updating the status.
                                    </span>
                                )}
                            </div>

                            <button
                                className="btn btn-danger btn-sm"
                                style={{ width: '100%', marginTop: '0.5rem' }}
                                onClick={() => setShowDeleteModal(true)}
                            >
                                <IconTrash size={16} /> Delete Ticket
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                title="Delete Ticket?"
                message={`Are you sure you want to permanently delete ticket ${formattedTicketNum}? All message history will be removed.`}
                confirmText="Delete Ticket"
                confirmVariant="danger"
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDeleteTicket}
            />
            </div>
        </main>
    );
}
