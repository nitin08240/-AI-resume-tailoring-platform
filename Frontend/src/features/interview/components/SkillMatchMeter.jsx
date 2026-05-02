import React from 'react'

// ── SVG Circular Gauge ────────────────────────────────────────────────────────
const SkillMatchMeter = ({ score }) => {
    const size     = 120
    const stroke   = 9
    const radius   = (size - stroke) / 2
    const circumference = 2 * Math.PI * radius
    const validScore = typeof score === 'number' && !isNaN(score)
    const pct        = validScore ? Math.min(100, Math.max(0, score)) : 0
    const dashOffset = circumference - (pct / 100) * circumference

    const color =
        !validScore    ? 'var(--color-text-muted)' :
        score >= 70    ? 'var(--color-success)'     :
        score >= 40    ? 'var(--color-warning)'     :
                         'var(--color-error)'

    return (
        <div className="skill-meter" id="skill-match-meter" aria-label={`Match score: ${validScore ? score + '%' : 'unknown'}`}>
            <p className="skill-meter__label">JD Match Score</p>

            <div className="skill-meter__gauge-wrap">
                <svg
                    width={size} height={size}
                    viewBox={`0 0 ${size} ${size}`}
                    className="skill-meter__svg"
                    role="img"
                >
                    {/* Track */}
                    <circle
                        cx={size / 2} cy={size / 2} r={radius}
                        fill="none"
                        stroke="var(--color-border)"
                        strokeWidth={stroke}
                    />
                    {/* Progress arc */}
                    <circle
                        cx={size / 2} cy={size / 2} r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}     // dynamic — inline style OK
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                        style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1), stroke 0.4s ease' }}
                    />
                </svg>

                {/* Center label */}
                <div className="skill-meter__center">
                    <span className="skill-meter__score" style={{ color }}>
                        {validScore ? score : '–'}
                    </span>
                    {validScore && <span className="skill-meter__pct">%</span>}
                </div>
            </div>

            <p className="skill-meter__sub" style={{ color }}>
                {!validScore    ? 'Score unavailable' :
                 score >= 70    ? 'Strong match ✓'     :
                 score >= 40    ? 'Moderate match'     :
                                  'Needs improvement'}
            </p>
        </div>
    )
}

export default SkillMatchMeter
