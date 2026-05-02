import React from 'react'
import { useNavigate } from 'react-router-dom'

// ── Inline SVG Illustration ───────────────────────────────────────────────────
const EmptySVG = () => (
    <svg
        width="120" height="120" viewBox="0 0 120 120"
        fill="none" xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        {/* Document shape */}
        <rect x="22" y="14" width="60" height="76" rx="6" fill="#1c2230" stroke="#2a3348" strokeWidth="2" />
        <rect x="32" y="30" width="40" height="4" rx="2" fill="#2a3348" />
        <rect x="32" y="40" width="32" height="4" rx="2" fill="#2a3348" />
        <rect x="32" y="50" width="36" height="4" rx="2" fill="#2a3348" />
        <rect x="32" y="60" width="24" height="4" rx="2" fill="#2a3348" />

        {/* Folded corner */}
        <path d="M62 14 L82 34 L62 34 Z" fill="#161b22" stroke="#2a3348" strokeWidth="1.5" />

        {/* Sparkle 1 */}
        <path d="M90 30 L92 36 L98 38 L92 40 L90 46 L88 40 L82 38 L88 36 Z"
              fill="#ff2d78" opacity="0.9" />
        {/* Sparkle 2 - small */}
        <path d="M18 55 L19.2 58.2 L22.4 59.4 L19.2 60.6 L18 63.8 L16.8 60.6 L13.6 59.4 L16.8 58.2 Z"
              fill="#ff6b9d" opacity="0.7" />
        {/* Sparkle 3 - tiny */}
        <circle cx="95" cy="70" r="2.5" fill="#ff2d78" opacity="0.5" />
        <circle cx="14" cy="34" r="2"   fill="#ff6b9d" opacity="0.4" />

        {/* Question mark in doc */}
        <text x="38" y="78" fontFamily="Inter, sans-serif" fontSize="26" fontWeight="800" fill="#2a3348">?</text>
    </svg>
)

// ── Component ─────────────────────────────────────────────────────────────────
const EmptyState = () => {
    const navigate = useNavigate()

    return (
        <div className="empty-state-container" id="empty-state">
            <EmptySVG />
            <h2 className="empty-state-container__heading">No reports yet</h2>
            <p className="empty-state-container__sub">
                Upload your resume and a job description to get started.
            </p>
            <button
                id="empty-state-cta"
                className="generate-btn"
                onClick={() => navigate('/')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                </svg>
                Create Your First Report
            </button>
        </div>
    )
}

export default EmptyState
