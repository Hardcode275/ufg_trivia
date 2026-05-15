import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { db, collection, query, orderBy, limit, onSnapshot } from '../lib/firebase';
import { Zap, Trophy, LogOut, GraduationCap, User, Medal, Shuffle, Code2, LayoutDashboard } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { useNavigate } from 'react-router-dom';
import { auth, signOut } from '../lib/firebase';
import { cn } from '../lib/utils';
import type { GameCategory } from '../lib/questions';

export const Lobby = () => {
  const { user, profile } = useAuth();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const navigate = useNavigate();
  const isAdmin = user?.email === 'haroldorellana20@gmail.com' || profile?.canViewAnalytics === true;

  useEffect(() => {
    const q = query(collection(db, 'leaderboard'), orderBy('score', 'desc'), limit(10));
    return onSnapshot(q, snap => {
      setLeaderboard(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const play = (category: GameCategory) => navigate('/game', { state: { category } });

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 transition-colors">

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="bg-ufg-blue text-white px-4 sm:px-8 py-4 flex items-center justify-between shadow-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-ufg-gold rounded-xl flex items-center justify-center rotate-6 shadow-md">
            <GraduationCap className="w-6 h-6 text-ufg-blue" />
          </div>
          <div>
            <h1 className="text-lg font-display font-extrabold leading-none">Trivia UFG</h1>
            <p className="text-blue-300/60 text-xs font-medium">Prueba Tus Conocomientos</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/profile')}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-3 py-2.5 rounded-xl"
          >
            <img
              src={profile?.avatar || `https://api.dicebear.com/9.x/avataaars/png?seed=${user?.uid}`}
              onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${profile?.username || 'U'}&background=003366&color=FFD700`; }}
              className="w-7 h-7 rounded-lg" referrerPolicy="no-referrer" alt="avatar"
            />
            <span className="font-bold text-sm hidden sm:block">{profile?.username}</span>
          </button>
          {isAdmin && (
            <motion.button whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2 bg-ufg-gold/20 hover:bg-ufg-gold/30 transition-colors px-3 py-2.5 rounded-xl"
              title="Panel de Analytics"
            >
              <LayoutDashboard className="w-5 h-5 text-ufg-gold" />
              <span className="font-bold text-sm text-ufg-gold hidden sm:block">Analytics</span>
            </motion.button>
          )}
          <ThemeToggle />
          <motion.button whileTap={{ scale: 0.9 }}
            onClick={() => signOut(auth)}
            className="p-2.5 bg-white/10 hover:bg-white/20 transition-colors rounded-xl"
            title="Cerrar sesión"
          >
            <LogOut className="w-5 h-5" />
          </motion.button>
        </div>
      </nav>

      {/* ── Layout ─────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 gap-6">

        {/* Panel lateral */}
        <aside className="w-full lg:w-72 flex-shrink-0 space-y-4 lg:space-y-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700"
          >
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <img
                  src={profile?.avatar || `https://api.dicebear.com/9.x/avataaars/png?seed=${user?.uid}`}
                  onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${profile?.username || 'U'}&background=003366&color=FFD700`; }}
                  className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg cursor-pointer"
                  referrerPolicy="no-referrer"
                  onClick={() => navigate('/profile')} alt="avatar"
                />
                <div className="absolute -bottom-2 -right-2 bg-ufg-gold w-6 h-6 rounded-lg flex items-center justify-center border-2 border-white">
                  <User className="w-3 h-3 text-ufg-blue" />
                </div>
              </div>
              <h2 className="text-xl font-display font-bold text-slate-800 dark:text-slate-100">{profile?.username}</h2>
              <p className="text-slate-400 dark:text-slate-400 text-sm font-medium">Estudiante UFG</p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <StatCard icon={<Trophy className="w-4 h-4 text-ufg-gold" />} label="Puntos"  value={profile?.totalPoints || 0} />
              <StatCard icon={<Zap    className="w-4 h-4 text-blue-500" />} label="Partidas" value={profile?.gamesPlayed || 0} />
            </div>
          </motion.div>

          {/* Info rápida */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="bg-ufg-blue rounded-3xl p-6 shadow-sm text-white relative overflow-hidden"
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-8 -right-8 w-28 h-28 border-4 border-ufg-gold/20 rounded-full"
            />
            <h3 className="font-display font-bold text-lg mb-2 relative z-10">¿Cómo funciona?</h3>
            <ul className="space-y-2 relative z-10">
              {['10 segundos por pregunta', 'Responde rápido = más puntos', 'Si tardas, el tiempo baja', 'Al acertar 2 preguntas sube un segundo.'].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-blue-200/80 text-sm">
                  <span className="text-ufg-gold font-bold mt-0.5">{i + 1}.</span>{tip}
                </li>
              ))}
            </ul>
          </motion.div>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 min-w-0 space-y-8">

          {/* ── Selección de categoría ──────────────────────────────────────── */}
          <section>
            <h3 className="text-3xl font-display font-bold text-slate-800 dark:text-slate-100 mb-2">Elige una categoría</h3>
            <p className="text-slate-400 dark:text-slate-400 font-medium mb-6">Selecciona el modo de juego que quieras</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Mixta */}
              <motion.button
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                onClick={() => play('mixta')}
                className="relative overflow-hidden bg-gradient-to-br from-ufg-gold to-yellow-400 rounded-3xl p-8 text-left shadow-lg shadow-ufg-gold/30 group"
              >
                <motion.div
                  animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute -top-6 -right-6 w-24 h-24 border-4 border-white/20 rounded-full"
                />
                <div className="w-14 h-14 bg-white/30 rounded-2xl flex items-center justify-center mb-4">
                  <Shuffle className="w-7 h-7 text-ufg-blue" />
                </div>
                <h4 className="text-2xl font-display font-black text-ufg-blue mb-1">Mixta</h4>
                <p className="text-ufg-blue/70 font-medium text-sm leading-relaxed">
                  Ciencia, historia, geografía, arte, deportes y más. ¡Un poco de todo!
                </p>
                <div className="mt-4 flex items-center gap-2 text-ufg-blue/60 text-xs font-bold uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5" />
                  300 preguntas(banco completo)
                </div>
              </motion.button>

              {/* Programación */}
              <motion.button
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
                whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                onClick={() => play('programacion')}
                className="relative overflow-hidden bg-gradient-to-br from-ufg-blue to-blue-700 rounded-3xl p-8 text-left shadow-lg shadow-ufg-blue/30 group"
              >
                <motion.div
                  animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute -top-6 -right-6 w-24 h-24 border-4 border-white/10 rounded-full"
                />
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                  <Code2 className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-2xl font-display font-black text-white mb-1">Programación</h4>
                <p className="text-blue-200/80 font-medium text-sm leading-relaxed">
                  POO, estructuras de datos, algoritmos, bases de datos y patrones de diseño.
                </p>
                <div className="mt-4 flex items-center gap-2 text-blue-300/70 text-xs font-bold uppercase tracking-wider">
                  <Code2 className="w-3.5 h-3.5" />
                  188 preguntas
                </div>
              </motion.button>
            </div>
          </section>

          {/* ── Leaderboard ─────────────────────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-7 h-7 text-ufg-gold" />
              <div>
                <h3 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100">Clasificación Global</h3>
                <p className="text-slate-400 dark:text-slate-400 text-sm font-medium">Top 10 mejores puntuaciones</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
              {leaderboard.length === 0 ? (
                <div className="text-center py-16">
                  <Trophy className="w-14 h-14 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-500 font-display font-bold text-lg mb-1">Sin partidas todavía</p>
                  <p className="text-slate-400 text-sm font-medium">¡Juega y sé el primero en aparecer aquí!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                <div className="divide-y divide-slate-50 dark:divide-slate-700 min-w-[480px]">
                  {/* Header */}
                  <div className="grid grid-cols-[3rem_1fr_7rem_6rem_6rem] gap-3 px-6 py-3 bg-slate-50 dark:bg-slate-700/50">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">#</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Jugador</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Categoría</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Correctas</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Puntos</span>
                  </div>

                  {leaderboard.map((entry, idx) => (
                    <motion.div key={entry.id}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className={cn(
                        'grid grid-cols-[3rem_1fr_7rem_6rem_6rem] gap-3 items-center px-6 py-4 divide-y divide-slate-50 dark:divide-slate-700',
                        idx === 0 && 'bg-ufg-gold/5',
                        entry.uid === user?.uid && 'ring-1 ring-inset ring-ufg-blue/20 bg-ufg-blue/5',
                      )}
                    >
                      <div className="flex items-center justify-center">
                        {idx === 0 ? <Medal className="w-5 h-5 text-yellow-500" />
                          : idx === 1 ? <Medal className="w-5 h-5 text-slate-400" />
                          : idx === 2 ? <Medal className="w-5 h-5 text-amber-600" />
                          : <span className="text-sm font-bold text-slate-400">#{idx + 1}</span>}
                      </div>

                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={entry.avatar || `https://api.dicebear.com/9.x/avataaars/png?seed=${entry.uid}`}
                          onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${entry.username}&background=003366&color=FFD700`; }}
                          className="w-9 h-9 rounded-xl flex-shrink-0" referrerPolicy="no-referrer" alt={entry.username}
                        />
                        <p className="font-bold text-slate-800 dark:text-slate-100 truncate text-sm">
                          {entry.username}
                          {entry.uid === user?.uid && <span className="text-ufg-blue dark:text-blue-400 ml-1 text-xs">(Tú)</span>}
                        </p>
                      </div>

                      <div>
                        <span className={cn(
                          'text-xs font-black px-2.5 py-1 rounded-lg uppercase tracking-wide',
                          entry.category === 'programacion'
                            ? 'bg-ufg-blue/10 dark:bg-blue-900/40 text-ufg-blue dark:text-blue-300'
                            : 'bg-ufg-gold/20 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
                        )}>
                          {entry.category === 'programacion' ? 'Prog.' : 'Mixta'}
                        </span>
                      </div>

                      <p className="text-right font-bold text-slate-600 dark:text-slate-300 text-sm">
                        {entry.correct}/{entry.total}
                      </p>
                      <p className="text-right font-display font-black text-ufg-blue dark:text-ufg-gold text-lg">
                        {entry.score}
                      </p>
                    </motion.div>
                  ))}
                </div>
                </div>
              )}
            </div>
          </section>

        </main>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) => (
  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-3 flex flex-col items-center border border-slate-100 dark:border-slate-600">
    <div className="flex items-center gap-1.5 mb-1">
      {icon}
      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">{label}</span>
    </div>
    <span className="text-2xl font-display font-black text-slate-800 dark:text-slate-100">{value}</span>
  </div>
);
