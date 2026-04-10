import { useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import { useProfile } from "../hooks/useProfile"

export const Profile = () => {
  const { user, updateProfile, updatePassword } = useProfile();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [initialUsername, setInitialUsername] = useState("");
  const [initialEmail, setInitialEmail] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!user) return;
    setUsername(user.username || "");
    setEmail(user.email || "");
    setInitialUsername(user.username || "");
    setInitialEmail(user.email || "");
  }, [user]);

  const avatarLabel = useMemo(() => {
    const base = (username || user?.username || user?.email || "").trim();
    return base ? base.charAt(0).toUpperCase() : "?";
  }, [username, user]);

  const isProfileDirty = useMemo(() => {
    return username.trim() !== initialUsername.trim() || email.trim() !== initialEmail.trim();
  }, [username, email, initialUsername, initialEmail]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!isProfileDirty) return;

    const payload = {};
    if (username.trim() !== initialUsername.trim()) payload.username = username.trim();
    if (email.trim() !== initialEmail.trim()) payload.email = email.trim();
    if (!payload.email && !payload.username) return;

    try {
      setSavingProfile(true);
      const data = await updateProfile(payload);
      setInitialUsername(data.username || "");
      setInitialEmail(data.email || "");
      toast.success("Profile updated");
    } catch (err) {
      const message = err?.response?.data?.detail || "Could not update profile.";
      toast.error(message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      setSavingPassword(true);
      await updatePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated");
    } catch (err) {
      const message = err?.response?.data?.detail || "Could not update password.";
      toast.error(message);
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
        <h1 className="text-2xl font-bold text-(--text-main)">My profile</h1>

        <div className="rounded-3xl border border-(--line) bg-(--surface-elevated) relative overflow-hidden flex items-center gap-4 p-4 shadow-sm sm:p-6">
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-(--accent-soft) opacity-70 blur-3xl" />
          <div className="pointer-events-none absolute -left-10 -bottom-14 h-32 w-32 rounded-full bg-(--accent) opacity-15 blur-3xl" />
          <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-(--accent-soft) text-2xl font-bold text-(--text-main)">
            {avatarLabel}
          </div>
          <div className="flex flex-col text-left">
            <h1 className="text-xl font-bold text-(--text-main)">{user?.username || "Username"}</h1>
            <p className="text-sm font-semibold text-(--text-muted)">{user?.email || "Email"}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-(--line) bg-(--surface-elevated) p-4 shadow-sm sm:p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-(--text-main)">Edit profile</h2>
            <p className="text-sm text-(--text-muted)">Update your account details.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSaveProfile}>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-(--text-muted)">Username</label>
              <input 
                type="text"
                placeholder="Update username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="
                  w-full rounded-xl border border-(--line) bg-(--surface-elevated) px-3 py-2.5 text-sm text-(--text-main) 
                  outline-none transition duration-200 focus:-translate-y-0.5 focus:border-(--accent) focus:ring-4
                  focus:ring-[#f0c04033]
                "
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-(--text-muted)">Email</label>
              <input 
                type="email"
                placeholder="Update email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-full rounded-xl border border-(--line) bg-(--surface-elevated) px-3 py-2.5 text-sm text-(--text-main) 
                  outline-none transition duration-200 focus:-translate-y-0.5 focus:border-(--accent) focus:ring-4
                  focus:ring-[#f0c04033]
                "
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!isProfileDirty || savingProfile}
                className="
                  rounded-xl bg-(--accent) px-4 py-2.5 text-sm font-semibold 
                  text-[#2f2710] transition duration-200 hover:-translate-y-0.5 hover:bg-(--accent-strong)
                  disabled:cursor-not-allowed disabled:opacity-60
                "
              >
                {savingProfile ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-3xl border border-(--line) bg-(--surface-elevated) p-4 shadow-sm sm:p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-(--text-main)">Change password</h2>
            <p className="text-sm text-(--text-muted)">
              Password must be 8+ characters and include uppercase, lowercase, and a number.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleUpdatePassword}>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-(--text-muted)">Current password</label>
              <input 
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="
                  w-full rounded-xl border border-(--line) bg-(--surface-elevated) px-3 py-2.5 text-sm text-(--text-main) 
                  outline-none transition duration-200 focus:-translate-y-0.5 focus:border-(--accent) focus:ring-4
                  focus:ring-[#f0c04033]
                "
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-(--text-muted)">New password</label>
              <input 
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="
                  w-full rounded-xl border border-(--line) bg-(--surface-elevated) px-3 py-2.5 text-sm text-(--text-main) 
                  outline-none transition duration-200 focus:-translate-y-0.5 focus:border-(--accent) focus:ring-4
                  focus:ring-[#f0c04033]
                "
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-(--text-muted)">Confirm new password</label>
              <input 
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="
                  w-full rounded-xl border border-(--line) bg-(--surface-elevated) px-3 py-2.5 text-sm text-(--text-main) 
                  outline-none transition duration-200 focus:-translate-y-0.5 focus:border-(--accent) focus:ring-4
                  focus:ring-[#f0c04033]
                "
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingPassword}
                className="
                  rounded-xl border border-(--line) bg-(--surface) px-4 py-2.5 text-sm font-semibold
                  text-(--text-main) transition duration-200 hover:-translate-y-0.5 hover:bg-(--surface-muted)
                  disabled:cursor-not-allowed disabled:opacity-60
                "
              >
                {savingPassword ? "Updating..." : "Update password"}
              </button>
            </div>
          </form>
        </div>
    </div>
  )
}
