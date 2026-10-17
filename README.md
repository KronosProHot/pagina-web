# Proyecto: INTEGRACIÓN - CÁLCULO II

Este proyecto ha sido completamente encapsulado y desacoplado como un proyecto independiente, con **todas sus dependencias extraídas y empaquetadas localmente** en la carpeta `vendor/`, permitiendo su ejecución offline y sin conexiones externas.

---

## 📁 Estructura del Proyecto

```text
pagina web/
├── index.html              # Estructura principal con referencias locales a vendor/
├── styles.css              # Estilos visuales Cyber-HUD y paleta matemática
├── math-canvas.js          # Fondo procedural matemático reactivo a la gravedad del cursor
├── procedural-sims.js      # Simuladores matemáticos de Riemann, Arquímedes y acumulación
├── app.js                  # Controlador de navegación página a página y lógica interactiva
├── Datos.txt               # Datos académicos del estudiante y la universidad
├── abrir-pagina.bat        # Acceso directo para abrir el proyecto con doble clic
├── vendor/                 # TODAS LAS DEPENDENCIAS EXTRAÍDAS LOCALMENTE:
│   ├── tailwind.js         # Motor Tailwind CSS local
│   ├── gsap.min.js         # Motor GreenSock GSAP local
│   └── katex/              # Motor KaTeX y fuentes matemáticas WOFF2 locales
│       ├── katex.min.js
│       ├── katex.min.css
│       ├── auto-render.min.js
│       └── fonts/          # Tipografías matemáticas KaTeX locales
└── .agents/                # Skills del proyecto integradas
    ├── skills/             # UI/UX Pro Max y GSAP Skills completas
    └── rules/              # Reglas y directrices
```

---

## 🚀 Cómo Ejecutar

1. **Doble Clic:** Haz doble clic en el archivo `abrir-pagina.bat`.
2. **Servidor Local (Opcional):**
   ```powershell
   cd "C:\Users\PROBOOK\Downloads\pagina web"
   python -m http.server 8000
   ```
   Y abre `http://localhost:8000` en tu navegador.
