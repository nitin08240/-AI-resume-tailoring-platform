import React, { useState } from 'react'
import { useToast } from '../toast/toast.context'

// ── Icons ─────────────────────────────────────────────────────────────────────
const icons = {
    success: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" />
        </svg>
    ),
    error: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
        </svg>
    ),
    warning: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    ),
    info: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    ),
}

const closeIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)

// ── Single Toast ──────────────────────────────────────────────────────────────
const Toast = ({ toast }) => {
    const { removeToast } = useToast()
    const [leaving, setLeaving]  = useState(false)

    const handleClose = () => {
        setLeaving(true)
        setTimeout(() => removeToast(toast.id), 220)
    }

    return (
        <div
            className={`toast toast--${toast.type}${leaving ? ' toast--leaving' : ''}`}
            role="alert"
            aria-live="polite"
        >
            <span className="toast__icon">{icons[toast.type]}</span>
            <div className="toast__body">
                {toast.title   && <span className="toast__title">{toast.title}</span>}
                {toast.message && <span className="toast__message">{toast.message}</span>}
            </div>
            <button className="toast__close" onClick={handleClose} aria-label="Dismiss">
                {closeIcon}
            </button>
        </div>
    )
}

// ── Container ─────────────────────────────────────────────────────────────────
const ToastContainer = () => {
    const { toasts } = useToast()

    return (
        <div className="toast-container" aria-label="Notifications">
            {toasts.map(t => <Toast key={t.id} toast={t} />)}
        </div>
    )
}

export default ToastContainer
