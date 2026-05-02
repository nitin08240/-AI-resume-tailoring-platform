import React from 'react'

// ── SkeletonCard ──────────────────────────────────────────────────────────────
// Used on the dashboard while reports are loading
export const SkeletonCard = () => (
    <div className="skeleton-card" aria-hidden="true">
        <div className="skeleton-card__title" />
        <div className="skeleton-card__line" />
        <div className="skeleton-card__line" />
        <div className="skeleton-card__line--short" />
    </div>
)

// ── SkeletonReport ────────────────────────────────────────────────────────────
// Used on the interview report page while the report is fetching
export const SkeletonReport = () => (
    <div className="skeleton-report" aria-hidden="true">
        <div className="skeleton-report__heading" />
        <div className="skeleton-report__sub" />

        {[1, 2, 3].map(i => (
            <div key={i} className="skeleton-report__block">
                <div className="skeleton-report__line" />
                <div className="skeleton-report__line--med" />
                <div className="skeleton-report__line" />
                <div className="skeleton-report__line--short" />
            </div>
        ))}
    </div>
)

// ── SkeletonStats ─────────────────────────────────────────────────────────────
// Used on the dashboard while stats are loading (3 cards)
export const SkeletonStats = () => (
    <div className="skeleton-stats" aria-hidden="true">
        {[1, 2, 3].map(i => (
            <div key={i} className="skeleton-stats__card">
                <div className="skeleton-stats__value" />
                <div className="skeleton-stats__label" />
            </div>
        ))}
    </div>
)
