import React, { useEffect, useRef } from 'react';

export const GoldParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes (golden, amber, subtle red & emerald nodes like in the screenshot)
    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      glowColor: string;
      alpha: number;
      alphaSpeed: number;
    }

    const colors = [
      { fill: '#F5D061', glow: 'rgba(245, 208, 97, 0.4)' }, // Gold
      { fill: '#E5A93C', glow: 'rgba(229, 169, 60, 0.35)' }, // Amber
      { fill: '#FF5733', glow: 'rgba(255, 87, 51, 0.3)' }, // Warm Red/Coral
      { fill: '#2ECC71', glow: 'rgba(46, 204, 113, 0.35)' }, // Emerald
      { fill: '#FFF6CC', glow: 'rgba(255, 246, 204, 0.5)' }, // Light Gold
    ];

    const nodesCount = Math.min(Math.floor((width * height) / 18000), 55);
    const nodes: Node[] = [];

    for (let i = 0; i < nodesCount; i++) {
      const c = colors[Math.floor(Math.random() * colors.length)];
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2.5 + 1.2,
        color: c.fill,
        glowColor: c.glow,
        alpha: Math.random() * 0.6 + 0.3,
        alphaSpeed: (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      });
    }

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Draw flowing golden wave curves (like in the screenshot)
      ctx.save();
      const waveCount = 4;
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        const baseOffset = (w * 35);
        const startY = height * 0.62 + baseOffset;
        ctx.moveTo(0, startY);

        for (let x = 0; x <= width; x += 25) {
          const wave1 = Math.sin(x * 0.0025 + time * 0.8 + w * 1.2) * 40;
          const wave2 = Math.cos(x * 0.004 - time * 0.5 + w * 0.7) * 25;
          const y = startY + wave1 + wave2;
          ctx.lineTo(x, y);
        }

        ctx.strokeStyle = w % 2 === 0 ? 'rgba(229, 169, 60, 0.18)' : 'rgba(245, 208, 97, 0.12)';
        ctx.lineWidth = 1.2 + (w % 2) * 0.6;
        ctx.stroke();
      }
      ctx.restore();

      // Connect near nodes with delicate golden filaments
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const lineAlpha = (1 - dist / 120) * 0.18 * ((nodes[i].alpha + nodes[j].alpha) / 2);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(229, 169, 60, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw particle nodes with soft glow
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;

        // Bounce on borders
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        node.alpha += node.alphaSpeed;
        if (node.alpha > 0.85 || node.alpha < 0.25) {
          node.alphaSpeed *= -1;
        }

        // Glow ring
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = node.glowColor;
        ctx.globalAlpha = node.alpha * 0.5;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.globalAlpha = node.alpha;
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 w-full h-full"
      style={{ opacity: 0.95 }}
    />
  );
};
