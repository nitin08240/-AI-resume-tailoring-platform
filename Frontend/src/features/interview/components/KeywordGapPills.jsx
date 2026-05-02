import React from 'react'

// ── Keyword Severity Classifier ───────────────────────────────────────────────
// The AI report returns skillGaps with { skill, severity: 'high'|'medium'|'low' }
// High   = missing        → red pill
// Medium = partial        → amber pill
// Low    = present        → green pill

const SEVERITY_META = {
    high:   { label: 'Missing',  className: 'skill-tag skill-tag--high'   },
    medium: { label: 'Partial',  className: 'skill-tag skill-tag--medium' },
    low:    { label: 'Present',  className: 'skill-tag skill-tag--low'    },
}

// ── Component ─────────────────────────────────────────────────────────────────
const KeywordGapPills = ({ skillGaps }) => {
    if (!skillGaps || skillGaps.length === 0) {
        return (
            <p className="empty-state" style={{ fontSize: '0.85rem' }}>
                No keyword gaps identified.
            </p>
        )
    }

    // Group by severity
    const grouped = {
        high:   skillGaps.filter(g => g.severity === 'high'),
        medium: skillGaps.filter(g => g.severity === 'medium'),
        low:    skillGaps.filter(g => g.severity === 'low'),
    }

    return (
        <div className="keyword-gaps" id="keyword-gap-pills">
            {Object.entries(grouped).map(([sev, items]) => {
                if (items.length === 0) return null
                const meta = SEVERITY_META[sev]
                return (
                    <div key={sev} className="keyword-gaps__group">
                        <span className="keyword-gaps__group-label">{meta.label}</span>
                        <div className="skill-gaps__list">
                            {items.map((gap, i) => (
                                <span key={i} className={meta.className} title={`Severity: ${sev}`}>
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default KeywordGapPills
