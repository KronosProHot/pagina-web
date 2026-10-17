/**
 * Procedural Mathematical Background Canvas (V2 - Interactive Physics)
 * Renders mathematical coordinate grid, floating calculus formulas,
 * gravitational particle mesh responding to mouse, and dynamic Riemann wave curves.
 */

class MathBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.formulas = [
            '∫ f(x) dx', '∑_{i=1}^n f(x_i*)Δx', 'lim_{Δx→0}', 'dy/dx', '∬_D dA',
            'F(b) - F(a)', '∫_a^b x² dx', '∮ E·dl', 'e^{iπ} + 1 = 0', '∇ × F',
            '∂u/∂t = α∇²u', '∫ e^{-x²} dx = √π', '∫ (1/x) dx = ln|x|', '∫ sin(x) dx = -cos(x)'
        ];
        this.floatingSymbols = [];
        this.mouse = { x: -2000, y: -2000, targetX: -2000, targetY: -2000, radius: 180, isHovering: false };
        this.time = 0;

        this.init();
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.targetX = e.clientX;
            this.mouse.targetY = e.clientY + window.scrollY;
            this.mouse.isHovering = true;
        });

        window.addEventListener('mouseleave', () => {
            this.mouse.isHovering = false;
        });
    }

    init() {
        this.resize();

        // Particles for reactive mathematical vector field
        const particleCount = Math.min(90, Math.floor((this.width * this.height) / 22000));
        this.particles = [];
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                baseX: 0,
                baseY: 0,
                vx: (Math.random() - 0.5) * 0.7,
                vy: (Math.random() - 0.5) * 0.7,
                size: Math.random() * 2 + 1,
                alpha: Math.random() * 0.45 + 0.2
            });
        }

        // Floating mathematical formulas
        this.floatingSymbols = [];
        const formulaCount = 22;
        for (let i = 0; i < formulaCount; i++) {
            this.floatingSymbols.push({
                text: this.formulas[Math.floor(Math.random() * this.formulas.length)],
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                speedY: -(Math.random() * 0.35 + 0.15),
                speedX: (Math.random() - 0.5) * 0.2,
                opacity: Math.random() * 0.25 + 0.1,
                size: Math.floor(Math.random() * 7 + 14),
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = Math.max(window.innerHeight, document.documentElement.scrollHeight);
    }

    drawGrid() {
        const ctx = this.ctx;
        const gridSize = 65;
        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.035)';
        ctx.lineWidth = 1;

        // Subtle coordinate deformation
        const offsetX = (Math.sin(this.time * 0.0004) * 15);
        const offsetY = (Math.cos(this.time * 0.0004) * 15);

        for (let x = offsetX % gridSize; x < this.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.height);
            ctx.stroke();
        }

        for (let y = offsetY % gridSize; y < this.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.width, y);
            ctx.stroke();
        }
        ctx.restore();
    }

    drawProceduralWaves() {
        const ctx = this.ctx;
        const t = this.time * 0.001;

        ctx.save();
        ctx.lineWidth = 1.5;

        // Wave 1: Calculus Sine Ribbon Wave
        const grad1 = ctx.createLinearGradient(0, 0, this.width, 0);
        grad1.addColorStop(0, 'rgba(6, 182, 212, 0)');
        grad1.addColorStop(0.5, 'rgba(6, 182, 212, 0.15)');
        grad1.addColorStop(1, 'rgba(168, 85, 247, 0)');
        ctx.strokeStyle = grad1;

        ctx.beginPath();
        for (let x = 0; x < this.width; x += 15) {
            const y = 320 + Math.sin(x * 0.004 + t) * 60 + Math.cos(x * 0.009 - t * 0.6) * 35;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Wave 2: Integral Envelope Wave
        const grad2 = ctx.createLinearGradient(0, 0, this.width, 0);
        grad2.addColorStop(0, 'rgba(168, 85, 247, 0)');
        grad2.addColorStop(0.5, 'rgba(59, 130, 246, 0.12)');
        grad2.addColorStop(1, 'rgba(16, 185, 129, 0)');
        ctx.strokeStyle = grad2;

        ctx.beginPath();
        for (let x = 0; x < this.width; x += 15) {
            const y = 680 + Math.sin(x * 0.003 - t * 0.8) * 75 + Math.sin(x * 0.007 + t) * 20;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
    }

    drawParticles() {
        const ctx = this.ctx;
        
        // Smooth mouse position damping
        this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.1;
        this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.1;

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];

            // Gravitational mouse repulsion / calculus flow
            if (this.mouse.isHovering) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < this.mouse.radius && dist > 1) {
                    const force = (1 - dist / this.mouse.radius) * 1.8;
                    p.x += (dx / dist) * force;
                    p.y += (dy / dist) * force;
                }
            }

            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = this.width;
            if (p.x > this.width) p.x = 0;
            if (p.y < 0) p.y = this.height;
            if (p.y > this.height) p.y = 0;

            // Connecting flux lines
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dist = Math.hypot(p.x - p2.x, p.y - p2.y);

                if (dist < 135) {
                    const alpha = (1 - dist / 135) * 0.18;
                    ctx.strokeStyle = `rgba(125, 211, 252, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }

            // Draw glowing particle point
            ctx.fillStyle = `rgba(167, 139, 250, ${p.alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawFloatingFormulas() {
        const ctx = this.ctx;
        ctx.font = 'italic 16px "KaTeX_Math", "Times New Roman", serif';
        
        for (let s of this.floatingSymbols) {
            s.y += s.speedY;
            s.x += s.speedX + Math.sin(this.time * 0.0018 + s.phase) * 0.35;

            if (s.y < -50) {
                s.y = this.height + 20;
                s.x = Math.random() * this.width;
            }

            ctx.save();
            ctx.font = `italic ${s.size}px "KaTeX_Math", "Times New Roman", serif`;
            ctx.fillStyle = `rgba(96, 165, 250, ${s.opacity})`;
            ctx.shadowColor = 'rgba(56, 189, 248, 0.5)';
            ctx.shadowBlur = 10;
            ctx.fillText(s.text, s.x, s.y);
            ctx.restore();
        }
    }

    animate(timestamp) {
        this.time = timestamp;
        
        const currentDocHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        if (Math.abs(this.height - currentDocHeight) > 80) {
            this.resize();
        }

        this.ctx.clearRect(0, 0, this.width, this.height);

        this.drawGrid();
        this.drawProceduralWaves();
        this.drawParticles();
        this.drawFloatingFormulas();

        requestAnimationFrame(this.animate);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.mathBg = new MathBackground('math-bg-canvas');
});
