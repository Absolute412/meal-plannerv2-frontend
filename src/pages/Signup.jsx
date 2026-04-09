import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { toast } from "react-toastify";
import { getPasswordChecks, getPasswordStrength } from "../utils/password";

export const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordChecks = getPasswordChecks(password);
  const passwordStrength = getPasswordStrength(password);
  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error("Password does not meet all required rules.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      await signup(email.trim(), username.trim(), password)
      toast.success("Signup successful. Please log in.");
      navigate("/login", { replace: true });
    } catch (err) {toast.error(err.response?.data?.detail || "Signup failed");}
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-transparent px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-(--line) bg-(--surface-elevated) p-6 shadow-lg backdrop-blur transition duration-300 hover:shadow-xl">
        <h1 className="text-2xl font-bold text-(--text-main)">Create account</h1>
        <p className="mt-1 text-sm text-(--text-muted)">Start planning your meals in one place.</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <input 
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-(--line) bg-(--surface-elevated) px-3 py-2.5 text-sm text-(--text-main) outline-none transition duration-200 focus:-translate-y-0.5 focus:border-(--accent) focus:ring-4 focus:ring-[#f0c04033]"
          />

          <input 
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            className="w-full rounded-xl border border-(--line) bg-(--surface-elevated) px-3 py-2.5 text-sm text-(--text-main) outline-none transition duration-200 focus:-translate-y-0.5 focus:border-(--accent) focus:ring-4 focus:ring-[#f0c04033]"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-(--line) bg-(--surface-elevated) px-3 py-2.5 text-sm text-(--text-main) outline-none transition duration-200 focus:-translate-y-0.5 focus:border-(--accent) focus:ring-4 focus:ring-[#f0c04033]"
          />
          {/* Password strength indicator */}
          <div className="space-y-2">
            <div className="h-2 w-full overflow-hidden rounded-full bg-(--surface-muted)">
              <div
                className={`h-full ${passwordStrength.color} transition-all duration-300`}
                style={{ width: `${passwordStrength.percent}%` }}
              />
            </div>
            <p className="text-xs font-medium text-(--text-muted)">
              Password strength: <span className="text-(--text-main)">{passwordStrength.label}</span>
            </p>
            <ul className="grid grid-cols-2 gap-1 text-xs text-(--text-muted)">
              <li className={passwordChecks.minLength ? "text-(--accent-strong)" : ""}>8+ characters</li>
              <li className={passwordChecks.hasNumber ? "text-(--accent-strong)" : ""}>1 number</li>
              <li className={passwordChecks.hasUppercase ? "text-(--accent-strong)" : ""}>1 uppercase</li>
              <li className={passwordChecks.hasLowercase ? "text-(--accent-strong)" : ""}>1 lowercase</li>
            </ul>
          </div>

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-(--line) bg-(--surface-elevated) px-3 py-2.5 text-sm text-(--text-main) outline-none transition duration-200 focus:-translate-y-0.5 focus:border-(--accent) focus:ring-4 focus:ring-[#f0c04033]"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-(--accent) px-4 py-2.5 text-sm font-semibold text-[#2f2710] transition duration-200 hover:-translate-y-0.5 hover:bg-(--accent-strong)"
          >
            Signup
          </button>

          <p className="text-sm text-(--text-muted)">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-(--accent-strong) transition hover:text-[#bd9120]">
              Login
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
};


