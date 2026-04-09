import { createContext, useEffect, useState } from "react";
import axios from "../api/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchCurrentUser = async (accessToken) => {
        const res = await axios.get("/auth/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return res.data;
    };

    // Check localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem("user");
            }
        }

        const bootstrapAuth = async () => {
            if (!storedToken) {
                setLoading(false);
                return;
            }

            try {
                const currentUser = await fetchCurrentUser(storedToken);
                setToken(storedToken);
                setUser(currentUser);
                setIsAuthenticated(true)
            } catch {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setToken(null);
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        bootstrapAuth();
    }, []);

    // login function
    const login = async (identifier, password) => {
        try {
            const params = new URLSearchParams();
            params.append("username", identifier);
            params.append("password", password);

            const res = await axios.post("/auth/login", params);

            const { access_token } = res.data;

            // Save in state + localStorage
            localStorage.setItem("token", access_token);
            
            const currentUser = await fetchCurrentUser(access_token);
            setUser(currentUser);

            localStorage.setItem("user", JSON.stringify(currentUser));

            setToken(access_token);
            setIsAuthenticated(true);

        } catch (err) {
            console.error("Login failed:", err.response?.data || err.message);
            throw err
        }
    };

    // Logout function
    const logout = () => {
        setToken(null)
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    const updateUser = (nextUser) => {
        setUser(nextUser);
        if (nextUser) {
            localStorage.setItem("user", JSON.stringify(nextUser));
        } else {
            localStorage.removeItem("user");
        }
    };

    // Signup function
    const signup = async(email, username, password) => {
        try {
            // Call backend signup endpoint
            await axios.post("/auth/signup", { email, username, password });

        } catch(err) {
            console.error("Signup failed:", err.response?.data || err.message);
            throw err;
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, logout, signup, updateUser }}>
            {children}
        </AuthContext.Provider>
    )
}
