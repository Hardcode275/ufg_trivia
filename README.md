# Trivia UFG

Plataforma de trivia interactiva desarrollada para estudiantes de la Universidad Francisco Gavidia (UFG). Los jugadores compiten respondiendo preguntas de cultura general y programación, acumulan puntos en un leaderboard global y pueden consultar su progreso en un perfil personal.

**URL en producción:** https://mimetic-coral-482015-m5.web.app

---

## Características principales

### Juego
- **Dos categorías:** Mixta (300 preguntas de cultura general, geografía, ciencia, historia, El Salvador, matemáticas, deportes, literatura, etc.) y Programación (188 preguntas de Java, Spring Boot, POO, algoritmos, estructuras de datos, bases de datos, patrones de diseño y más).
- **15 preguntas por partida**, seleccionadas aleatoriamente del banco de cada categoría.
- **Timer adaptativo:** cada pregunta inicia con 10 segundos. Si el jugador tarda más del 55% del tiempo disponible, el límite baja 1 segundo en la siguiente (mínimo 5 s).
- **Sistema de racha:** cada 2 respuestas correctas consecutivas se recupera 1 segundo perdido (hasta el máximo inicial de 10 s). Se muestra un badge en tiempo real.
- **Puntaje por velocidad:** `puntos = segundos restantes × 10`. Responder rápido y correcto maximiza el puntaje.

### Autenticación
- Inicio de sesión exclusivo con **Google OAuth** mediante Firebase Authentication.
- Redirección automática al lobby si el usuario ya tiene sesión activa al visitar `/login`.
- Creación automática de perfil en Firestore en el primer inicio de sesión.
- Avatar generado con DiceBear API si el usuario no tiene foto de Google.

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
| Animaciones | Motion (motion/react) |
| Gráficas | Recharts |
| Iconos | Lucide React |
| Enrutamiento | React Router DOM v7 |
| Backend / Auth | Firebase Authentication (Google OAuth) |
| Base de datos | Firebase Firestore |
| Hosting | Firebase Hosting |
| Build | Vite 6 |

---

## Estructura del proyecto

```
src/
├── components/
│   ├── ThemeToggle.tsx        # Botón claro/oscuro (variantes nav y surface)
│   └── layout/
│       └── MobileFrame.tsx
├── context/
│   ├── AuthContext.tsx        # Sesión de usuario, perfil de Firestore y hook useAuth()
│   └── ThemeContext.tsx       # Modo claro/oscuro (persiste en localStorage)
├── lib/
│   ├── analytics.ts           # Motor de análisis de comportamiento (sin UI)
│   ├── firebase.ts            # Configuración y exports de Firebase
│   ├── questions.ts           # Banco de 300 preguntas + lógica de selección por categoría
│   └── utils.ts               # Helper cn() para clases condicionales
└── pages/
    ├── Login.tsx              # Autenticación con Google (con dark mode y estado de carga)
    ├── Lobby.tsx              # Pantalla principal: categorías + leaderboard
    ├── GameRoom.tsx           # Sala de juego con timer adaptativo y rachas
    ├── Profile.tsx            # Perfil del jugador con insignias
    └── Admin.tsx              # Panel de analytics (solo administrador)
```

---

## Banco de preguntas

| Categoría de juego | Pool disponible | Subcategorías incluidas |
|---|---|---|
| **Mixta** | **300 preguntas** | Todas las subcategorías del banco completo |
| **Programación** | **188 preguntas** | Solo subcategorías técnicas (ver detalle abajo) |

Cada partida toma **15 preguntas aleatorias** del pool correspondiente.

### Desglose del banco por subcategoría

#### Programación (188 preguntas)

| Subcategoría | Cantidad |
|---|---|
| Tecnología | 25 |
| Estructuras de Datos | 22 |
| Java | 21 |
| Algoritmos | 20 |
| Bases de Datos | 20 |
| Patrones de Diseño | 20 |
| POO | 20 |
| Programación | 20 |
| Spring Boot | 20 |

#### Exclusivas de Mixta (112 preguntas adicionales)

| Subcategoría | Cantidad |
|---|---|
| Geografía | 34 |
| Ciencia | 20 |
| El Salvador | 16 |
| Historia | 10 |
| Deportes | 8 |
| Matemáticas | 7 |
| Literatura | 5 |
| Arte | 4 |
| Universidad | 3 |
| Economía | 2 |
| UFG | 2 |
| Historia SV | 1 |

