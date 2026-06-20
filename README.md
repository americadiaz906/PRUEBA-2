# Dominó Numérico Infantil 🎲🔢

> **Un juego de dominó interactivo para preescolar, alineado con la Nueva Escuela Mexicana (NEM) — Fase 2.**

Un material educativo digital completamente autónomo (sin instalaciones ni conexión a internet) que permite a niños de 3 a 6 años jugar al dominó usando **números en lugar de puntos**, reforzando el reconocimiento numérico, el pensamiento lógico y la socialización por turnos.

---

## 🌟 Características Principales

| Característica | Descripción |
|---|---|
| 🧒 Jugadores | De 2 a 4 jugadores en el mismo dispositivo |
| 🎓 Nivel | Preescolar (Fase 2 — 2.° y 3.° grado) |
| 🌐 Tecnología | HTML5 + CSS3 + JavaScript Vanilla (sin dependencias) |
| 📶 Conectividad | Funciona 100% sin internet tras la carga inicial |
| 🔢 Fichas | Números de colores en lugar de puntos (asociación visual) |
| 🔊 Sonidos | Efectos de audio sintetizados en tiempo real (Web Audio API) |
| ✨ Animaciones | Fichas voladoras, partículas y avatares animados |
| ⏱️ Temporizador | Barra de tiempo lúdica con animales indicadores |

---

## 🏫 Alineación Pedagógica (NEM — Nueva Escuela Mexicana)

Este recurso ha sido diseñado siguiendo los lineamientos del plan de estudios de la **Fase 2 (Preescolar)**:

- **Campo Formativo:** Saberes y Pensamiento Científico
- **Contenido:** Los saberes numéricos como herramienta para resolver situaciones del entorno, en diversos contextos socioculturales.
- **Procesos de Desarrollo de Aprendizaje (PDA):**
  - *2.° de Preescolar:* Usa números en juegos y situaciones cotidianas de su entorno.
  - *3.° de Preescolar:* Resuelve de manera colaborativa situaciones sencillas que involucran números y que implican juntar, agregar, separar o quitar elementos.

---

## 🚀 Cómo Ejecutar el Proyecto

Este proyecto está construido con tecnologías web estándar y es **100% autónomo**.

1. Descarga o clona el repositorio en tu computadora.
2. Navega a la carpeta `PRUEBA-2/`.
3. Haz **doble clic** en el archivo `index.html`.
4. Se abrirá directamente en tu navegador (Chrome, Edge, Firefox o Safari).
5. ¡Listo! Configura los jugadores y comienza a jugar.

> 💡 No se requiere servidor local, base de datos ni instalación de dependencias.

---

## 🎮 Dinámica del Juego

1. **Configuración:** Elige de 2 a 4 jugadores, escribe sus nombres y selecciona un avatar emoji.
2. **Inicio automático:** El juego detecta quién tiene el doble más alto (comienza con el 6|6) y lo coloca en el tablero.
3. **Turnos:** Cada jugador verá una pantalla de transición antes de revelar sus fichas (para que los demás no las vean).
4. **Jugar:** Toca una ficha que brille para colocarla en el extremo del tablero que corresponda.
5. **Robar:** Si no tienes fichas que sirvan, toca **El Pozo** para robar una ficha.
6. **Victoria:** El juego termina cuando un jugador coloca todas sus fichas, o cuando nadie puede jugar (bloqueo). Gana quien tenga menos puntos acumulados en sus fichas restantes.

---

## 🛠️ Tecnologías Utilizadas

- **HTML5** — Estructura del tablero y pantallas de juego
- **CSS3 (Vanilla)** — Diseño responsivo, animaciones `@keyframes` y efectos glassmorphism
- **JavaScript ES6** — Lógica de turnos, validaciones, mezclas y animaciones dinámicas
- **Web Audio API** — Efectos de sonido sintetizados sin archivos externos
- **Canvas API** — Sistema de confeti de victoria
- **Google Fonts** — Tipografías *Fredoka* y *Quicksand* para estética infantil redondeada
- **FontAwesome CDN** — Iconografía de la interfaz

---

## 📂 Estructura de Archivos

```text
PRUEBA-2/
├── index.html                  # Estructura del juego y pantallas
├── style.css                   # Hoja de estilos y animaciones
├── app.js                      # Lógica completa del juego
├── README.md                   # Este archivo de documentación
├── TODO.md                     # Lista de tareas y mejoras pendientes
├── instrucciones_de_uso.md     # Guía paso a paso para el educador y los alumnos
└── planeacion_didactica.md     # Planeación didáctica formal alineada con la NEM
```

---

## 🎨 Sistema de Colores Numéricos

Los números del dominó tienen colores fijos para facilitar la asociación visual en preescolar:

| Número | Color | Uso pedagógico |
|:---:|---|---|
| **0** | Gris | El cero — "el número vacío" |
| **1** | Azul | "Uno solo" |
| **2** | Verde | "El par" |
| **3** | Rojo | "El trio" |
| **4** | Morado | "Los cuatro" |
| **5** | Naranja | "La mano" |
| **6** | Rosa | "El doble" |

---

## 🔊 Efectos de Sonido

| Acción | Sonido |
|---|---|
| Colocar una ficha válida | 🔵 Burbuja / Pop ascendente |
| Robar del Pozo | 🔻 Descarte descendente |
| Intento inválido o error | 🔴 Alerta suave |
| Ganar la partida | 🎵 Fanfarria de 7 notas |

> Todos los sonidos son **sintetizados en tiempo real** con la Web Audio API del navegador — no se descargan archivos de audio.

---

## 👩‍💻 Autoras

- **Leslie Ruiz** — Diseño pedagógico original
- **America Díaz** — Adaptación y desarrollo

---

## 📄 Licencia

Este proyecto es un recurso educativo de uso libre para docentes, educadoras y familias de educación preescolar. Se permite su uso, modificación y distribución con fines educativos no comerciales.

---

> 📅 Versión 2.0 — Junio 2026
> ✅ Incluye mejoras dinámicas: sonidos, animaciones, partículas y temporizador lúdico
