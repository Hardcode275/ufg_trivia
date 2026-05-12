/**
 * Motor de procesamiento de comportamiento del jugador.
 * Sin dependencias de UI — solo transformación de datos.
 */

// ── Types ────────────────────────────────────────────────────────────────────

export interface SessionData {
  id: string;
  uid: string;
  username: string;
  avatar: string;
  category: 'mixta' | 'programacion';
  score: number;
  correct: number;
  total: number;
  accuracy: number;        // 0–100
  avgTimeUsed: number;     // segundos por pregunta (0 = sin dato)
  finalTimeLimit: number;  // segundos al terminar la partida
  timerReductions: number; // veces que el timer se redujo
  maxStreak?: number;      // racha máxima de respuestas correctas seguidas
  timeRecoveries?: number; // veces que se recuperó +1s por racha
  playedAt: any;           // Firestore Timestamp | Date | null
}

export type VelocidadLabel    = 'rapido' | 'moderado' | 'lento';
export type PrecisionLabel    = 'alta' | 'media' | 'baja';
export type ConsistenciaLabel = 'alta' | 'media' | 'baja' | 'sin_datos';
export type PresionLabel      = 'alta' | 'media' | 'baja';
export type ProgresionLabel   = 'mejorando' | 'estable' | 'declinando' | 'sin_datos';
export type CategoriaFav      = 'mixta' | 'programacion' | 'equilibrado';
export type RachaLabel        = 'alta' | 'media' | 'baja' | 'sin_datos';

export interface RendimientoCategoria {
  sesiones:    number;
  avgPuntaje:  number;
  avgPrecision: number;  // %
  avgTiempo:   number;   // s
  mejorPuntaje: number;
}

export interface ReporteFinal {
  /** Jugador analizado. null = reporte global de todos los jugadores. */
  jugador:      { uid: string; username: string; avatar: string } | null;
  generadoEn:   string;  // ISO 8601
  totalSesiones: number;

  promedios: {
    puntaje:            number;
    mejorPuntaje:       number;
    peorPuntaje:        number;
    precision:          number;  // %
    tiempoPorPregunta:  number;  // s  (0 = sin dato)
    reduccionesTimer:   number;  // por partida
    timerFinal:         number;  // s al terminar la partida
    correctasPorPartida: number; // preguntas correctas en promedio
    maxRacha:           number;  // racha máxima promedio de correctas seguidas
    recuperaciones:     number;  // recuperaciones de +1s por racha (por partida)
  };

  porcentajes: {
    sesionesConReduccionTimer: number; // % partidas con ≥1 reducción
    precisionAlta:   number;  // % sesiones ≥ 70 %
    precisionMedia:  number;  // % sesiones 50–69 %
    precisionBaja:   number;  // % sesiones < 50 %
    mixta:           number;  // % partidas en categoría Mixta
    programacion:    number;  // % partidas en Programación
  };

  rendimientoPorCategoria: {
    mixta:        RendimientoCategoria;
    programacion: RendimientoCategoria;
  };

  tendencias: {
    velocidad:          VelocidadLabel;
    precision:          PrecisionLabel;
    consistencia:       ConsistenciaLabel;
    presionTimer:       PresionLabel;
    progresion:         ProgresionLabel;
    categoriaFavorita:  CategoriaFav;
    /** Categoría donde obtiene mejor precisión relativa. */
    categoriaFuerte:    'mixta' | 'programacion' | 'igual' | 'sin_datos';
    /** Qué tan altas son las rachas de respuestas correctas seguidas. */
    rachaMaxima:        RachaLabel;
  };

  perfil: {
    etiqueta:          string;
    descripcion:       string;
    fortalezas:        string[];
    areasOportunidad:  string[];
    /** 0–100: qué tan seguro es el perfil dado el tamaño de muestra. */
    confianza:         number;
  };

  /** Observaciones concretas en lenguaje natural. */
  insights: string[];
}

// ── Math helpers ─────────────────────────────────────────────────────────────

