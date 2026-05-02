import React from 'react'

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatCount = (n) => (n !== undefined && n !== null ? String(n) : '—')

const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-US', {
        day: 'numeric', month: 'short', year: 'numeric'
    })
}

const getLatestScore = (reports) => {
    if (!reports || reports.length === 0) return null
    const sorted = [...reports].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )
    return sorted[0]?.matchScore ?? null
}

const getLastActivity = (reports) => {
    if (!reports || reports.length === 0) return null
    const sorted = [...reports].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )
    return sorted[0]?.createdAt ?? null
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, color }) => (
    <div className="stat-card" id={`stat-card-${label.toLowerCase().replace(/\s+/g, '-')}`}>
        <div className="stat-card__icon" style={{ color }}>{icon}</div>
        <div className="stat-card__body">
            <span className="stat-card__value" style={{ color: value === '—' ? 'var(--color-text-muted)' : undefined }}>
                {value}
            </span>
            <span className="stat-card__label">{label}</span>
        </div>
    </div>
)

// ── Icons ─────────────────────────────────────────────────────────────────────
const ReportsIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
)

const ScoreIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
)

const CalendarIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
)

// ── Main Component ────────────────────────────────────────────────────────────
const DashboardStats = ({ reports }) => {
    const latestScore = getLatestScore(reports)
    const lastActivity = getLastActivity(reports)

    const scoreColor =
        latestScore === null ? 'var(--color-text-muted)' :
        latestScore >= 70    ? 'var(--color-success)' :
        latestScore >= 40    ? 'var(--color-warning)' :
                               'var(--color-error)'

    return (
        <div className="dashboard-stats" id="dashboard-stats">
            <StatCard
                icon={<ReportsIcon />}
                label="Total Reports"
                value={formatCount(reports?.length)}
                color="var(--color-accent)"
            />
            <StatCard
                icon={<ScoreIcon />}
                label="Latest Match Score"
                value={latestScore !== null ? `${latestScore}%` : '—'}
                color={scoreColor}
            />
            <StatCard
                icon={<CalendarIcon />}
                label="Last Activity"
                value={formatDate(lastActivity)}
                color="var(--color-info)"
            />
        </div>
    )
}

export default DashboardStats
