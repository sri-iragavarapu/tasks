import React from 'react';

export function StatusTimeline({ status }) {
    const steps = [
        { key: 'Open', label: 'Open' },
        { key: 'In_Progress', label: 'In Progress' },
        { key: 'Resolved', label: 'Resolved' },
        { key: 'Closed', label: 'Closed' }
    ];

    const getStepState = (stepKey) => {
        const order = ['Open', 'In_Progress', 'Resolved', 'Closed'];
        const currentIndex = order.indexOf(status);
        const stepIndex = order.indexOf(stepKey);

        if (stepIndex === currentIndex) return 'active';
        if (stepIndex < currentIndex) return 'completed';
        return 'pending';
    };

    return (
        <div className="status-timeline">
            {steps.map((step, idx) => {
                const state = getStepState(step.key);
                return (
                    <div key={step.key} className={`timeline-step ${state}`}>
                        <div className="timeline-node">
                            {state === 'completed' ? '✓' : idx + 1}
                        </div>
                        <span className="timeline-label">{step.label}</span>
                    </div>
                );
            })}
        </div>
    );
}