---

## Motor de análisis de comportamiento

La función `generarReporteFinal(sessions, jugador?)` en `src/lib/analytics.ts` procesa las sesiones de un jugador y devuelve un reporte completo con los siguientes bloques:

### Datos recolectados por sesión

| Campo | Descripción |
|---|---|
| `score` | Puntaje obtenido en la partida |
| `correct / total` | Respuestas correctas de 15 |
| `accuracy` | Precisión en % |
| `avgTimeUsed` | Segundos promedio por pregunta |
| `finalTimeLimit` | Segundos del timer al terminar la partida |
| `timerReductions` | Veces que el timer adaptativo se redujo |
| `maxStreak` | Racha máxima de respuestas correctas seguidas |
| `timeRecoveries` | Veces que se recuperó +1 s por racha |
| `category` | `mixta` o `programacion` |

### Bloques del reporte

**Promedios:** puntaje (promedio, mejor y peor), precisión, tiempo por pregunta, reducciones de timer, timer final, correctas por partida, racha máxima y recuperaciones de tiempo.

**Porcentajes:** sesiones con timer reducido, sesiones con precisión alta/media/baja, distribución de partidas entre Mixta y Programación.

**Rendimiento por categoría:** para Mixta y Programación por separado — sesiones, puntaje promedio, precisión promedio, tiempo promedio y mejor puntaje.

**Tendencias calculadas automáticamente:**

| Tendencia | Lógica |
|---|---|
| Velocidad | < 3.5 s = Rápido / 3.5–6.5 s = Moderado / > 6.5 s = Lento |
| Precisión | ≥ 70% = Alta / 50–69% = Media / < 50% = Baja |
| Consistencia | Coeficiente de variación de puntajes: < 15% = Alta / 15–30% = Media / > 30% = Baja |
| Presión del timer | % sesiones con reducción: > 50% = Alta / 20–50% = Media / < 20% = Baja |
| Progresión | Regresión lineal sobre puntajes (requiere ≥ 4 sesiones): pendiente > 5% = Mejorando / < −5% = Declinando / else = Estable |
| Categoría favorita | La más jugada (diferencia < 20% = Equilibrado) |
| Categoría fuerte | Donde obtiene mejor precisión relativa (diferencia ≥ 5%) |
| Racha máxima | ≥ 4 correctas seguidas en promedio = Alta / ≥ 2 = Media / < 2 = Baja |

**Perfil conductual — 8 perfiles posibles:**

| Perfil | Condición de asignación |
|---|---|
| Jugador de Respuesta Rápida | Velocidad rápida + precisión alta |
| Jugador Metódico | Velocidad lenta + precisión alta |
| Jugador Equilibrado | Velocidad moderada + precisión alta |
| Jugador Impulsivo | Velocidad rápida + precisión baja |
| Jugador Propenso al Pánico | Presión del timer alta + precisión baja |
| Jugador en Progreso | Tendencia de mejora sostenida |
| Jugador Constante | Consistencia alta entre sesiones |
| Jugador en Desarrollo | Default — rendimiento variable sin patrón claro |

El nivel de confianza del perfil escala con el número de sesiones: 1 sesión = 50%, 2–3 sesiones = 75%, 4+ sesiones = confianza completa.

**Insights:** observaciones automáticas en lenguaje natural basadas en los datos (velocidad, timer, precisión, categorías, progresión, variación y rachas).

---

## Colecciones en Firestore

| Colección | Descripción |
|---|---|
| `users/{uid}` | Perfil del jugador: username, avatar, totalPoints, gamesPlayed, lastActive |
| `leaderboard/{uid}` | Mejor puntaje histórico por jugador |
| `sessions/{id}` | Registro de cada partida: score, accuracy, avgTimeUsed, timerReductions, maxStreak, timeRecoveries, category, playedAt |

---

## Cómo ejecutar en local

**Requisitos:** Node.js 18+, cuenta de Firebase con Firestore y Authentication habilitados, dominio `localhost` autorizado en Firebase Console → Authentication → Authorized domains.

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Desplegar en Firebase Hosting
firebase deploy --only hosting
```

---

## Desarrollado por

Hardcode275
