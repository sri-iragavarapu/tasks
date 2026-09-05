import React from 'react';

export function TicketCard({ ticket, onClick, userRole }) {
    const formattedId = `TF-${String(ticket.id).padStart(4, '0')}`;

    const getStatusClass = (st) => {
        switch (st) {
            case 'Open': return 'badge-open';
            case 'In_Progress': return 'badge-in_progress';
            case 'Resolved': return 'badge-resolved';
            case 'Closed': return 'badge-closed';
            default: return 'badge-open';
        }
    };

    const getPriorityClass = (pr) => {
        switch (pr) {
            case 'Critical': return 'prio-critical';
            case 'High': return 'prio-high';
            case 'Medium': return 'prio-medium';
            case 'Low': return 'prio-low';
            default: return 'prio-medium';
        }
    };

    const formatStatusLabel = (st) => {
        return st.replace('_', ' ');
    };

    const formattedDate = new Date(ticket.created_at).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const cleanAssigneeName = (name) => {
        if (!name) return '';
        return name.replace(/IT Helpdesk \((.*?)\)/i, '$1');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(ticket.id);
        }
    };

    return (
        <article
            className="ticket-card"
            role="button"
            tabIndex={0}
            onClick={() => onClick(ticket.id)}
            onKeyDown={handleKeyDown}
            aria-label={`View details for ticket ${formattedId}: ${ticket.title}`}
        >
            <div>
                <div className="ticket-card-header">
                    <span className="ticket-number">{formattedId}</span>
                    <span className={`badge ${getStatusClass(ticket.status)}`}>
                        {formatStatusLabel(ticket.status)}
                    </span>
                </div>

                <h3 className="ticket-card-title">{ticket.title}</h3>
                <p className="ticket-card-desc">{ticket.description}</p>
            </div>

            <div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
                    <span className="category-tag">{ticket.category}</span>
                    <span className={`priority-pill ${getPriorityClass(ticket.priority)}`}>
                        {ticket.priority} Priority
                    </span>
                </div>

                <div className="ticket-card-footer">
                    <span>{(userRole === 'IT_Support' || userRole === 'Administrator') ? `By: ${ticket.creator_name || 'Employee'}` : `Created: ${formattedDate}`}</span>
                    <span style={{ color: ticket.assignee_name ? 'var(--primary)' : 'var(--warning)' }}>
                        {ticket.assignee_name ? `Assigned To: ${cleanAssigneeName(ticket.assignee_name)}` : 'Unassigned'}
                    </span>
                </div>
            </div>
        </article>
    );
}
