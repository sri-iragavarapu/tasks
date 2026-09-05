import React from 'react';
import { IconSearch } from '../assets/icons';

export function TicketFilter({
    search,
    setSearch,
    category,
    setCategory,
    status,
    setStatus,
    priority,
    setPriority,
    assignmentFilter,
    setAssignmentFilter,
    sortBy,
    setSortBy,
    userRole
}) {
    const isSupportOrAdmin = userRole === 'IT_Support' || userRole === 'Administrator';

    return (
        <div className="filter-toolbar">
            <div className="search-box">
                <IconSearch className="search-icon" />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search by Ticket ID, Subject or Keyword..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search tickets by ID, subject or keyword"
                />
            </div>

            <div className="filter-group">
                {setAssignmentFilter && (
                    <select
                        className="form-select"
                        style={{ width: 'auto' }}
                        value={assignmentFilter}
                        onChange={(e) => setAssignmentFilter(e.target.value)}
                        aria-label="Filter tickets by view"
                    >
                        <option value="All">All Tickets</option>
                        {isSupportOrAdmin ? (
                            <>
                                <option value="Assigned_To_Me">Assigned to Me</option>
                                <option value="Unassigned">Unassigned</option>
                            </>
                        ) : (
                            <option value="My_Tickets">My Created Tickets</option>
                        )}
                    </select>
                )}

                <select
                    className="form-select"
                    style={{ width: 'auto' }}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    aria-label="Filter tickets by category"
                >
                    <option value="All">All Categories</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Software">Software</option>
                    <option value="Network">Network</option>
                    <option value="Access & Security">Access & Security</option>
                    <option value="Other">Other</option>
                </select>

                <select
                    className="form-select"
                    style={{ width: 'auto' }}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    aria-label="Filter tickets by status"
                >
                    <option value="All">All Statuses</option>
                    <option value="Open">Open</option>
                    <option value="In_Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                </select>

                {setPriority && (
                    <select
                        className="form-select"
                        style={{ width: 'auto' }}
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        aria-label="Filter tickets by priority"
                    >
                        <option value="All">All Priorities</option>
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                )}

                {setSortBy && (
                    <select
                        className="form-select"
                        style={{ width: 'auto' }}
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        aria-label="Sort tickets by"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                )}
            </div>
        </div>
    );
}
