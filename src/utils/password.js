// Signup password strength
export const getPasswordChecks = (password) => ({
  minLength: password.length >= 8,
  hasNumber: /\d/.test(password),
  hasUppercase: /[A-Z]/.test(password),
  hasLowercase: /[a-z]/.test(password),
});

export const getPasswordStrength = (password) => {
  if (!password) {
      return { label: "No password", percent: 0, color: "bg-(--surface-muted)" };
  }

  const checks = getPasswordChecks(password);
  let score = Object.values(checks).filter(Boolean).length;

  if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
  }

    const levels = [
      { label: "Very weak", color: "bg-rose-500" },
      { label: "Weak", color: "bg-orange-500" },
      { label: "Fair", color: "bg-amber-500" },
      { label: "Good", color: "bg-(--accent-strong)" },
      { label: "Strong", color: "bg-(--accent)" },
  ];

  const index = Math.min(Math.max(score - 1, 0), levels.length - 1);
  return {
      label: levels[index].label,
      percent: (score / 5) * 100,
      color: levels[index].color,
  };
};