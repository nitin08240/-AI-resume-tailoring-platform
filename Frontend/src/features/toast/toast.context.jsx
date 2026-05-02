import React, { createContext, useContext, useReducer, useCallback } from 'react'

// ── Context ───────────────────────────────────────────────────────────────────
export const ToastContext = createContext(null)

// ── Reducer ───────────────────────────────────────────────────────────────────
const toastReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TOAST':
            return [...state, action.payload]
        case 'REMOVE_TOAST':
            return state.filter(t => t.id !== action.payload)
        default:
            return state
    }
}

// ── Provider ──────────────────────────────────────────────────────────────────
export const ToastProvider = ({ children }) => {
    const [toasts, dispatch] = useReducer(toastReducer, [])

    const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
        dispatch({ type: 'ADD_TOAST', payload: { id, type, title, message } })

        // Auto-dismiss
        setTimeout(() => {
            dispatch({ type: 'REMOVE_TOAST', payload: id })
        }, duration)

        return id
    }, [])

    const removeToast = useCallback((id) => {
        dispatch({ type: 'REMOVE_TOAST', payload: id })
    }, [])

    // Convenience helpers
    const toast = {
        success: (title, message) => addToast({ type: 'success', title, message }),
        error:   (title, message) => addToast({ type: 'error',   title, message }),
        warning: (title, message) => addToast({ type: 'warning', title, message }),
        info:    (title, message) => addToast({ type: 'info',    title, message }),
    }

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast, toast }}>
            {children}
        </ToastContext.Provider>
    )
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export const useToast = () => {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
    return ctx
}
