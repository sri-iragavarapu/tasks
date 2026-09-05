import React, { useState, useEffect } from 'react';
import { StatCard } from '../components/StatCard';
import { TicketCard } from '../components/TicketCard';
import { TicketFilter } from '../components/TicketFilter';
import { IconTicket, IconClock, IconCheckCircle, IconUser } from '../assets/icons';

export function SupportDashboard({ user, onSelectTicket }) {
    const [tickets, setTickets] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [status, setStatus] = useState('All');
    const [priority, setPriority] = useState('All');
    const [assignmentFilter, setAssignmentFilter] = useState('All');
    const [sortBy, setSortBy] = useState('newest');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!error) return;
        const timer = window.setTimeout(() => setError(''), 4000);
        return () => window.clearTimeout(timer);
    }, [error]);

    const fetchAllTickets = async () => {
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
                setError(data.message || 'Failed to fetch company tickets.');
            }
        } catch (err) {
            setError('Could not connect to backend server.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllTickets();
    }, [search, category, status, priority, assignmentFilter, sortBy]);

    // Metrics
    const totalCount = tickets.length;
    const unassignedCount = tickets.filter(t => !t.assigned_to).length;
    const progressCount = tickets.filter(t => t.status === 'In_Progress').length;
    const resolvedCount = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;

    const isAdmin = user.role === 'Administrator';
    const welcomeTitle = `Welcome back, ${user.name}`;
    const welcomeSubtitle = isAdmin ? 'System Administration' : 'IT Support Portal';

    return (
        <main className="app-container">
            <div className="container">
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">{welcomeTitle}</h1>
                        <p className="dashboard-subtitle">{welcomeSubtitle}</p>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="stats-grid">
                    <StatCard title="Total Tickets" value={totalCount} color="#6366F1" icon={IconTicket} />
                    <StatCard title="Unassigned" value={unassignedCount} color="#EF4444" icon={IconClock} />
                    <StatCard title="In Progress" value={progressCount} color="#F59E0B" icon={IconUser} />
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
                    userRole={user.role}
                />

                {error && <div className="alert alert-error">{error}</div>}

                {/* Tickets Grid */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        Loading company tickets...
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
                        <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>No Matching Tickets</h3>
                        <p>There are no company IT tickets matching your current search and filter selections.</p>
                    </div>
                ) : (
                    <div className="tickets-grid">
                        {tickets.map((t) => (
                            <TicketCard
                                key={t.id}
                                ticket={t}
                                userRole={user.role}
                                onClick={onSelectTicket}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
