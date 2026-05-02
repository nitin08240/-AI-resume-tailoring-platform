import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../../toast/toast.context'

const Register = () => {
    const { loading, handleRegister } = useAuth()
    const { toast } = useToast()
    const navigate  = useNavigate()

    const [username,   setUsername]   = useState("")
    const [email,      setEmail]      = useState("")
    const [password,   setPassword]   = useState("")
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!username || !email || !password) {
            toast.warning("Missing Fields", "Please fill in all fields.")
            return
        }
        if (password.length < 6) {
            toast.warning("Weak Password", "Password must be at least 6 characters.")
            return
        }
        setSubmitting(true)
        try {
            await handleRegister({ username, email, password })
            toast.success("Account Created!", "Welcome to AI Resume Builder.")
            navigate("/")
        } catch (err) {
            toast.error(
                "Registration Failed",
                err?.response?.data?.message || err.message || "Could not create account. Please try again."
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

                <h1>Create account</h1>
                <p className="form-container__sub">Join to get your AI-powered interview strategy</p>

                <form onSubmit={handleSubmit} id="register-form" noValidate>
                    <div className="input-group">
                        <label htmlFor="reg-username">Username</label>
                        <input
                            id="reg-username"
                            type="text"
                            name="username"
                            placeholder="johndoe"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            autoComplete="username"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="reg-email">Email</label>
                        <input
                            id="reg-email"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="reg-password">Password</label>
                        <input
                            id="reg-password"
                            type="password"
                            name="password"
                            placeholder="Min. 6 characters"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            autoComplete="new-password"
                        />
                    </div>

                    <button
                        id="register-submit-btn"
                        className="button primary-button"
                        disabled={submitting}
                        style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem' }}
                    >
                        {submitting ? 'Creating account…' : 'Create Account'}
                    </button>
                </form>

                <p className="form-container__footer">
                    Already have an account?{' '}
                    <Link to="/login">Sign in</Link>
                </p>
            </div>
        </main>
    )
}

export default Register