import React from 'react';

export function StatCard({ title, value, color = '#6366F1', icon: Icon }) {
    return (
        <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: `${color}1F`, color }}>
                {Icon && <Icon size={24} />}
            </div>
            <div>
                <div className="stat-val" style={{ color }}>{value}</div>
                <div className="stat-lbl">{title}</div>
            </div>
        </div>
    );
}
