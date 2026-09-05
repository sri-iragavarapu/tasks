import React, { useState, useEffect } from 'react';
import { IconPlus } from '../assets/icons';

export function TicketModal({ isOpen, onClose, onSubmit }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Hardware');
    const [priority, setPriority] = useState('Medium');
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!error) return;
        const timer = window.setTimeout(() => setError(''), 4000);
        return () => window.clearTimeout(timer);
    }, [error]);

    if (!isOpen) return null;

    const validateForm = () => {
        const errors = {};
        const trimmedTitle = title.trim();
        const trimmedDesc = description.trim();

        if (!trimmedTitle) {
            errors.title = 'Ticket Subject is required.';
        } else if (trimmedTitle.length < 5) {
            errors.title = 'Subject must be at least 5 characters long.';
        }

        if (!trimmedDesc) {
            errors.description = 'Problem Description is required.';
        } else if (trimmedDesc.length < 10) {
            errors.description = 'Description must be at least 10 characters long.';
        }

        if (!category) {
            errors.category = 'Please select a category.';
        }

        if (!priority) {
            errors.priority = 'Please select a priority.';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            await onSubmit({ title: title.trim(), description: description.trim(), category, priority });
            setTitle('');
            setDescription('');
            setCategory('Hardware');
            setPriority('Medium');
            setFieldErrors({});
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to submit ticket.');
        } finally {
            setLoading(false);
        }
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
        if (fieldErrors.title) setFieldErrors(prev => ({ ...prev, title: '' }));
        if (error) setError('');
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
        if (fieldErrors.description) setFieldErrors(prev => ({ ...prev, description: '' }));
        if (error) setError('');
    };

    return (
        <div className="modal-overlay" role="dialog" aria-labelledby="modal-ticket-title" aria-modal="true">
            <div className="modal-content">
                <div className="modal-header">
                    <h3 id="modal-ticket-title"><IconPlus size={20} /> Raise IT Support Ticket</h3>
                    <button className="modal-close" onClick={onClose} aria-label="Close modal">&times;</button>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="modal-body">
                        {error && <div className="alert alert-error">{error}</div>}

                        <div className="form-group">
                            <label htmlFor="ticket-title-input">Ticket Subject / Short Title *</label>
                            <input
                                id="ticket-title-input"
                                name="title"
                                type="text"
                                className={`form-input ${fieldErrors.title ? 'input-error' : ''}`}
                                placeholder="e.g. VPN issue, Printer issue, Outlook not opening..."
                                value={title}
                                onChange={handleTitleChange}
                                list="ticket-title-suggestions"
                                required
                            />
                            <datalist id="ticket-title-suggestions">
                                <option value="VPN issue" />
                                <option value="Printer issue" />
                                <option value="Outlook not opening" />
                                <option value="Password reset" />
                                <option value="Software installation" />
                                <option value="Internet issue" />
                                <option value="System running slow" />
                                <option value="Blue screen" />
                            </datalist>

                            {fieldErrors.title && (
                                <span style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: '0.25rem', display: 'block' }}>
                                    {fieldErrors.title}
                                </span>
                            )}
                        </div>

                        <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label htmlFor="ticket-category-select">Category *</label>
                                <select
                                    id="ticket-category-select"
                                    name="category"
                                    className="form-select"
                                    value={category}
                                    onChange={(e) => {
                                        setCategory(e.target.value);
                                        if (fieldErrors.category) setFieldErrors(prev => ({ ...prev, category: '' }));
                                    }}
                                    required
                                >
                                    <option value="Hardware">Hardware</option>
                                    <option value="Software">Software</option>
                                    <option value="Network">Network</option>
                                    <option value="Access & Security">Access & Security</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="ticket-priority-select">Priority Level *</label>
                                <select
                                    id="ticket-priority-select"
                                    name="priority"
                                    className="form-select"
                                    value={priority}
                                    onChange={(e) => {
                                        setPriority(e.target.value);
                                        if (fieldErrors.priority) setFieldErrors(prev => ({ ...prev, priority: '' }));
                                    }}
                                    required
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="ticket-description-input">Detailed Problem Description *</label>
                            <textarea
                                id="ticket-description-input"
                                name="description"
                                className={`form-textarea ${fieldErrors.description ? 'input-error' : ''}`}
                                placeholder="Please describe what happened, error messages, and steps to reproduce (min 10 characters)..."
                                value={description}
                                onChange={handleDescriptionChange}
                                required
                            />
                            {fieldErrors.description && (
                                <span style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: '0.25rem', display: 'block' }}>
                                    {fieldErrors.description}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Ticket'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
