import React, { useState, useEffect } from 'react';
import { StatCard } from '../components/StatCard';
import { TicketCard } from '../components/TicketCard';
import { TicketFilter } from '../components/TicketFilter';
import { TicketModal } from '../components/TicketModal';
import { IconPlus, IconTicket, IconClock, IconCheckCircle } from '../assets/icons';

export function EmployeeDashboard({ user, onSelectTicket }) {
    const [tickets, setTickets] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [status, setStatus] = useState('All');
    const [priority, setPriority] = useState('All');
    const [assignmentFilter, setAssignmentFilter] = useState('All');
    const [sortBy, setSortBy] = useState('newest');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!error) return;
        const timer = window.setTimeout(() => setError(''), 4000);
        return () => window.clearTimeout(timer);
    }, [error]);

    const fetchMyTickets = async () => {
        try {
            const queryParams = new URLSearchParams();
            if (search) queryParams.append('search', search);
            if (category !== 'All') queryParams.append('category', category);
            if (status !== 'All') queryParams.append('status', status);
            if (priority !== 'All') queryParams.append('priority', priority);
            if (assignmentFilter !== 'All') queryParams.append('assignmentFilter', assignmentFilter);
            if (sortBy) queryParams.append('sortBy', sortBy);

            const res = await fetch(`/api/tickets?${queryParams.toString()}`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) {
                setTickets(data.tickets);
            } else {
                setError(data.message || 'Failed to fetch your tickets.');
            }
        } catch (err) {
            setError('Could not connect to backend server.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyTickets();
    }, [search, category, status, priority, assignmentFilter, sortBy]);

    const handleCreateTicket = async (ticketData) => {
        const res = await fetch('/api/tickets', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ticketData)
        });
        const data = await res.json();
        if (data.success) {
            fetchMyTickets();
        } else {
            throw new Error(data.message || 'Failed to submit ticket');
        }
    };

    // Calculate metrics
    const totalCount = tickets.length;
    const openCount = tickets.filter(t => t.status === 'Open').length;
    const progressCount = tickets.filter(t => t.status === 'In_Progress').length;
    const resolvedCount = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;

    return (
        <main className="app-container">
            <div className="container">
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Welcome back, {user.name}</h1>
                        <p className="dashboard-subtitle">Employee Portal - Department: {user.department}</p>
                    </div>

                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                        <IconPlus size={18} /> Raise New Ticket
                    </button>
                </div>

                {/* Stat Cards */}
                <div className="stats-grid">
                    <StatCard title="Total Tickets" value={totalCount} color="#6366F1" icon={IconTicket} />
                    <StatCard title="Open Pending" value={openCount} color="#3B82F6" icon={IconClock} />
                    <StatCard title="In Progress" value={progressCount} color="#F59E0B" icon={IconClock} />
                    <StatCard title="Resolved" value={resolvedCount} color="#10B981" icon={IconCheckCircle} />
                </div>

                {/* Filter Toolbar */}
                <TicketFilter
                    search={search}
                    setSearch={setSearch}
                    category={category}
                    setCategory={setCategory}
                    status={status}
                    setStatus={setStatus}
                    priority={priority}
                    setPriority={setPriority}
                    assignmentFilter={assignmentFilter}
                    setAssignmentFilter={setAssignmentFilter}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    userRole="Employee"
                />

                {error && <div className="alert alert-error">{error}</div>}

                {/* Tickets Grid */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        Loading your tickets...
                    </div>
                ) : tickets.length === 0 ? (
                    <div style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '3rem',
                        textAlign: 'center',
                        color: 'var(--text-muted)'
                    }}>
                        <IconTicket size={48} style={{ color: 'var(--text-dim)', marginBottom: '1rem' }} />
                        <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>No Tickets Found</h3>
                        <p>You have not raised any IT support requests matching this filter criteria.</p>
                        <button className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }} onClick={() => setIsModalOpen(true)}>
                            <IconPlus size={16} /> Raise Ticket Now
                        </button>
                    </div>
                ) : (
                    <div className="tickets-grid">
                        {tickets.map((t) => (
                            <TicketCard
                                key={t.id}
                                ticket={t}
                                userRole="Employee"
                                onClick={onSelectTicket}
                            />
                        ))}
                    </div>
                )}

                {/* Modal Popup */}
                <TicketModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleCreateTicket}
                />
            </div>
        </main>
    );
}
