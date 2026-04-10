import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"
import { useState } from "react";
import { toast } from "react-toastify";
import { useSettings } from "../hooks/useSettings";
import { getDefaultRoute } from "../utils/defaultRoute";

export const Login = () => {
    const { login } = useAuth();
    const { defaultView } = useSettings();

    const defaultRoute = getDefaultRoute(defaultView);
    const navigate = useNavigate();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (submitting) return;
    
        try {
            const cleanIdentifier = identifier.trim();

            if (!cleanIdentifier || !password.trim()) {
                toast.error("Fields cannot be empty");
                return;
            }

            setSubmitting(true);

            await login(cleanIdentifier, password);
            toast.success("Login successful");
            setTimeout(() => {
                navigate(defaultRoute, { replace: true });
            }, 800);
        } catch (err) {
            const message = err.response?.data?.detail || err.response?.data || "Login failed";
            toast.error(typeof message === "string" ? message : "Login failed");
        } finally {
            setSubmitting(false);
        }
    };

  return (
    <main className="flex min-h-screen items-center justify-center bg-transparent px-4 py-10">
        <div className="
            w-full max-w-md rounded-2xl border border-(--line) bg-(--surface-elevated) p-6 shadow-lg 
            backdrop-blur transition duration-300 hover:shadow-xl
        ">
            <h1 className="text-2xl font-bold text-(--text-main)">Welcome back</h1>
            <p className="mt-1 text-sm text-(--text-muted)">Log in to continue planning your meals.</p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <input 
                    type="text" 
                    placeholder="Enter email or username"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    required
                    className="
                        w-full rounded-xl border border-(--line) bg-(--surface-elevated) px-3 py-2.5 text-sm text-(--text-main) 
                        outline-none transition duration-200 focus:-translate-y-0.5 focus:border-(--accent) focus:ring-4
                        focus:ring-[#f0c04033]
                    "
                />
                <input 
                    type="password" 
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="
                        w-full rounded-xl border border-(--line) bg-(--surface-elevated) px-3 py-2.5 text-sm text-(--text-main) 
                        outline-none transition duration-200 focus:-translate-y-0.5 focus:border-(--accent) focus:ring-4
                        focus:ring-[#f0c04033]
                    "
                />
                <button 
                    type="submit"
                    disabled={submitting}
                    className="
                    w-full rounded-xl bg-(--accent) px-4 py-2.5 text-sm font-semibold 
                    text-[#2f2710] transition duration-200 hover:-translate-y-0.5 
                    hover:bg-(--accent-strong) disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? "Logging in..." : "Login"}
                </button>
                <p className="text-sm text-(--text-muted)">
                    Not a member?
                    <Link 
                        to="/signup"
                        className="ml-1 font-semibold text-(--accent-strong) transition hover:text-[#bd9120]"
                    >
                        Sign up now
                    </Link>
                </p>
            </form>
        </div>
    </main>
  )
}

