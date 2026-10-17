/**
 * Application Logic for Integración Web Page (V3 - Cyber-Mathematical Procedural & GSAP)
 * - GSAP Staggered Page Entrances & Dynamic Tilt
 * - Spotlight Hover & Audio-Visual Micro-Interactions
 * - HTML5 Video Player Container
 * - Academic Student Data from Datos.txt & Interactive Exercises
 */

// Academic Data from Datos.txt
const defaultStudentData = {
    university: 'Universidad Mariano Galvez De Guatemala',
    faculty: 'Facultad De Ingeniería',
    studentName: 'Cristian Alberto Mendez Rivera',
    studentId: '9941 - 25 - 5734',
    career: 'Ingeniería en Sistemas / computación',
    course: 'Calculo II',
    professor: 'Catedrático de Cálculo II',
    date: 'Octubre 2026'
};

function loadStudentData() {
    try {
        const data = defaultStudentData;
        
        // Update DOM bindings
        document.querySelectorAll('[data-bind="university"]').forEach(el => el.textContent = data.university);
        document.querySelectorAll('[data-bind="faculty"]').forEach(el => el.textContent = data.faculty);
        document.querySelectorAll('[data-bind="studentName"]').forEach(el => el.textContent = data.studentName);
        document.querySelectorAll('[data-bind="studentId"]').forEach(el => el.textContent = data.studentId);
        document.querySelectorAll('[data-bind="career"]').forEach(el => el.textContent = data.career);
        document.querySelectorAll('[data-bind="course"]').forEach(el => el.textContent = data.course);
        document.querySelectorAll('[data-bind="professor"]').forEach(el => el.textContent = data.professor);
        document.querySelectorAll('[data-bind="date"]').forEach(el => el.textContent = data.date);
    } catch (e) {
        console.error('Error loading student data:', e);
    }
}

/**
 * Page-by-Page Navigation Controller with GSAP
 */
const pageList = ['home', 'definiciones', 'simulaciones', 'historia', 'video-seccion', 'ejercicios'];
let currentPageIndex = 0;

