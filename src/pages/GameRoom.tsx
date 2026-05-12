import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { db, collection, setDoc, getDoc, addDoc, serverTimestamp, doc, updateDoc, increment } from '../lib/firebase';
import { getCategoryQuestions, GameCategory, Question } from '../lib/questions';
import { Clock, Award, ChevronLeft, CheckCircle2, XCircle, GraduationCap, RotateCcw, Zap } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import toast from 'react-hot-toast';
import { cn } from '../lib/utils';

const TOTAL        = 15;
const INITIAL_SECS = 10;   // timer inicial
const MIN_SECS     = 5;    // mínimo posible
const SLOW_RATIO   = 0.55; // si usaste >55% del tiempo → reduce 1s la siguiente

export const GameRoom = () => {
  const { user, profile } = useAuth();
  const navigate          = useNavigate();
  const { state }         = useLocation();
  const category: GameCategory = state?.category ?? 'mixta';

  const [questions,  setQuestions]  = useState<Question[]>([]);
  const [index,      setIndex]      = useState(0);
  const [phase,      setPhase]      = useState<'answering' | 'revealing'>('answering');
  const [status,     setStatus]     = useState<'loading' | 'playing' | 'finished'>('loading');
  const [timer,      setTimer]      = useState(INITIAL_SECS);
  const [timeLimit,  setTimeLimit]  = useState(INITIAL_SECS); // límite actual (puede bajar)
  const [selected,   setSelected]   = useState<number | null>(null);
  const [score,      setScore]      = useState(0);
  const [correct,    setCorrect]    = useState(0);
  const [streak,     setStreak]     = useState(0);

  const scoreRef            = useRef(0);
  const correctRef          = useRef(0);
  const timerRef            = useRef(INITIAL_SECS);
  const timeLimitRef        = useRef(INITIAL_SECS);
  const timeUsedRef         = useRef(0);
  const timerReductionsRef  = useRef(0);   // cuántas veces se redujo el timer
  const totalTimeUsedRef    = useRef(0);   // suma de tiempo usado en todas las preguntas
  const streakRef           = useRef(0);   // racha actual de correctas seguidas
  const maxStreakRef        = useRef(0);   // racha máxima alcanzada
  const timeRecoveriesRef   = useRef(0);   // cuántas veces se recuperó +1s por racha

  const q = questions[index] ?? null;

  // ── Cargar preguntas al montar ────────────────────────────────────────────
  useEffect(() => {
    setQuestions(getCategoryQuestions(category, TOTAL));
    setStatus('playing');
  }, []);

  // ── Timer (corre solo durante 'answering') ────────────────────────────────
  useEffect(() => {
    if (status !== 'playing' || phase !== 'answering') return;

    timerRef.current = timeLimitRef.current;
    setTimer(timeLimitRef.current);

    const iv = setInterval(() => {
      setTimer(prev => {
        const next = prev - 1;
        timerRef.current = next;
        if (next <= 0) {
          clearInterval(iv);
          streakRef.current = 0;
          setStreak(0);
          timeUsedRef.current      = timeLimitRef.current;
          totalTimeUsedRef.current += timeLimitRef.current;
          setPhase('revealing');
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(iv);
  }, [status, index, phase]);

  // ── Avanzar 2s después del reveal + ajustar timer si fue lento ───────────
  useEffect(() => {
    if (phase !== 'revealing') return;

    const idx   = index;
    const total = questions.length;

    // Reducir límite si el jugador tardó más del umbral
    const slowThreshold = timeLimitRef.current * SLOW_RATIO;
    const willReduce    = timeUsedRef.current >= slowThreshold && timeLimitRef.current > MIN_SECS;

    const t = setTimeout(() => {
      if (willReduce) {
        timeLimitRef.current     -= 1;
        timerReductionsRef.current += 1;
        setTimeLimit(timeLimitRef.current);
        toast('⚡ ¡Tiempo reducido a ' + timeLimitRef.current + 's!', {
          style: { background: '#ef4444', color: '#fff', fontWeight: 'bold' },
          duration: 1500,
        });
      }

      if (idx + 1 >= total) {
        setStatus('finished');
      } else {
        setIndex(idx + 1);
        setSelected(null);
        setPhase('answering');
      }
    }, 2000);

    return () => clearTimeout(t);
  }, [phase, index, questions.length]);

  // ── Guardar resultado al terminar ─────────────────────────────────────────
  useEffect(() => {
    if (status !== 'finished' || !user) return;
    const save = async () => {
      const avgTimeUsed = Math.round((totalTimeUsedRef.current / TOTAL) * 10) / 10;
      // Guardar sesión completa (analytics)
      await addDoc(collection(db, 'sessions'), {
        uid:             user.uid,
        username:        profile?.username || 'Jugador',
        avatar:          profile?.avatar  || '',
        category,
        score:           scoreRef.current,
        correct:         correctRef.current,
        total:           TOTAL,
        accuracy:        Math.round((correctRef.current / TOTAL) * 100),
        avgTimeUsed,
        finalTimeLimit:  timeLimitRef.current,
        timerReductions: timerReductionsRef.current,
        maxStreak:       maxStreakRef.current,
        timeRecoveries:  timeRecoveriesRef.current,
        playedAt:        serverTimestamp(),
      });
      // Actualizar leaderboard (solo mejor puntaje)
      const ref      = doc(db, 'leaderboard', user.uid);
      const existing = await getDoc(ref);
      if (!existing.exists() || scoreRef.current > existing.data().score) {
        await setDoc(ref, {
          uid:      user.uid,
          username: profile?.username || 'Jugador',
          avatar:   profile?.avatar  || '',
          score:    scoreRef.current,
          correct:  correctRef.current,
          total:    TOTAL,
          category,
          playedAt: serverTimestamp(),
        });
      }
      await updateDoc(doc(db, 'users', user.uid), {
        totalPoints: increment(scoreRef.current),
        gamesPlayed: increment(1),
        lastActive:  serverTimestamp(),
      });
    };
    save().catch(console.error);
  }, [status]);

  // ── Responder ─────────────────────────────────────────────────────────────
  const answer = (i: number) => {
    if (selected !== null || phase === 'revealing') return;
    setSelected(i);

    timeUsedRef.current       = timeLimitRef.current - timerRef.current;
    totalTimeUsedRef.current += timeUsedRef.current;

    if (q?.correctIndex === i) {
      const pts = timerRef.current * 10;
      scoreRef.current   += pts;
      correctRef.current += 1;
      setScore(scoreRef.current);
      setCorrect(correctRef.current);

      streakRef.current += 1;
      if (streakRef.current > maxStreakRef.current) maxStreakRef.current = streakRef.current;
      setStreak(streakRef.current);

      // Cada 2 correctas seguidas → recuperar +1s (hasta el máximo inicial)
      if (streakRef.current % 2 === 0 && timeLimitRef.current < INITIAL_SECS) {
        timeLimitRef.current     += 1;
        timeRecoveriesRef.current += 1;
        setTimeLimit(timeLimitRef.current);
        toast(`🔥 ¡Racha ×${streakRef.current}! +1s recuperado`, {
          style: { background: '#22c55e', color: '#fff', fontWeight: 'bold' },
          duration: 1500,
        });
      }
    } else {
      streakRef.current = 0;
      setStreak(0);
    }
    setPhase('revealing');
  };

  // ── Reiniciar ─────────────────────────────────────────────────────────────
  const restart = () => {
    scoreRef.current            = 0;
    correctRef.current          = 0;
    timerRef.current            = INITIAL_SECS;
    timeLimitRef.current        = INITIAL_SECS;
    timeUsedRef.current         = 0;
    timerReductionsRef.current  = 0;
    totalTimeUsedRef.current    = 0;
    streakRef.current           = 0;
    maxStreakRef.current         = 0;
    timeRecoveriesRef.current   = 0;
    setQuestions(getCategoryQuestions(category, TOTAL));
    setIndex(0);
    setSelected(null);
    setPhase('answering');
    setScore(0);
    setCorrect(0);
    setStreak(0);
    setTimeLimit(INITIAL_SECS);
    setStatus('playing');
  };

  if (status === 'loading') return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-ufg-blue dark:border-ufg-gold" />
    </div>
  );

  const timerPct   = (timer / timeLimit) * 100;
  const isUrgent   = timer <= Math.ceil(timeLimit * 0.3);
  const timeDanger = timeLimit <= MIN_SECS + 1;

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 transition-colors">

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="bg-ufg-blue text-white px-4 sm:px-8 py-4 flex items-center justify-between shadow-xl sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-ufg-gold rounded-xl flex items-center justify-center rotate-6">
              <GraduationCap className="w-5 h-5 text-ufg-blue" />
            </div>
            <div>
              <h1 className="font-display font-extrabold leading-none">Trivia UFG</h1>
              <p className="text-blue-300/60 text-xs">
                {status === 'playing'
                  ? `Pregunta ${index + 1} de ${questions.length || TOTAL}`
                  : 'Partida finalizada'}
              </p>
            </div>
          </div>
        </div>

        {status === 'playing' && (
          <div className="flex items-center gap-3">
            {/* Racha */}
            {streak > 0 && (
              <div className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-black bg-green-500/20 text-green-300">
                🔥 ×{streak}
              </div>
            )}

            {/* Límite actual */}
            <div className={cn(
              'hidden sm:flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-black transition-colors',
              timeDanger ? 'bg-red-500/30 text-red-300' : 'bg-white/10 text-blue-200/60',
            )}>
              <Zap className="w-3 h-3" />
              límite {timeLimit}s
            </div>

            {/* Countdown */}
            <div className={cn(
              'flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 rounded-2xl font-display font-black text-xl sm:text-2xl transition-colors',
              isUrgent ? 'bg-red-500/20 text-red-300 animate-pulse' : 'bg-white/10 text-ufg-gold',
            )}>
              <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
              {timer}s
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="font-display font-black text-ufg-gold text-base sm:text-xl">{score} pts</div>
        </div>
      </nav>

      {/* ── Contenido ──────────────────────────────────────────────────────── */}
      <div className="flex-1 max-w-3xl mx-auto w-full p-4 sm:p-8">
        <AnimatePresence mode="wait">

          {/* JUGANDO */}
          {status === 'playing' && (
            <motion.div key={`q-${index}`}
              initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              {/* Barra de tiempo — se adapta al límite actual */}
              <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  key={`bar-${index}`}
                  initial={{ width: '100%' }}
                  animate={{ width: phase === 'revealing' ? '0%' : `${timerPct}%` }}
                  transition={{ ease: 'linear' }}
                  className={cn(
                    'h-full rounded-full',
                    isUrgent   ? 'bg-red-400'
                    : timeDanger ? 'bg-orange-400'
                    : 'bg-ufg-gold',
                  )}
                />
              </div>

              {/* Pregunta */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-10 shadow-sm border border-slate-100 dark:border-slate-700 text-center space-y-4">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <span className="bg-ufg-blue/10 dark:bg-blue-900/40 text-ufg-blue dark:text-blue-300 text-xs font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full">
                    {q?.category}
                  </span>
                  <span className="bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                    {q?.difficulty}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-slate-800 dark:text-slate-100 leading-tight">
                  {q?.text}
                </h3>
                {phase === 'revealing' && (
                  <p className={cn('text-sm font-bold',
                    selected === null             ? 'text-slate-400'
                    : q?.correctIndex === selected ? 'text-green-500'
                    : 'text-red-500',
                  )}>
                    {selected === null             ? '⏱ Tiempo agotado'
                    : q?.correctIndex === selected ? '✓ ¡Correcto!'
                    : '✗ Incorrecto'}
                  </p>
                )}
              </div>

              {/* Opciones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {q?.options?.map((opt: string, i: number) => {
                  const isCorrect  = q.correctIndex === i;
                  const isSelected = selected === i;
                  const answered   = selected !== null;
                  const revealing  = phase === 'revealing';
                  const timedOut   = revealing && !answered; // tiempo agotado sin respuesta
                  return (
                    <motion.button key={i}
                      whileTap={!answered ? { scale: 0.98 } : {}}
                      onClick={() => answer(i)}
                      disabled={answered || revealing}
                      className={cn(
                        'p-5 rounded-2xl text-left border-2 transition-all flex items-center gap-4',
                        // Esperando respuesta
                        !answered && !revealing                                  && 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-600 hover:border-ufg-blue hover:shadow-md cursor-pointer',
                        answered  && !revealing && isSelected                    && 'bg-blue-50 dark:bg-blue-900/30 border-ufg-blue',
                        answered  && !revealing && !isSelected                   && 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 opacity-40',
                        // Tiempo agotado — correcta en azul neutro, resto gris
                        timedOut  && isCorrect                                   && 'bg-ufg-blue/5 dark:bg-blue-900/20 border-ufg-blue/50 dark:border-blue-500/40',
                        timedOut  && !isCorrect                                  && 'bg-slate-50 dark:bg-slate-700/50 border-slate-100 dark:border-slate-700 opacity-30',
                        // Jugador respondió — verde/rojo normal
                        revealing && answered && isCorrect                       && 'bg-green-50 dark:bg-green-900/20 border-green-500',
                        revealing && answered && isSelected && !isCorrect        && 'bg-red-50 dark:bg-red-900/20 border-red-500',
                        revealing && answered && !isCorrect && !isSelected       && 'bg-slate-50 dark:bg-slate-700/50 border-slate-100 dark:border-slate-700 opacity-40',
                      )}
                    >
                      <span className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0',
                        !answered && !revealing                                  && 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300',
                        answered  && !revealing && isSelected                    && 'bg-ufg-blue text-white',
                        answered  && !revealing && !isSelected                   && 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500',
                        // Tiempo agotado
                        timedOut  && isCorrect                                   && 'bg-ufg-blue/60 dark:bg-blue-600 text-white',
                        timedOut  && !isCorrect                                  && 'bg-slate-200 dark:bg-slate-600 text-slate-400 dark:text-slate-500',
                        // Jugador respondió
                        revealing && answered && isCorrect                       && 'bg-green-500 text-white',
                        revealing && answered && isSelected && !isCorrect        && 'bg-red-500 text-white',
                        revealing && answered && !isCorrect && !isSelected       && 'bg-slate-200 dark:bg-slate-600 text-slate-400 dark:text-slate-500',
                      )}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="font-bold flex-1 text-base text-slate-800 dark:text-slate-100">{opt}</span>
                      {/* Tiempo agotado: reloj sobre la correcta */}
                      {timedOut  && isCorrect                       && <Clock        className="w-5 h-5 text-ufg-blue/70 flex-shrink-0" />}
                      {/* Jugador respondió */}
                      {revealing && answered && isCorrect           && <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />}
                      {revealing && answered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500  flex-shrink-0" />}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* FINALIZADO */}
          {status === 'finished' && (
            <motion.div key="finished"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto space-y-6"
            >
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-10 shadow-sm border border-slate-100 dark:border-slate-700 text-center space-y-4">
                <div className="w-24 h-24 bg-ufg-gold/20 rounded-3xl flex items-center justify-center mx-auto relative">
                  <Award className="w-14 h-14 text-ufg-gold fill-ufg-gold/20" />
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 border-2 border-dashed border-ufg-gold rounded-3xl"
                  />
                </div>
                <h2 className="text-4xl font-display font-black text-slate-800 dark:text-slate-100">¡Partida Finalizada!</h2>
                <p className="text-slate-400 font-medium">{profile?.username}</p>

                <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2">
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-4 text-center">
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-300 uppercase tracking-wide mb-1">Puntos</p>
                    <p className="font-display font-black text-ufg-blue dark:text-ufg-gold text-2xl sm:text-3xl">{score}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-4 text-center">
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-300 uppercase tracking-wide mb-1">Correctas</p>
                    <p className="font-display font-black text-green-500 text-2xl sm:text-3xl">{correct}/{TOTAL}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-4 text-center">
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-300 uppercase tracking-wide mb-1">Precisión</p>
                    <p className="font-display font-black text-slate-700 dark:text-slate-100 text-2xl sm:text-3xl">
                      {Math.round((correct / TOTAL) * 100)}%
                    </p>
                  </div>
                </div>

                {timeLimit < INITIAL_SECS && (
                  <p className="text-xs text-slate-400 font-medium">
                    ⚡ Tu tiempo bajó a {timeLimit}s — ¡desafío aceptado!
                  </p>
                )}
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/')}
                className="w-full bg-ufg-blue text-white py-4 rounded-2xl font-bold shadow-lg text-lg"
              >
                Ver Clasificación
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={restart}
                className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Jugar de Nuevo
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};
