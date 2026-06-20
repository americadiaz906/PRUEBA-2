# ✅ TODO — Dominó Numérico Infantil

Lista de tareas del proyecto, organizadas por estado y prioridad.

---

## 🟢 Completado

### Funcionalidad Base del Juego
- [x] Generación del mazo estándar de dominó doble 6 (28 fichas)
- [x] Algoritmo de mezcla Fisher-Yates
- [x] Reparto automático de fichas según número de jugadores (2→7, 3→6, 4→5)
- [x] Detección automática del jugador inicial (doble más alto → ficha más alta)
- [x] Colocación automática de la ficha inicial en el tablero
- [x] Lógica de turnos por jugador (2 a 4 jugadores)
- [x] Validación de fichas jugables en ambos extremos del tablero
- [x] Resaltado de fichas válidas (efecto de brillo `glowPlayable`)
- [x] Volteo automático de fichas para alinearlas al extremo correcto
- [x] Colocación de fichas en lado izquierdo o derecho del tren
- [x] Modal de selección de lado cuando la ficha sirve en ambos extremos
- [x] Robo de fichas del Pozo (boneyard)
- [x] Pasar turno cuando no hay jugadas ni pozo disponible
- [x] Detección de partida bloqueada
- [x] Resolución de empates por puntaje y por cantidad de fichas
- [x] Pantalla de resultados con tabla ordenada de menor a mayor puntaje
- [x] Sistema de confeti en Canvas (animación de victoria)

### Interfaz y Experiencia de Usuario
- [x] Pantalla de configuración de jugadores (nombre + avatar emoji)
- [x] Selector de cantidad de jugadores (2, 3 o 4)
- [x] Pantalla de transición de turno (pasar el dispositivo de forma segura)
- [x] Indicadores dinámicos en los extremos del tablero
- [x] Animación de sacudida para movimientos inválidos
- [x] Scroll automático del tablero al centro tras cada jugada
- [x] Modal de Guía Pedagógica NEM integrado
- [x] Diseño responsivo adaptado a pantallas táctiles

### Mejoras Dinámicas (Iteración 2)
- [x] Sintetizador de sonidos Web Audio API (sin archivos externos)
  - [x] Sonido "pop" al colocar una ficha válida
  - [x] Sonido de descarte al robar del Pozo
  - [x] Sonido de alerta/error al intentar jugada inválida
  - [x] Fanfarria de victoria al finalizar la partida
- [x] Botón de silenciado de sonido con ícono reactivo
- [x] Animación de vuelo de fichas (de la mano al tablero)
- [x] Animación de robo desde el Pozo (ficha vuela hacia la mano)
- [x] Explosión de partículas emoji (⭐✨🎉) al conectar fichas
- [x] Avatares animados con rebote (`bounceAvatar`) en turno activo
- [x] Avatar emocionado (`bounceAvatarExcited`) en pantalla de transición
- [x] Animación especial del avatar ganador al terminar
- [x] Cronómetro lúdico visual con animal indicador:
  - [x] 🐰 Conejo (tiempo amplio, barra verde)
  - [x] 🐢 Tortuga (tiempo medio, barra amarilla)
  - [x] 🐌 Caracol (tiempo bajo, barra roja)
- [x] Sistema de pistas sutiles (sacudida periódica de fichas jugables al agotarse el tiempo)

---

## 🟡 En Progreso / Pendiente

### Mejoras de Jugabilidad
- [ ] Historial de jugadas (log de movimientos realizados)
- [ ] Indicador del número de fichas en mano de cada oponente (sin revelarlas)
- [ ] Modo de dificultad: sugerencia automática de ficha recomendada para niños más pequeños
- [ ] Animación de arrastrar y soltar (drag & drop) para colocar fichas

### Accesibilidad
- [ ] Soporte completo de teclado (navegación con Tab y Enter)
- [ ] Etiquetas ARIA para lectores de pantalla
- [ ] Modo de alto contraste
- [ ] Tamaño de fuente ajustable (accesibilidad visual)

### Multijugador y Guardado
- [ ] Guardado del estado de la partida en `localStorage` para continuar después
- [ ] Opción de deshacer la última jugada (para uso educativo)
- [ ] Estadísticas acumuladas de victorias por jugador

### Contenido Educativo Adicional
- [ ] Mini-tutorial interactivo de cómo jugar (primer inicio)
- [ ] Modo "Suma" donde los niños deben decir el resultado de sumar ambos extremos del tablero antes de jugar
- [ ] Integración de fichas con imágenes de objetos además de números

---

## 🔴 Ideas Futuras

- [ ] Modo de un jugador contra la IA (con niveles de dificultad infantil)
- [ ] Sonidos de voz que pronuncien los números al seleccionar fichas
- [ ] Exportar tarjeta de resultado en imagen para llevar a casa
- [ ] Soporte de idioma (español / inglés / lengua indígena local)
- [ ] Versión en inglés con alphabet domino (letras en lugar de números)

---

> 📅 Última actualización: Junio 2026
> 👩‍🏫 Proyecto educativo alineado con la **Nueva Escuela Mexicana — Fase 2 (Preescolar)**
