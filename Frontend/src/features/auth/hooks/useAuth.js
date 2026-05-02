import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";



export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context


    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            if (!email || !password) {
                throw new Error("Email and password are required")
            }
            const data = await login({ email, password })
            if (!data || !data.user) {
                throw new Error("Failed to login")
            }
            setUser(data.user)
            return data.user
        } catch (err) {
            console.error("Login error:", err)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            if (!username || !email || !password) {
                throw new Error("Username, email and password are required")
            }
            const data = await register({ username, email, password })
            if (!data || !data.user) {
                throw new Error("Failed to register")
            }
            setUser(data.user)
            return data.user
        } catch (err) {
            console.error("Register error:", err)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
        } catch (err) {
            console.error("Logout error:", err)
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {

        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                setUser(data.user)
            } catch (err) {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        getAndSetUser()

    }, [])

    return { user, loading, handleRegister, handleLogin, handleLogout }
}