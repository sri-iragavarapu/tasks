import React from 'react';

export function ConfirmModal({ isOpen, title, message, confirmText = 'Delete', confirmVariant = 'danger', onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-confirm-title" onClick={onClose}>
            <div className="modal-content" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 id="modal-confirm-title">{title}</h3>
                    <button type="button" className="modal-close" onClick={onClose} aria-label="Close modal" title="Close modal">&times;</button>
                </div>

                <div className="modal-body">
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>{message}</p>
                </div>

                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button type="button" className={`btn btn-${confirmVariant}`} onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
