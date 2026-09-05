import React, { useState, useEffect } from 'react';
import { IconSend } from '../assets/icons';

export function TicketChat({ ticketId, currentUser }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!error) return;
        const timer = window.setTimeout(() => setError(''), 4000);
        return () => window.clearTimeout(timer);
    }, [error]);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`/api/messages/${ticketId}`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) {
                setMessages(data.messages);
            }
        } catch (err) {
            console.error('Error loading chat messages:', err);
        }
    };

    useEffect(() => {
        if (ticketId) {
            setLoading(true);
            fetchMessages().finally(() => setLoading(false));

            // Auto-refresh chat every 4 seconds for responsive feel
            const interval = setInterval(fetchMessages, 4000);
            return () => clearInterval(interval);
        }
    }, [ticketId]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setSending(true);
        setError('');

        try {
            const res = await fetch(`/api/messages/${ticketId}`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: newMessage })
            });

            const data = await res.json();
            if (data.success) {
                setNewMessage('');
                fetchMessages();
            } else {
                setError(data.message || 'Failed to send message.');
            }
        } catch (err) {
            setError('Network error sending message.');
        } finally {
            setSending(false);
        }
    };

    const formatMsgTime = (dateStr) => {
        if (!dateStr) return '';
        // Ensure SQLite UTC string 'YYYY-MM-DD HH:MM:SS' is parsed as UTC ISO before converting to local timezone
        const utcStr = dateStr.includes('T') ? dateStr : dateStr.replace(' ', 'T') + 'Z';
        const parsedDate = new Date(utcStr);
        const dateObj = isNaN(parsedDate.getTime()) ? new Date(dateStr) : parsedDate;

        return dateObj.toLocaleString(undefined, {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="chat-container">
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                💬 Ticket Discussion & Resolution Thread
            </h4>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="chat-messages">
                {messages.length === 0 && !loading && (
                    <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '1.5rem', fontStyle: 'italic' }}>
                        No messages yet. Send a update or inquiry to start the conversation.
                    </div>
                )}

                {messages.map((msg) => {
                    const isMine = msg.sender_id === currentUser.id;
                    return (
                        <div key={msg.id} className={`chat-bubble ${isMine ? 'mine' : 'other'}`}>
                            <div className="chat-sender">
                                {msg.sender_name}
                                <span style={{ opacity: 0.75, fontSize: '0.65rem' }}>
                                    ({msg.sender_role === 'IT_Support' ? 'IT Support' : 'Employee'})
                                </span>
                            </div>
                            <div>{msg.message}</div>
                            <div className="chat-time">{formatMsgTime(msg.created_at)}</div>
                        </div>
                    );
                })}
            </div>

            <form onSubmit={handleSend} className="chat-input-bar">
                <input
                    id="chat-message-input"
                    name="chatMessage"
                    type="text"
                    className="form-input"
                    placeholder="Type your message or response here..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sending}
                    aria-label="Type your message or response here"
                />
                <button type="submit" className="btn btn-primary" disabled={sending || !newMessage.trim()}>
                    <IconSend size={16} /> {sending ? '...' : 'Send'}
                </button>
            </form>
        </div>
    );
}
