import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../../toast/toast.context'

const Login = () => {
    const { loading, handleLogin } = useAuth()
    const { toast } = useToast()
    const navigate  = useNavigate()

    const [email,    setEmail]    = useState("")
    const [password, setPassword] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email || !password) {
            toast.warning("Missing Fields", "Please enter your email and password.")
            return
        }
        setSubmitting(true)
        try {
            await handleLogin({ email, password })
            toast.success("Welcome back!", "You have logged in successfully.")
            navigate('/')
        } catch (err) {
            toast.error(
                "Login Failed",
                err?.response?.data?.message || err.message || "Invalid credentials. Please try again."
            )
        } finally {
            setSubmitting(false)
        }
    }

    if (loading && !submitting) {
        return (
            <main className="auth-page">
                <div className="auth-skeleton">
                    <div className="auth-skeleton__title" />
                    <div className="auth-skeleton__field" />
                    <div className="auth-skeleton__field" />
                    <div className="auth-skeleton__btn"   />
                </div>
            </main>
        )
    }

    return (
        <main className="auth-page">
            <div className="form-container">
                <div className="form-container__logo">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="var(--color-accent)">
                        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
                    </svg>
                    <span>AI Resume Builder</span>
                </div>

                <h1>Welcome back</h1>
                <p className="form-container__sub">Sign in to access your interview plans</p>

                <form onSubmit={handleSubmit} id="login-form" noValidate>
                    <div className="input-group">
                        <label htmlFor="login-email">Email</label>
                        <input
                            id="login-email"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="login-password">Password</label>
                        <input
                            id="login-password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        id="login-submit-btn"
                        className="button primary-button"
                        disabled={submitting}
                        style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem' }}
                    >
                        {submitting ? 'Signing in…' : 'Sign In'}
                    </button>
                </form>

                <p className="form-container__footer">
                    Don&apos;t have an account?{' '}
                    <Link to="/register">Create one</Link>
                </p>
            </div>
        </main>
    )
}

export default Login