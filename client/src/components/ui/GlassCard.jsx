export default function GlassCard({ children, className = "", hover = false }) {
  return (
    <div className={`glass p-6 ${hover ? "glass-hover" : ""} ${className}`}>
      {children}
    </div>
  );
}
