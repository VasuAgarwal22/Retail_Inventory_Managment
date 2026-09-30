import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/client";
import { decodeToken, isTokenValid } from "../utils/jwt";

const AuthContext = createContext(null);
const TOKEN_KEY = "token";

function readStoredToken() {
    const stored = localStorage.getItem(TOKEN_KEY);
    return isTokenValid(stored) ? stored : null;
}

export function AuthProvider({ children }) {
    const [token, setToken] = useState(readStoredToken);
    const [user, setUser] = useState(null);

    // Backend JWT only carries the email (subject), so it's the identity we trust here.
    const email = token ? decodeToken(token)?.sub : null;

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
    };

    // Load full profile (name, roles) once we have a token.
    useEffect(() => {
        if (!token) return;
        let cancelled = false;

        authApi
            .getAllUsers(token)
            .then((users) => {
                if (!cancelled) setUser(users.find((u) => u.email === email) ?? null);
            })
            .catch((err) => {
                if (err.status === 401 || err.status === 403) logout();
            });

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    // Auto-logout when the 2h token expires.
    useEffect(() => {
        if (!token) return;
        const msLeft = decodeToken(token).exp * 1000 - Date.now();
        const timer = setTimeout(logout, Math.max(msLeft, 0));
        return () => clearTimeout(timer);
    }, [token]);

    const login = async (emailInput, password) => {
        const { token: newToken } = await authApi.login(emailInput, password);
        localStorage.setItem(TOKEN_KEY, newToken);
        setToken(newToken);
    };

    const register = (payload) => authApi.register(payload);

    return (
        <AuthContext.Provider
            value={{ token, user, email, isAuthenticated: !!token, login, register, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}