function mean(arr: number[]): number {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

function stddev(arr: number[]): number {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  return Math.sqrt(arr.reduce((s, x) => s + (x - m) ** 2, 0) / arr.length);
}

function pct(count: number, total: number): number {
  return total === 0 ? 0 : Math.round((count / total) * 100);
}

function r1(n: number): number {
  return Math.round(n * 10) / 10;
}

function toDate(ts: any): Date | null {
  if (!ts) return null;
  if (ts.toDate) return ts.toDate();
  if (ts.seconds) return new Date(ts.seconds * 1000);
  return new Date(ts);
}

// ── Trend analysis (linear regression over score vs time index) ───────────────

function calcProgresion(chronoSessions: SessionData[]): ProgresionLabel {
  const n = chronoSessions.length;
  if (n < 4) return 'sin_datos';

  const y = chronoSessions.map(s => s.score);
  const sumX  = (n * (n - 1)) / 2;
  const sumY  = y.reduce((a, b) => a + b, 0);
  const sumXY = y.reduce((acc, yi, i) => acc + i * yi, 0);
  const sumX2 = y.reduce((acc, _, i) => acc + i * i, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
  const avgY  = sumY / n;
  const normalized = avgY > 0 ? slope / avgY : 0;

  if (normalized > 0.05)  return 'mejorando';
  if (normalized < -0.05) return 'declinando';
  return 'estable';
}

// ── Category breakdown ────────────────────────────────────────────────────────

function calcCategoria(sessions: SessionData[]): RendimientoCategoria {
  if (sessions.length === 0) {
    return { sesiones: 0, avgPuntaje: 0, avgPrecision: 0, avgTiempo: 0, mejorPuntaje: 0 };
  }
  const scores    = sessions.map(s => s.score);
  const timedSess = sessions.filter(s => s.avgTimeUsed > 0);
  return {
    sesiones:    sessions.length,
    avgPuntaje:  Math.round(mean(scores)),
    avgPrecision: Math.round(mean(sessions.map(s => s.accuracy))),
    avgTiempo:   timedSess.length ? r1(mean(timedSess.map(s => s.avgTimeUsed))) : 0,
    mejorPuntaje: Math.max(...scores),
  };
}

// ── Profile selector ──────────────────────────────────────────────────────────

interface TendenciasInput {
  velocidad:    VelocidadLabel;
  precision:    PrecisionLabel;
  presionTimer: PresionLabel;
  consistencia: ConsistenciaLabel;
  progresion:   ProgresionLabel;
}

function elegirPerfil(t: TendenciasInput): ReporteFinal['perfil'] {
  const { velocidad, precision, presionTimer, consistencia, progresion } = t;

  // 1. Pánico: timer se reduce mucho Y baja precisión
  if (presionTimer === 'alta' && precision === 'baja') {
    return {
      etiqueta: 'Jugador Propenso al Pánico',
      descripcion:
        'La presión del tiempo lo desestabiliza de forma sistemática. Responde lento, el timer se reduce frecuentemente y la precisión cae. Necesita desarrollar decisión rápida bajo presión.',
      fortalezas: [
        'Persistencia — sigue jugando a pesar de la dificultad',
        'Margen de mejora muy amplio',
      ],
      areasOportunidad: [
        'Practicar decisiones rápidas con categorías que domina',
        'Reducir la indecisión: confiar en el primer instinto',
        'Limitar el tiempo de análisis por pregunta a 4 s',
      ],
      confianza: 88,
    };
  }

  // 2. Impulsivo: rápido pero impreciso
  if (velocidad === 'rapido' && precision === 'baja') {
    return {
      etiqueta: 'Jugador Impulsivo',
      descripcion:
        'Responde muy rápido pero elige mal con frecuencia. Prioriza la velocidad sobre el análisis, lo que genera muchas respuestas incorrectas y puntajes por debajo de su potencial real.',
      fortalezas: [
        'Velocidad de reacción muy alta',
        'No acumula presión de timer adaptativo',
      ],
      areasOportunidad: [
        'Leer todas las opciones antes de elegir',
        'Sacrificar 1–2 s de velocidad a cambio de más precisión',
        'Puntaje potencial mejora más con precisión que con velocidad pura',
      ],
      confianza: 83,
    };
  }

  // 3. Respuesta Rápida: rápido Y preciso — perfil élite
  if (velocidad === 'rapido' && precision === 'alta') {
    return {
      etiqueta: 'Jugador de Respuesta Rápida',
      descripcion:
        'Combina velocidad y precisión de forma excepcional. Identifica la respuesta correcta casi de inmediato, maximizando el bonus de tiempo en cada pregunta.',
      fortalezas: [
        'Velocidad de respuesta óptima',
        'Alta precisión sostenida bajo presión de tiempo',
        'Aprovechamiento máximo del sistema de puntaje',
      ],
      areasOportunidad:
        presionTimer === 'alta'
          ? ['Gestionar mejor los picos de presión del timer adaptativo']
          : ['Mantener la consistencia en sesiones largas'],
      confianza: 91,
    };
  }

  // 4. Metódico: lento pero preciso
  if (velocidad === 'lento' && precision === 'alta') {
    return {
      etiqueta: 'Jugador Metódico',
      descripcion:
        'Analiza cada pregunta con detenimiento y rara vez se equivoca. Prefiere la certeza sobre la velocidad, con alta precisión aunque pierde bonus de tiempo.',
      fortalezas: [
        'Precisión muy alta',
        'Bajo índice de errores por pregunta',
        'Razonamiento analítico cuidadoso',
      ],
      areasOportunidad: [
        'Aumentar la velocidad de respuesta para maximizar el bonus de tiempo',
        'Confiar más en el primer instinto — reduce tiempo sin perder precisión',
      ],
      confianza: 86,
    };
  }

  // 5. Equilibrado: moderado Y preciso
  if (velocidad === 'moderado' && precision === 'alta') {
    return {
      etiqueta: 'Jugador Equilibrado',
      descripcion:
        'Mantiene un balance sólido entre velocidad y precisión. Sus respuestas son consistentemente correctas sin sacrificar tiempo innecesario.',
      fortalezas: [
        'Balance óptimo velocidad / precisión',
        consistencia === 'alta' ? 'Resultados muy consistentes entre sesiones' : 'Adaptabilidad a distintas categorías',
      ],
      areasOportunidad: [
        'Incrementar ligeramente la velocidad para maximizar el bonus de tiempo',
        'Explorar la categoría con menor rendimiento para crecer uniformemente',
      ],
      confianza: 80,
    };
  }

  // 6. En Progreso: la mejora sostenida es la característica dominante
  if (progresion === 'mejorando') {
    return {
      etiqueta: 'Jugador en Progreso',
      descripcion:
        'Muestra una curva de aprendizaje positiva y sostenida. Cada sesión tiende a ser mejor que la anterior, señal de adaptación activa y motivación real.',
      fortalezas: [
        'Curva de aprendizaje acelerada',
        'Mejora continua entre sesiones',
        'Motivación y constancia demostradas',
      ],
      areasOportunidad: [
        'Consolidar los avances para no retroceder en sesiones de baja energía',
        'Enfocarse en la categoría de menor rendimiento para cerrar la brecha',
      ],
      confianza: 76,
    };
  }

  // 7. Constante: alta consistencia de puntajes
  if (consistencia === 'alta') {
    return {
      etiqueta: 'Jugador Constante',
      descripcion:
        'Sus puntajes varían poco entre sesiones, reflejando un nivel de conocimiento estabilizado y un estilo de juego controlado y predecible.',
      fortalezas: [
        'Resultados predecibles y confiables',
        'Control emocional sostenido durante el juego',
      ],
      areasOportunidad: [
        'Intentar estrategias distintas para romper el techo de rendimiento',
        'Jugar ambas categorías para descubrir áreas débiles no evidentes',
      ],
      confianza: 72,
    };
  }

  // 8. Default: En Desarrollo
  return {
    etiqueta: 'Jugador en Desarrollo',
    descripcion:
      'Está en etapa de exploración. El rendimiento es variable, pero hay potencial de mejora considerable con más sesiones y práctica enfocada.',
    fortalezas: [
      'Potencial de mejora significativo',
      'Disposición a seguir jugando',
    ],
    areasOportunidad: [
      'Aumentar la cantidad de sesiones para estabilizar el rendimiento',
      'Enfocarse en una categoría a la vez para ganar confianza',
      'Trabajar velocidad y precisión de forma balanceada',
    ],
    confianza: 58,
  };
}

// ── Insight generator ─────────────────────────────────────────────────────────

function generarInsights(
  n: number,
  promedios: ReporteFinal['promedios'],
  porcentajes: ReporteFinal['porcentajes'],
  tendencias: ReporteFinal['tendencias'],
  rpc: ReporteFinal['rendimientoPorCategoria'],
): string[] {
  const out: string[] = [];

  // Velocidad
  if (promedios.tiempoPorPregunta > 0) {
    if (tendencias.velocidad === 'rapido') {
      out.push(`Responde en promedio ${promedios.tiempoPorPregunta}s/pregunta — velocidad de élite.`);
    } else if (tendencias.velocidad === 'lento') {
      out.push(`Tarda ${promedios.tiempoPorPregunta}s/pregunta en promedio. Bajar a menos de 5 s aumentaría el puntaje de forma notable.`);
    }
  }

  // Timer adaptativo
  if (porcentajes.sesionesConReduccionTimer > 60) {
    out.push(`El timer adaptativo se activó en el ${porcentajes.sesionesConReduccionTimer}% de las partidas — hay un patrón de respuesta lenta frecuente.`);
  } else if (porcentajes.sesionesConReduccionTimer === 0 && n >= 2) {
    out.push('Nunca activó el timer adaptativo — gestiona el tiempo de respuesta de forma excelente.');
  }

  // Precisión
  if (promedios.precision >= 80) {
    out.push(`Precisión del ${promedios.precision}% — domina el contenido de las preguntas.`);
  } else if (promedios.precision < 50) {
    out.push(`Solo acierta el ${promedios.precision}% de las preguntas. Repasar los temas base de cada categoría ayudaría considerablemente.`);
  }

  // Categoría favorita vs fuerte
  if (tendencias.categoriaFavorita !== 'equilibrado') {
    const fav   = tendencias.categoriaFavorita === 'mixta' ? 'Mixta' : 'Programación';
    const other = tendencias.categoriaFavorita === 'mixta' ? 'Programación' : 'Mixta';
    out.push(`Juega principalmente ${fav} (${porcentajes[tendencias.categoriaFavorita]}% de sus partidas). Explorar ${other} puede revelar áreas de mejora.`);
  }

  // Categoría fuerte vs débil
  if (rpc.mixta.sesiones > 0 && rpc.programacion.sesiones > 0) {
    const diff = rpc.mixta.avgPrecision - rpc.programacion.avgPrecision;
    if (Math.abs(diff) >= 10) {
      const fuerte = diff > 0 ? 'Mixta' : 'Programación';
      const debil  = diff > 0 ? 'Programación' : 'Mixta';
      const gap    = Math.abs(diff);
      out.push(`Rinde ${gap}% mejor en ${fuerte} que en ${debil} — hay una brecha de conocimiento entre categorías.`);
    }
  }

  // Progresión
  if (tendencias.progresion === 'mejorando') {
    out.push('Los puntajes muestran una tendencia positiva clara — mejora sesión a sesión.');
  } else if (tendencias.progresion === 'declinando') {
    out.push('Los puntajes recientes son menores que los anteriores — puede ser fatiga o menor concentración.');
  }

  // Variación entre mejor y peor partida
  if (n >= 3) {
    const spread = promedios.mejorPuntaje - promedios.peorPuntaje;
    if (spread > 500) {
      out.push(`Gran variación entre su mejor (${promedios.mejorPuntaje} pts) y peor (${promedios.peorPuntaje} pts) partida — rendimiento inconsistente.`);
    }
  }

  // Timer final bajo
  if (promedios.timerFinal > 0 && promedios.timerFinal <= 6) {
    out.push(`El timer llegó a ${promedios.timerFinal}s al final de las partidas en promedio — señal de alta presión acumulada.`);
  }

  // Rachas
  if (promedios.maxRacha >= 4) {
    out.push(`Alcanza rachas de ${promedios.maxRacha} respuestas seguidas en promedio — dominio y concentración elevados.`);
  } else if (promedios.maxRacha <= 1 && n >= 3) {
    out.push('Rara vez encadena dos respuestas correctas seguidas — la consistencia es un área clave de mejora.');
  }
  if (promedios.recuperaciones > 0) {
    out.push(`Recuperó tiempo del timer ${promedios.recuperaciones} vez/partida en promedio gracias a su racha.`);
  }

  // Promedio de correctas
  if (promedios.correctasPorPartida > 0) {
    out.push(`Responde correctamente ${promedios.correctasPorPartida} de ${/* total typical */15} preguntas por partida en promedio.`);
  }

  return out;
}

// ── generarReporteFinal ───────────────────────────────────────────────────────

/**
 * Genera un reporte completo de comportamiento a partir de un conjunto de sesiones.
 *
 * @param sessions  Sesiones a analizar (pueden ser de un solo jugador o de varios).
 * @param jugador   Datos del jugador si el análisis es individual. Omitir para reporte global.
 * @returns         ReporteFinal con promedios, porcentajes, tendencias, perfil e insights.
 *
 * @example
 * // Por jugador
 * const misSesiones = allSessions.filter(s => s.uid === user.uid);
 * const reporte = generarReporteFinal(misSesiones, { uid: user.uid, username: 'Harold', avatar: '' });
 *
 * // Global
 * const global = generarReporteFinal(allSessions);
 */
export function generarReporteFinal(
  sessions: SessionData[],
  jugador?: { uid: string; username: string; avatar: string },
): ReporteFinal {
  const n = sessions.length;

  const empty: ReporteFinal = {
    jugador:      jugador ?? null,
    generadoEn:   new Date().toISOString(),
    totalSesiones: 0,
    promedios: {
      puntaje: 0, mejorPuntaje: 0, peorPuntaje: 0, precision: 0,
      tiempoPorPregunta: 0, reduccionesTimer: 0, timerFinal: 0, correctasPorPartida: 0,
      maxRacha: 0, recuperaciones: 0,
    },
    porcentajes: {
      sesionesConReduccionTimer: 0, precisionAlta: 0, precisionMedia: 0,
      precisionBaja: 0, mixta: 0, programacion: 0,
    },
    rendimientoPorCategoria: {
      mixta:        { sesiones: 0, avgPuntaje: 0, avgPrecision: 0, avgTiempo: 0, mejorPuntaje: 0 },
      programacion: { sesiones: 0, avgPuntaje: 0, avgPrecision: 0, avgTiempo: 0, mejorPuntaje: 0 },
    },
    tendencias: {
      velocidad: 'moderado', precision: 'baja', consistencia: 'sin_datos',
      presionTimer: 'baja', progresion: 'sin_datos', categoriaFavorita: 'equilibrado',
      categoriaFuerte: 'sin_datos', rachaMaxima: 'sin_datos',
    },
    perfil: {
      etiqueta: 'Sin datos suficientes',
      descripcion: 'Se necesitan al menos 1 sesión para generar un perfil.',
      fortalezas: [], areasOportunidad: [], confianza: 0,
    },
    insights: [],
  };

  if (n === 0) return empty;

  // Sessions sorted oldest → newest for trend analysis
  const chrono = [...sessions].sort(
    (a, b) => (toDate(a.playedAt)?.getTime() ?? 0) - (toDate(b.playedAt)?.getTime() ?? 0),
  );

  // ── Promedios ─────────────────────────────────────────────────────────────
  const scores     = sessions.map(s => s.score);
  const accuracies = sessions.map(s => s.accuracy);
  const corrects   = sessions.map(s => s.correct);
  const timed      = sessions.filter(s => s.avgTimeUsed > 0);
  const reductions = sessions.map(s => s.timerReductions || 0);
  const timers     = sessions.map(s => s.finalTimeLimit || 10);
  const streaks    = sessions.map(s => s.maxStreak ?? 0);
  const recoveries = sessions.map(s => s.timeRecoveries ?? 0);

  const promedios: ReporteFinal['promedios'] = {
    puntaje:             Math.round(mean(scores)),
    mejorPuntaje:        Math.max(...scores),
    peorPuntaje:         Math.min(...scores),
    precision:           Math.round(mean(accuracies)),
    tiempoPorPregunta:   timed.length ? r1(mean(timed.map(s => s.avgTimeUsed))) : 0,
    reduccionesTimer:    r1(mean(reductions)),
    timerFinal:          r1(mean(timers)),
    correctasPorPartida: r1(mean(corrects)),
    maxRacha:            r1(mean(streaks)),
    recuperaciones:      r1(mean(recoveries)),
  };

  // ── Porcentajes ───────────────────────────────────────────────────────────
  const mixta = sessions.filter(s => s.category === 'mixta');
  const prog  = sessions.filter(s => s.category === 'programacion');

  const porcentajes: ReporteFinal['porcentajes'] = {
    sesionesConReduccionTimer: pct(sessions.filter(s => (s.timerReductions || 0) > 0).length, n),
    precisionAlta:             pct(sessions.filter(s => s.accuracy >= 70).length, n),
    precisionMedia:            pct(sessions.filter(s => s.accuracy >= 50 && s.accuracy < 70).length, n),
    precisionBaja:             pct(sessions.filter(s => s.accuracy < 50).length, n),
    mixta:                     pct(mixta.length, n),
    programacion:              pct(prog.length, n),
  };

  // ── Rendimiento por categoría ─────────────────────────────────────────────
  const rendimientoPorCategoria: ReporteFinal['rendimientoPorCategoria'] = {
    mixta:        calcCategoria(mixta),
    programacion: calcCategoria(prog),
  };

  // ── Tendencias ────────────────────────────────────────────────────────────
  const avgTime = promedios.tiempoPorPregunta;
  const velocidad: VelocidadLabel =
    avgTime === 0 ? 'moderado' : avgTime < 3.5 ? 'rapido' : avgTime < 6.5 ? 'moderado' : 'lento';

  const avgPrec = promedios.precision;
  const precisionLevel: PrecisionLabel =
    avgPrec >= 70 ? 'alta' : avgPrec >= 50 ? 'media' : 'baja';

  const scoreCV = promedios.puntaje > 0 ? stddev(scores) / promedios.puntaje : 0;
  const consistencia: ConsistenciaLabel =
    n < 3 ? 'sin_datos' : scoreCV < 0.15 ? 'alta' : scoreCV < 0.30 ? 'media' : 'baja';

  const presionTimer: PresionLabel =
    porcentajes.sesionesConReduccionTimer > 50 ? 'alta'
    : porcentajes.sesionesConReduccionTimer > 20 ? 'media'
    : 'baja';

  const progresion = calcProgresion(chrono);

  const categoriaFavorita: CategoriaFav =
    Math.abs(porcentajes.mixta - porcentajes.programacion) < 20 ? 'equilibrado'
    : porcentajes.mixta > porcentajes.programacion ? 'mixta'
    : 'programacion';

  let categoriaFuerte: ReporteFinal['tendencias']['categoriaFuerte'] = 'sin_datos';
  if (mixta.length > 0 && prog.length > 0) {
    const diff = rendimientoPorCategoria.mixta.avgPrecision - rendimientoPorCategoria.programacion.avgPrecision;
    categoriaFuerte = Math.abs(diff) < 5 ? 'igual' : diff > 0 ? 'mixta' : 'programacion';
  }

  const avgMaxStreak = mean(streaks);
  const rachaMaxima: RachaLabel =
    n < 2 ? 'sin_datos' : avgMaxStreak >= 4 ? 'alta' : avgMaxStreak >= 2 ? 'media' : 'baja';

  const tendencias: ReporteFinal['tendencias'] = {
    velocidad, precision: precisionLevel, consistencia,
    presionTimer, progresion, categoriaFavorita, categoriaFuerte, rachaMaxima,
  };

  // ── Perfil ────────────────────────────────────────────────────────────────
  const perfilBase = elegirPerfil(tendencias);
  const confianzaFinal =
    n < 2 ? Math.round(perfilBase.confianza * 0.5)
    : n < 4 ? Math.round(perfilBase.confianza * 0.75)
    : perfilBase.confianza;
  const perfil: ReporteFinal['perfil'] = { ...perfilBase, confianza: confianzaFinal };

  // ── Insights ──────────────────────────────────────────────────────────────
  const insights = generarInsights(n, promedios, porcentajes, tendencias, rendimientoPorCategoria);

  return {
    jugador:      jugador ?? null,
    generadoEn:   new Date().toISOString(),
    totalSesiones: n,
    promedios,
    porcentajes,
    rendimientoPorCategoria,
    tendencias,
    perfil,
    insights,
  };
}

/**
 * Genera un reporte individual por cada jugador distinto encontrado en el array.
 * Útil para el panel de administrador cuando se quiere analizar a todos los jugadores.
 */
export function generarReportesPorJugador(sessions: SessionData[]): ReporteFinal[] {
  const byPlayer: Record<string, SessionData[]> = {};
  sessions.forEach(s => {
    if (!byPlayer[s.uid]) byPlayer[s.uid] = [];
    byPlayer[s.uid].push(s);
  });

  return Object.values(byPlayer)
    .map(playerSessions => {
      const { uid, username, avatar } = playerSessions[0];
      return generarReporteFinal(playerSessions, { uid, username, avatar });
    })
    .sort((a, b) => (b.promedios.mejorPuntaje ?? 0) - (a.promedios.mejorPuntaje ?? 0));
}
