/**
 * Procedural Mathematical Simulations & Visualizers
 * 1. Riemann Sums Interactive Area Simulation
 * 2. Archimedes Method of Exhaustion
 * 3. Accumulation Function (Fundamental Theorem of Calculus)
 */

class RiemannSimulator {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.n = 10;
        this.rule = 'mid'; // 'left', 'mid', 'right'
        this.funcType = 'quadratic'; // 'quadratic', 'sine', 'cubic'
        this.a = 0.5;
        this.b = 4.0;
        this.initControls();
        this.render();
    }

    f(x) {
        switch(this.funcType) {
            case 'sine':
                return Math.sin(x) * 1.5 + 2.0;
            case 'cubic':
                return 0.1 * Math.pow(x, 3) - 0.5 * Math.pow(x, 2) + 0.8 * x + 1.5;
            case 'quadratic':
            default:
                return 0.25 * Math.pow(x, 2) + 0.5;
        }
    }

    fIntegral(x) {
        switch(this.funcType) {
            case 'sine':
                return -1.5 * Math.cos(x) + 2.0 * x;
            case 'cubic':
                return (0.1 / 4) * Math.pow(x, 4) - (0.5 / 3) * Math.pow(x, 3) + 0.4 * Math.pow(x, 2) + 1.5 * x;
            case 'quadratic':
            default:
                return (0.25 / 3) * Math.pow(x, 3) + 0.5 * x;
        }
    }

    initControls() {
        const sliderN = document.getElementById('riemann-n-slider');
        const valN = document.getElementById('riemann-n-val');
        const selectRule = document.getElementById('riemann-rule-select');
        const selectFunc = document.getElementById('riemann-func-select');

        if (sliderN) {
            sliderN.addEventListener('input', (e) => {
                this.n = parseInt(e.target.value);
                if (valN) valN.textContent = this.n;
                this.render();
            });
        }

        if (selectRule) {
            selectRule.addEventListener('change', (e) => {
                this.rule = e.target.value;
                this.render();
            });
        }

        if (selectFunc) {
            selectFunc.addEventListener('change', (e) => {
                this.funcType = e.target.value;
                this.render();
            });
        }

        window.addEventListener('resize', () => this.render());
    }

    render() {
        const canvas = this.canvas;
        const ctx = this.ctx;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        const w = rect.width;
        const h = rect.height;
        const padding = { left: 50, right: 30, top: 30, bottom: 45 };

        ctx.clearRect(0, 0, w, h);

        const xMin = 0;
        const xMax = 5.0;
        const yMin = 0;
        const yMax = 5.5;

        const toCanvasX = (x) => padding.left + ((x - xMin) / (xMax - xMin)) * (w - padding.left - padding.right);
        const toCanvasY = (y) => h - padding.bottom - ((y - yMin) / (yMax - yMin)) * (h - padding.top - padding.bottom);

        // Grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 1;
        for (let x = 0; x <= xMax; x += 1) {
            ctx.beginPath();
            ctx.moveTo(toCanvasX(x), toCanvasY(yMin));
            ctx.lineTo(toCanvasX(x), toCanvasY(yMax));
            ctx.stroke();
            ctx.fillStyle = 'rgba(156, 163, 175, 0.6)';
            ctx.font = '11px sans-serif';
            ctx.fillText(x.toString(), toCanvasX(x) - 4, h - padding.bottom + 18);
        }

        for (let y = 1; y <= yMax; y += 1) {
            ctx.beginPath();
            ctx.moveTo(toCanvasX(xMin), toCanvasY(y));
            ctx.lineTo(toCanvasX(xMax), toCanvasY(y));
            ctx.stroke();
            ctx.fillStyle = 'rgba(156, 163, 175, 0.6)';
            ctx.font = '11px sans-serif';
            ctx.fillText(y.toString(), padding.left - 25, toCanvasY(y) + 4);
        }

        // Axes
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        // X axis
        ctx.moveTo(toCanvasX(xMin), toCanvasY(0));
        ctx.lineTo(toCanvasX(xMax), toCanvasY(0));
        // Y axis
        ctx.moveTo(toCanvasX(xMin), toCanvasY(0));
        ctx.lineTo(toCanvasX(xMin), toCanvasY(yMax));
        ctx.stroke();

        // Riemann Rectangles
        const dx = (this.b - this.a) / this.n;
        let sum = 0;

        for (let i = 0; i < this.n; i++) {
            const xLeft = this.a + i * dx;
            const xRight = xLeft + dx;
            let xEval = xLeft;
            if (this.rule === 'mid') xEval = xLeft + dx / 2;
            else if (this.rule === 'right') xEval = xRight;

            const yVal = this.f(xEval);
            sum += yVal * dx;

            const rx = toCanvasX(xLeft);
            const ry = toCanvasY(yVal);
            const rw = toCanvasX(xRight) - rx;
            const rh = toCanvasY(0) - ry;

            // Gradient for rectangles
            const grad = ctx.createLinearGradient(rx, ry, rx + rw, ry + rh);
            grad.addColorStop(0, 'rgba(59, 130, 246, 0.35)');
            grad.addColorStop(1, 'rgba(147, 51, 234, 0.35)');

            ctx.fillStyle = grad;
            ctx.fillRect(rx, ry, rw, rh);

            ctx.strokeStyle = 'rgba(96, 165, 250, 0.8)';
            ctx.lineWidth = 1;
            ctx.strokeRect(rx, ry, rw, rh);

            // Highlight evaluation point on curve
            ctx.fillStyle = '#60a5fa';
            ctx.beginPath();
            ctx.arc(toCanvasX(xEval), toCanvasY(yVal), 2.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Function Curve f(x)
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        const steps = 200;
        for (let i = 0; i <= steps; i++) {
            const x = xMin + (i / steps) * (xMax - xMin);
            const y = this.f(x);
            const cx = toCanvasX(x);
            const cy = toCanvasY(y);
            if (i === 0) ctx.moveTo(cx, cy);
            else ctx.lineTo(cx, cy);
        }
        ctx.stroke();

        // Interval boundaries a and b
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(toCanvasX(this.a), toCanvasY(0));
        ctx.lineTo(toCanvasX(this.a), toCanvasY(this.f(this.a)));
        ctx.moveTo(toCanvasX(this.b), toCanvasY(0));
        ctx.lineTo(toCanvasX(this.b), toCanvasY(this.f(this.b)));
        ctx.stroke();
        ctx.setLineDash([]);

        // Labels a and b
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(`a=${this.a}`, toCanvasX(this.a) - 10, toCanvasY(0) + 32);
        ctx.fillText(`b=${this.b}`, toCanvasX(this.b) - 10, toCanvasY(0) + 32);

        // Exact integral calculation
        const exactIntegral = this.fIntegral(this.b) - this.fIntegral(this.a);
        const error = Math.abs(exactIntegral - sum);

        const sumValEl = document.getElementById('riemann-calc-sum');
        const exactValEl = document.getElementById('riemann-calc-exact');
        const errorValEl = document.getElementById('riemann-calc-error');

        if (sumValEl) sumValEl.textContent = sum.toFixed(5);
        if (exactValEl) exactValEl.textContent = exactIntegral.toFixed(5);
        if (errorValEl) errorValEl.textContent = error.toFixed(5);
    }
}

/**
 * Archimedes Exhaustion Method Visualizer
 */
class ArchimedesVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.sides = 6;
        this.initControls();
        this.render();
    }

    initControls() {
        const slider = document.getElementById('archimedes-sides-slider');
        const label = document.getElementById('archimedes-sides-val');
        if (slider) {
            slider.addEventListener('input', (e) => {
                this.sides = parseInt(e.target.value);
                if (label) label.textContent = this.sides;
                this.render();
            });
        }
        window.addEventListener('resize', () => this.render());
    }

    render() {
        const canvas = this.canvas;
        const ctx = this.ctx;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        const w = rect.width;
        const h = rect.height;
        const cx = w / 2;
        const cy = h / 2;
        const r = Math.min(w, h) * 0.38;

        ctx.clearRect(0, 0, w, h);

        // Circumscribed Polygon (Outer)
        const outerR = r / Math.cos(Math.PI / this.sides);
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i <= this.sides; i++) {
            const angle = (i * 2 * Math.PI) / this.sides - Math.PI / 2;
            const px = cx + outerR * Math.cos(angle);
            const py = cy + outerR * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Exact Circle (Target)
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        // Inscribed Polygon (Inner)
        ctx.fillStyle = 'rgba(16, 185, 129, 0.18)';
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= this.sides; i++) {
            const angle = (i * 2 * Math.PI) / this.sides - Math.PI / 2;
            const px = cx + r * Math.cos(angle);
            const py = cy + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Triangular subdivision sectors
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        for (let i = 0; i < this.sides; i++) {
            const angle = (i * 2 * Math.PI) / this.sides - Math.PI / 2;
            const px = cx + r * Math.cos(angle);
            const py = cy + r * Math.sin(angle);
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(px, py);
            ctx.stroke();
        }

        // Center point
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fill();

        // Calculations for Pi approximation
        // Area of inscribed regular polygon with n sides: 0.5 * n * sin(2pi/n)
        const innerPi = 0.5 * this.sides * Math.sin((2 * Math.PI) / this.sides);
        // Area of circumscribed regular polygon with n sides: n * tan(pi/n)
        const outerPi = this.sides * Math.tan(Math.PI / this.sides);

        const innerEl = document.getElementById('archimedes-inner-pi');
        const outerEl = document.getElementById('archimedes-outer-pi');
        if (innerEl) innerEl.textContent = innerPi.toFixed(6);
        if (outerEl) outerEl.textContent = outerPi.toFixed(6);
    }
}