function goToPage(target) {
    let index = -1;
    if (typeof target === 'number') {
        index = target;
    } else if (typeof target === 'string') {
        const cleanId = target.replace('#', '');
        index = pageList.indexOf(cleanId);
    }

    if (index < 0 || index >= pageList.length) return;
    currentPageIndex = index;
    const pageId = pageList[currentPageIndex];

    // Hide all pages, show target page with GSAP Stagger
    document.querySelectorAll('.page-view').forEach((pageEl) => {
        if (pageEl.id === pageId) {
            pageEl.classList.remove('hidden');
            setTimeout(() => {
                pageEl.classList.add('active-page');
                
                // GSAP Staggered Entrance Animation
                if (window.gsap) {
                    window.gsap.fromTo(pageEl.querySelectorAll('.hud-panel, .stat-card-aggressive'), 
                        { y: 28, autoAlpha: 0, scale: 0.98 },
                        { y: 0, autoAlpha: 1, scale: 1, duration: 0.6, stagger: 0.08, ease: "power3.out" }
                    );
                }
            }, 10);
        } else {
            pageEl.classList.remove('active-page');
            pageEl.classList.add('hidden');
        }
    });

    // Update navigation tabs
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
        const btnTarget = btn.getAttribute('data-target-page') || btn.getAttribute('href')?.replace('#', '');
        if (btnTarget === pageId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update Top Neon Progress Bar
    const progressBar = document.getElementById('top-progress-bar');
    if (progressBar) {
        const percent = ((currentPageIndex + 1) / pageList.length) * 100;
        progressBar.style.width = `${percent}%`;
    }

    // Update pagination indicator
    const currentNumEl = document.getElementById('pagination-current-num');
    const totalNumEl = document.getElementById('pagination-total-num');
    const prevBtn = document.getElementById('global-prev-page-btn');
    const nextBtn = document.getElementById('global-next-page-btn');

    if (currentNumEl) currentNumEl.textContent = currentPageIndex + 1;
    if (totalNumEl) totalNumEl.textContent = pageList.length;

    if (prevBtn) {
        prevBtn.disabled = currentPageIndex === 0;
        prevBtn.classList.toggle('opacity-40', currentPageIndex === 0);
        prevBtn.classList.toggle('cursor-not-allowed', currentPageIndex === 0);
    }

    if (nextBtn) {
        nextBtn.disabled = currentPageIndex === pageList.length - 1;
        nextBtn.classList.toggle('opacity-40', currentPageIndex === pageList.length - 1);
        nextBtn.classList.toggle('cursor-not-allowed', currentPageIndex === pageList.length - 1);
    }

    // Update pagination dots
    document.querySelectorAll('.page-dot').forEach((dot, dotIdx) => {
        dot.classList.toggle('active', dotIdx === currentPageIndex);
    });

    // Animate metric counters if on Home
    if (pageId === 'home') {
        animateStatCounters();
    }

    // Refresh simulation canvases if switching to simulations
    if (pageId === 'simulaciones') {
        setTimeout(() => {
            window.riemannSim?.render();
            window.archimedesSim?.render();
            window.accumSim?.render();
        }, 80);
    }

    // Update window hash without jumping
    history.replaceState(null, null, `#${pageId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Animated Stat Counters
 */
function animateStatCounters() {
    document.querySelectorAll('.counter-val').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target') || '0', 10);
        const prefix = counter.getAttribute('data-prefix') || '';
        const suffix = counter.getAttribute('data-suffix') || '';
        let count = 0;
        const duration = 1400;
        const start = performance.now();

        function updateCount(timestamp) {
            const progress = Math.min((timestamp - start) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            count = Math.floor(easeProgress * target);
            counter.textContent = `${prefix}${count}${suffix}`;
            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                counter.textContent = `${prefix}${target}${suffix}`;
            }
        }
        requestAnimationFrame(updateCount);
    });
}

/**
 * Interactive Tilt & Spotlight Tracking on HUD Panels
 */
function setupPanelTilt() {
    document.querySelectorAll('.hud-panel').forEach(panel => {
        panel.addEventListener('mousemove', (e) => {
            const rect = panel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            panel.style.setProperty('--mouse-x', `${x}px`);
            panel.style.setProperty('--mouse-y', `${y}px`);

            // Subtle perspective tilt calculation
            if (window.gsap) {
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -4;
                const rotateY = ((x - centerX) / centerX) * 4;

                window.gsap.to(panel, {
                    rotationX: rotateX,
                    rotationY: rotateY,
                    transformPerspective: 900,
                    ease: "power1.out",
                    duration: 0.3
                });
            }
        });

        panel.addEventListener('mouseleave', () => {
            if (window.gsap) {
                window.gsap.to(panel, {
                    rotationX: 0,
                    rotationY: 0,
                    ease: "power2.out",
                    duration: 0.5
                });
            }
        });
    });
}

/**
 * Button Ripple Click Animation
 */
function setupRippleEffect() {
    document.querySelectorAll('.ripple-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const circle = document.createElement('span');
            circle.classList.add('ripple-circle');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            circle.style.width = circle.style.height = `${size}px`;
            circle.style.left = `${e.clientX - rect.left - size / 2}px`;
            circle.style.top = `${e.clientY - rect.top - size / 2}px`;
            this.appendChild(circle);
            setTimeout(() => circle.remove(), 600);
        });
    });
}

/**
 * Fullscreen Presentation Toggle
 */
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

function setupPageNavigation() {
    // Header navigation links
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = btn.getAttribute('data-target-page') || btn.getAttribute('href')?.replace('#', '');
            goToPage(target);
        });
    });

    // Hero quick links
    document.querySelectorAll('[data-goto-page]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const target = el.getAttribute('data-goto-page');
            goToPage(target);
        });
    });

    // Prev / Next pagination buttons
    const prevBtn = document.getElementById('global-prev-page-btn');
    const nextBtn = document.getElementById('global-next-page-btn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPageIndex > 0) goToPage(currentPageIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentPageIndex < pageList.length - 1) goToPage(currentPageIndex + 1);
        });
    }

    // Pagination dots
    document.querySelectorAll('.page-dot').forEach((dot, idx) => {
        dot.addEventListener('click', () => goToPage(idx));
    });

    // Fullscreen button
    const fsBtn = document.getElementById('fullscreen-toggle-btn');
    if (fsBtn) {
        fsBtn.addEventListener('click', toggleFullScreen);
    }

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
        
        if (e.key === 'ArrowRight' || e.key === 'PageDown') {
            if (currentPageIndex < pageList.length - 1) goToPage(currentPageIndex + 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
            if (currentPageIndex > 0) goToPage(currentPageIndex - 1);
        } else if (e.key >= '1' && e.key <= '6') {
            goToPage(parseInt(e.key, 10) - 1);
        } else if (e.key.toLowerCase() === 'f') {
            toggleFullScreen();
        }
    });

    // Initial page load
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && pageList.includes(initialHash)) {
        goToPage(initialHash);
    } else {
        goToPage(0);
    }
}

// Video Handler (Clean playback container)
function setupVideoPlayer() {
    const videoElement = document.getElementById('main-video-player');
    const placeholder = document.getElementById('video-placeholder');
    if (!videoElement) return;

    // Display video player if file exists/loads successfully
    videoElement.addEventListener('canplay', () => {
        if (placeholder) placeholder.classList.add('hidden');
        videoElement.classList.remove('hidden');
    });

    videoElement.addEventListener('error', () => {
        // If external file not present, show reserved placeholder
        if (placeholder) placeholder.classList.remove('hidden');
    });
}

// Exercises Toggle Logic
function setupExercises() {
    document.querySelectorAll('.toggle-solution-btn').forEach(button => {
        button.addEventListener('click', () => {
            const solutionDiv = button.nextElementSibling;
            if (solutionDiv.classList.contains('hidden')) {
                solutionDiv.classList.remove('hidden');
                if (window.gsap) {
                    window.gsap.fromTo(solutionDiv, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.45, ease: "power2.out" });
                }
                button.innerHTML = `
                    <svg class="w-4 h-4 inline-block mr-1 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    [ OCULTAR SOLUCIÓN DETALLADA ]
                `;
            } else {
                solutionDiv.classList.add('hidden');
                button.innerHTML = `
                    <svg class="w-4 h-4 inline-block mr-1 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    [ DESPLEGAR SOLUCIÓN PASO A PASO ]
                `;
            }
        });
    });
}

// Quiz Assessment Logic
function setupQuiz() {
    const quizForm = document.getElementById('math-quiz-form');
    const resultBox = document.getElementById('quiz-result');

    if (quizForm) {
        quizForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const correctAnswers = {
                q1: 'b',
                q2: 'a',
                q3: 'c',
                q4: 'b'
            };

            let score = 0;
            let total = 4;

            for (const [q, correct] of Object.entries(correctAnswers)) {
                const selected = quizForm.elements[q]?.value;
                const parent = document.getElementById(`question-${q}`);
                if (selected === correct) {
                    score++;
                    if (parent) {
                        parent.classList.remove('border-red-500/50', 'bg-red-950/20');
                        parent.classList.add('border-emerald-500/50', 'bg-emerald-950/20');
                    }
                } else {
                    if (parent) {
                        parent.classList.remove('border-emerald-500/50', 'bg-emerald-950/20');
                        parent.classList.add('border-red-500/50', 'bg-red-950/20');
                    }
                }
            }

            if (resultBox) {
                resultBox.classList.remove('hidden');
                const percent = Math.round((score / total) * 100);
                resultBox.innerHTML = `
                    <div class="p-4 rounded-xl border ${score === total ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300' : 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300'} font-mono">
                        <div class="flex items-center justify-between">
                            <span class="text-xl font-bold tracking-wider">[ PUNTUACIÓN TELEMÉTRICA: ${score} / ${total} (${percent}%) ]</span>
                            <span class="text-xs uppercase">${score === total ? 'Dominio Teórico Completo' : 'Revisa las respuestas no óptimas'}</span>
                        </div>
                    </div>
                `;
            }
        });
    }
}

// Render KaTeX formulas automatically
function renderMathFormulas() {
    if (typeof renderMathInElement === 'function') {
        renderMathInElement(document.body, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false},
                {left: '\\(', right: '\\)', display: false},
                {left: '\\[', right: '\\]', display: true}
            ],
            throwOnError: false
        });
    } else {
        setTimeout(renderMathFormulas, 200);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadStudentData();
    setupPageNavigation();
    setupPanelTilt();
    setupRippleEffect();
    setupVideoPlayer();
    setupExercises();
    setupQuiz();
    renderMathFormulas();
});

window.addEventListener('load', renderMathFormulas);
