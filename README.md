# Trivia UFG — Elite Edition

Plataforma de trivia interactiva desarrollada para estudiantes de la Universidad Francisco Gavidia (UFG). Los jugadores compiten respondiendo preguntas de cultura general y programación, acumulan puntos en un leaderboard global y pueden consultar su progreso en un perfil personal.

**URL en producción:** https://mimetic-coral-482015-m5.web.app

---

## Características principales

### Juego
- **Dos categorías:** Mixta (239 preguntas de cultura general, geografía, ciencia, historia, El Salvador, etc.) y Programación (126 preguntas de Java, Spring Boot, POO, algoritmos, estructuras de datos, bases de datos y más).
- **15 preguntas por partida**, seleccionadas aleatoriamente del banco de cada categoría.
- **Timer adaptativo:** cada pregunta inicia con 10 segundos. Si el jugador tarda más del 55 % del tiempo disponible, el límite baja 1 segundo en la siguiente (mínimo 5 s).
- **Sistema de racha:** cada 2 respuestas correctas consecutivas se recupera 1 segundo perdido (hasta el máximo inicial de 10 s). Se muestra un badge en tiempo real.
- **Puntaje por velocidad:** `puntos = segundos restantes x 10`. Responder rápido y correcto maximiza el puntaje.

### Leaderboard
- Clasificación global en tiempo real con los 10 mejores puntajes.
- Muestra avatar, categoría jugada, respuestas correctas y puntaje de cada jugador.

### Perfil de jugador
- Puntos totales acumulados, partidas jugadas y rango global.
- Sistema de insignias (Pionero, Intelecto, Veloz, Campeón, Veterano).

### Panel de administrador
Accesible solo para el correo administrador. Incluye 5 secciones:

| Pestaña | Contenido |
|---|---|
| **Overview** | KPIs globales, gráfica de actividad (14 días), distribución de puntajes, top 5 jugadores, últimas sesiones |
| **Jugadores** | Tabla completa de jugadores con historial expandible por jugador |
| **Sesiones** | Todas las partidas con filtro por categoría |
| **Categorías** | Comparación de métricas entre Mixta y Programación (gráfica de barras y radar) |
| **Reportes** | Perfil de comportamiento por jugador: etiqueta, tendencias, métricas de racha, distribución de sesiones y observaciones en lenguaje natural |

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + TypeScript |
| Estilos | Tailwind CSS v4 |
| Animaciones | Framer Motion (motion/react) |
| Gráficas | Recharts |
| Iconos | Lucide React |
| Enrutamiento | React Router DOM v7 |
| Backend / Auth | Firebase Authentication |
| Base de datos | Firebase Firestore |
| Hosting | Firebase Hosting |
| Build | Vite 6 |

---

## Estructura del proyecto

```
src/
├── components/
│   ├── ThemeToggle.tsx        # Boton claro/oscuro (variantes nav y surface)
│   └── layout/
│       └── MobileFrame.tsx
├── context/
│   ├── AuthContext.tsx        # Sesion de usuario y perfil de Firestore
│   └── ThemeContext.tsx       # Modo claro/oscuro (persiste en localStorage)
├── lib/
│   ├── analytics.ts           # Motor de analisis de comportamiento (sin UI)
│   ├── firebase.ts            # Configuracion y exports de Firebase
│   ├── questions.ts           # Banco de preguntas + logica de seleccion
│   └── utils.ts               # Helper cn() para clases condicionales
└── pages/
    ├── Login.tsx              # Autenticacion con Google
    ├── Lobby.tsx              # Pantalla principal: categorias + leaderboard
    ├── GameRoom.tsx           # Sala de juego con timer adaptativo y rachas
    ├── Profile.tsx            # Perfil del jugador
    └── Admin.tsx              # Panel de analytics (solo administrador)
```

---

## Colecciones en Firestore

| Coleccion | Descripcion |
|---|---|
| `users/{uid}` | Perfil del jugador: username, avatar, totalPoints, gamesPlayed |
| `leaderboard/{uid}` | Mejor puntaje historico por jugador |
| `sessions/{id}` | Registro de cada partida: score, accuracy, avgTimeUsed, timerReductions, maxStreak, timeRecoveries, etc. |

---

## Cómo ejecutar en local

**Requisitos:** Node.js 18+, cuenta de Firebase con Firestore y Authentication habilitados.

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para produccion
npm run build

# Desplegar en Firebase Hosting
firebase deploy --only hosting
```

---

## Motor de analisis de comportamiento

La funcion `generarReporteFinal(sessions, jugador?)` en `src/lib/analytics.ts` procesa las sesiones de un jugador y devuelve:

- **Promedios:** puntaje, precision, tiempo por pregunta, reducciones de timer, racha maxima, recuperaciones de tiempo.
- **Tendencias:** velocidad (rapido/moderado/lento), precision, consistencia, presion de timer, progresion por regresion lineal, categoria favorita, racha maxima.
- **Perfil conductual:** una de 8 etiquetas (Jugador de Respuesta Rapida, Metodico, Equilibrado, Impulsivo, Propenso al Panico, en Progreso, Constante, en Desarrollo) con fortalezas, areas de oportunidad y nivel de confianza.
- **Insights:** observaciones automaticas en lenguaje natural basadas en los datos.

---

## Banco de preguntas

| Categoria de juego | Preguntas disponibles |
|---|---|
| Mixta | 239 preguntas (cultura general, ciencia, historia, geografia, El Salvador, deportes, matematicas, etc.) |
| Programacion | 126 preguntas (Java, Spring Boot, POO, estructuras de datos, algoritmos, bases de datos, patrones de diseno) |

Cada partida toma 15 preguntas aleatorias del pool correspondiente.

---

## Desarrollado por 

Hardcode275