/**
 * Fundamental Theorem of Calculus: Accumulation Curve
 */
class AccumulationVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.xVal = 2.5;
        this.initControls();
        this.render();
    }

    initControls() {
        const slider = document.getElementById('accum-x-slider');
        const label = document.getElementById('accum-x-val');
        if (slider) {
            slider.addEventListener('input', (e) => {
                this.xVal = parseFloat(e.target.value);
                if (label) label.textContent = this.xVal.toFixed(2);
                this.render();
            });
        }
        window.addEventListener('resize', () => this.render());
    }

    f(t) {
        return Math.sin(t * 1.2) * 1.2 + 1.6;
    }

    F(x) {
        // Numerical integration of f(t) from 0 to x
        const steps = 100;
        const dt = x / steps;
        let sum = 0;
        for (let i = 0; i < steps; i++) {
            const t = (i + 0.5) * dt;
            sum += this.f(t) * dt;
        }
        return sum;
    }

    render() {
        const canvas = this.canvas;
        const ctx = this.ctx;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        const w = rect.width;
        const h = rect.height;
        const pad = { left: 45, right: 30, top: 30, bottom: 40 };

        ctx.clearRect(0, 0, w, h);

        const xMax = 5.0;
        const yMax = 8.0;

        const toX = (x) => pad.left + (x / xMax) * (w - pad.left - pad.right);
        const toY = (y) => h - pad.bottom - (y / yMax) * (h - pad.top - pad.bottom);

        // Coordinates
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(toX(0), toY(0));
        ctx.lineTo(toX(xMax), toY(0));
        ctx.moveTo(toX(0), toY(0));
        ctx.lineTo(toX(0), toY(yMax));
        ctx.stroke();

        // Shaded accumulated area under f(t) from 0 to xVal
        ctx.fillStyle = 'rgba(14, 165, 233, 0.25)';
        ctx.beginPath();
        ctx.moveTo(toX(0), toY(0));
        const areaSteps = 100;
        for (let i = 0; i <= areaSteps; i++) {
            const t = (i / areaSteps) * this.xVal;
            ctx.lineTo(toX(t), toY(this.f(t)));
        }
        ctx.lineTo(toX(this.xVal), toY(0));
        ctx.closePath();
        ctx.fill();

        // Draw f(t) curve (Cyan)
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let i = 0; i <= 150; i++) {
            const t = (i / 150) * xMax;
            if (i === 0) ctx.moveTo(toX(t), toY(this.f(t)));
            else ctx.lineTo(toX(t), toY(this.f(t)));
        }
        ctx.stroke();

        // Draw F(x) = ∫_0^x f(t) dt curve (Emerald)
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let i = 0; i <= 150; i++) {
            const x = (i / 150) * xMax;
            const fx = this.F(x);
            if (i === 0) ctx.moveTo(toX(x), toY(fx));
            else ctx.lineTo(toX(x), toY(fx));
        }
        ctx.stroke();

        // Current x marker
        const currAccum = this.F(this.xVal);
        const currHeight = this.f(this.xVal);

        ctx.strokeStyle = '#f59e0b';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(toX(this.xVal), toY(0));
        ctx.lineTo(toX(this.xVal), toY(Math.max(currAccum, currHeight)));
        ctx.stroke();
        ctx.setLineDash([]);

        // Points
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(toX(this.xVal), toY(currHeight), 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#34d399';
        ctx.beginPath();
        ctx.arc(toX(this.xVal), toY(currAccum), 5, 0, Math.PI * 2);
        ctx.fill();

        // Legend & values in DOM
        const curFVal = document.getElementById('accum-ft-val');
        const curIntVal = document.getElementById('accum-integral-val');
        if (curFVal) curFVal.textContent = currHeight.toFixed(3);
        if (curIntVal) curIntVal.textContent = currAccum.toFixed(3);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.riemannSim = new RiemannSimulator('riemann-canvas');
    window.archimedesSim = new ArchimedesVisualizer('archimedes-canvas');
    window.accumSim = new AccumulationVisualizer('accumulation-canvas');
});
