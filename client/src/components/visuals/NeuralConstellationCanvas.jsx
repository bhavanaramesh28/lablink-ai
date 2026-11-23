import { useEffect, useRef } from "react";

export default function NeuralConstellationCanvas({
  variant = "hero", // 'hero' | 'neural' | 'subtle' | 'analytics'
  className = "",
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Node count based on variant and screen size
    const isMobile = width < 768;
    const baseCount = variant === "neural" ? 70 : variant === "hero" ? 55 : 35;
    const count = isMobile ? Math.floor(baseCount * 0.45) : baseCount;
    const maxDist = variant === "neural" ? 140 : variant === "hero" ? 120 : 100;

    const particles = [];
    const colors = [
      { r: 0, g: 217, b: 255 },  // Electric Cyan
      { r: 139, g: 92, b: 246 }, // Purple
      { r: 67, g: 230, b: 207 }, // Aqua
      { r: 40, g: 123, b: 255 }, // Neon Blue
    ];

    for (let i = 0; i < count; i++) {
      const col = colors[Math.floor(Math.random() * colors.length)];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (variant === "subtle" ? 0.3 : 0.6),
        vy: (Math.random() - 0.5) * (variant === "subtle" ? 0.3 : 0.6),
        radius: Math.random() * 2 + 1.2,
        color: col,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
      });
    }

    // Interactive mouse state
    const mouse = { x: -1000, y: -1000, radius: 150 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    // Neural pulse packets (data packets traveling along lines)
    const packets = [];
    let packetTimer = 0;

    let animId;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          p.pulse += p.pulseSpeed;

          // Bounce off boundaries
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          // Mouse push/pull
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (1 - dist / mouse.radius) * 0.8;
            p.x -= (dx / dist) * force;
            p.y -= (dy / dist) * force;
          }
        }

        // Particle Glow
        const pulseFactor = 0.7 + 0.3 * Math.sin(p.pulse);
        const col = p.color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * pulseFactor, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${0.7 * pulseFactor})`;
        ctx.shadowColor = `rgb(${col.r}, ${col.g}, ${col.b})`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * (variant === "subtle" ? 0.2 : 0.38);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Occasionally spawn data packet for neural variant
            if (variant === "neural" && Math.random() < 0.0003 && packets.length < 15) {
              packets.push({
                x1: p.x,
                y1: p.y,
                x2: p2.x,
                y2: p2.y,
                progress: 0,
                speed: 0.02 + Math.random() * 0.02,
                color: col,
              });
            }
          }
        }

        // Connect with mouse
        const mDist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (mDist < mouse.radius) {
          const mAlpha = (1 - mDist / mouse.radius) * 0.6;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 217, 255, ${mAlpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      // Draw neural packets
      for (let k = packets.length - 1; k >= 0; k--) {
        const pk = packets[k];
        pk.progress += pk.speed;
        if (pk.progress >= 1) {
          packets.splice(k, 1);
          continue;
        }
        const curX = pk.x1 + (pk.x2 - pk.x1) * pk.progress;
        const curY = pk.y1 + (pk.y2 - pk.y1) * pk.progress;

        ctx.beginPath();
        ctx.arc(curX, curY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${pk.color.r}, ${pk.color.g}, ${pk.color.b})`;
        ctx.shadowColor = `rgb(${pk.color.r}, ${pk.color.g}, ${pk.color.b})`;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
}
