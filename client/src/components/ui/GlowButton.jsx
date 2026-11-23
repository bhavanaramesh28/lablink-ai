import { Link } from "react-router-dom";

const styles = {
  primary:
    "bg-gradient-to-r from-cyan-glow to-violet-glow text-base font-semibold shadow-[0_0_24px_rgba(0,217,255,0.35)] hover:shadow-[0_0_36px_rgba(139,92,246,0.55)]",
  ghost:
    "border border-white/15 text-white hover:border-cyan-glow/60 hover:bg-white/5",
};

export default function GlowButton({
  children, to, onClick, variant = "primary", className = "", type = "button", disabled = false,
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm
    transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed
    ${styles[variant]} ${className}`;

  if (to) return <Link to={to} className={classes}>{children}</Link>;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
