import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  LayoutDashboard, Users, ListOrdered, Tag, ChevronLeft,
  TrendingUp, Zap, Target, Clock, Award, GraduationCap,
  ArrowUpRight, ArrowDownRight, Brain, Flame, Shield, DatabaseZap, CheckCircle2,
  AlertTriangle, Star, FileText, Menu, X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { db, collection, query, orderBy, onSnapshot, getDocs, addDoc } from '../lib/firebase';
import { ThemeToggle } from '../components/ThemeToggle';
import { cn } from '../lib/utils';
import { generarReporteFinal, type ReporteFinal } from '../lib/analytics';

const ADMIN_EMAILS = ['haroldorellana20@gmail.com'];

const C = {
  blue:   '#003366',
  gold:   '#FFD700',
  green:  '#22c55e',
  purple: '#8b5cf6',
  orange: '#f97316',
  red:    '#ef4444',
  teal:   '#14b8a6',
};

// ── Types ────────────────────────────────────────────────────────────────────
interface Session {
  id: string;
  uid: string;
  username: string;
  avatar: string;
  category: 'mixta' | 'programacion';
  score: number;
  correct: number;
  total: number;
  accuracy: number;
  avgTimeUsed: number;
  finalTimeLimit: number;
  timerReductions: number;
  maxStreak?: number;
  timeRecoveries?: number;
  playedAt: any;
}

// ── Data helpers ─────────────────────────────────────────────────────────────
function mean(arr: number[]) {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

function toDate(ts: any): Date | null {
  if (!ts) return null;
  if (ts.toDate) return ts.toDate();
  if (ts.seconds) return new Date(ts.seconds * 1000);
  return new Date(ts);
}

function fmt(d: Date | null) {
  if (!d) return '—';
  return d.toLocaleDateString('es-SV', { day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtShort(d: Date | null) {
  if (!d) return '—';
  return d.toLocaleDateString('es-SV', { day: '2-digit', month: 'short' });
}

function getSessionsByDay(sessions: Session[]) {
  const result: { day: string; sesiones: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const label = fmtShort(d);
    const count = sessions.filter(s => {
      const sd = toDate(s.playedAt);
      if (!sd) return false;
      sd.setHours(0, 0, 0, 0);
      return sd.getTime() === d.getTime();
    }).length;
    result.push({ day: label, sesiones: count });
  }
  return result;
}

function getScoreBuckets(sessions: Session[]) {
  const buckets = [
    { rango: '0–200', cantidad: 0 },
    { rango: '200–400', cantidad: 0 },
    { rango: '400–600', cantidad: 0 },
    { rango: '600–800', cantidad: 0 },
    { rango: '800–1000', cantidad: 0 },
    { rango: '1000+', cantidad: 0 },
  ];
  sessions.forEach(s => {
    if      (s.score < 200)  buckets[0].cantidad++;
    else if (s.score < 400)  buckets[1].cantidad++;
    else if (s.score < 600)  buckets[2].cantidad++;
    else if (s.score < 800)  buckets[3].cantidad++;
    else if (s.score < 1000) buckets[4].cantidad++;
    else                     buckets[5].cantidad++;
  });
  return buckets;
}

function getPlayerStats(sessions: Session[]) {
  const map: Record<string, any> = {};
  sessions.forEach(s => {
    if (!map[s.uid]) map[s.uid] = { uid: s.uid, username: s.username, avatar: s.avatar, list: [] };
    map[s.uid].list.push(s);
  });
  return Object.values(map).map(p => {
    const list: Session[] = p.list;
    const sorted = [...list].sort((a, b) => (toDate(b.playedAt)?.getTime() ?? 0) - (toDate(a.playedAt)?.getTime() ?? 0));
    return {
      uid:             p.uid,
      username:        p.username,
      avatar:          p.avatar,
      totalSessions:   list.length,
      bestScore:       Math.max(...list.map(s => s.score)),
      avgScore:        Math.round(mean(list.map(s => s.score))),
      avgAccuracy:     Math.round(mean(list.map(s => s.accuracy))),
      avgTimeUsed:     Math.round(mean(list.map(s => s.avgTimeUsed)) * 10) / 10,
      totalReductions: list.reduce((acc, s) => acc + (s.timerReductions || 0), 0),
      lastPlayed:      toDate(sorted[0]?.playedAt),
      sessions:        sorted,
    };
  }).sort((a, b) => b.bestScore - a.bestScore);
}

function getCategoryStats(sessions: Session[]) {
  const mixta = sessions.filter(s => s.category === 'mixta');
  const prog  = sessions.filter(s => s.category === 'programacion');
  return [
    {
      categoria: 'Mixta',
      sesiones:  mixta.length,
      puntaje:   Math.round(mean(mixta.map(s => s.score))),
      precision: Math.round(mean(mixta.map(s => s.accuracy))),
      tiempo:    Math.round(mean(mixta.map(s => s.avgTimeUsed)) * 10) / 10,
      fill:      C.gold,
    },
    {
      categoria: 'Programación',
      sesiones:  prog.length,
      puntaje:   Math.round(mean(prog.map(s => s.score))),
      precision: Math.round(mean(prog.map(s => s.accuracy))),
      tiempo:    Math.round(mean(prog.map(s => s.avgTimeUsed)) * 10) / 10,
      fill:      C.blue,
    },
  ];
}

// ── Migration helper ─────────────────────────────────────────────────────────
async function migrateLeaderboardToSessions(): Promise<number> {
  const lb = await getDocs(collection(db, 'leaderboard'));
  let count = 0;
  for (const d of lb.docs) {
    const data = d.data();
    if (!data.uid) continue;
    await addDoc(collection(db, 'sessions'), {
      uid:             data.uid,
      username:        data.username || 'Jugador',
      avatar:          data.avatar   || '',
      category:        data.category || 'mixta',
      score:           data.score    || 0,
      correct:         data.correct  || 0,
      total:           data.total    || 15,
      accuracy:        Math.round(((data.correct || 0) / (data.total || 15)) * 100),
      avgTimeUsed:     0,
      finalTimeLimit:  10,
      timerReductions: 0,
      playedAt:        data.playedAt,
      migrated:        true,
    });
    count++;
  }
  return count;
}

// ── Migration card ────────────────────────────────────────────────────────────
const MigrationCard = ({ sessions }: { sessions: Session[] }) => {
  const [state, setState] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [count, setCount]  = useState(0);

  const hasMigrated = sessions.some((s: any) => s.migrated);

  const run = async () => {
    setState('running');
    try {
      const n = await migrateLeaderboardToSessions();
      setCount(n);
      setState('done');
    } catch {
      setState('error');
    }
  };

  if (hasMigrated || sessions.length > 0) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
    >
      <div className="w-12 h-12 bg-amber-100 dark:bg-amber-800/40 rounded-2xl flex items-center justify-center flex-shrink-0">
        <DatabaseZap className="w-6 h-6 text-amber-600 dark:text-amber-400" />
      </div>
      <div className="flex-1">
        <p className="font-bold text-amber-800 dark:text-amber-300">Datos existentes sin migrar</p>
        <p className="text-sm text-amber-600 dark:text-amber-500 mt-0.5">
          Hay partidas registradas en el leaderboard que aún no aparecen en Analytics. Haz clic para importarlas.
        </p>
      </div>
      {state === 'done' ? (
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold text-sm">
          <CheckCircle2 className="w-5 h-5" /> {count} partidas importadas
        </div>
      ) : (
        <motion.button whileTap={{ scale: 0.97 }} onClick={run} disabled={state === 'running'}
          className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm disabled:opacity-60 transition-colors"
        >
          {state === 'running' ? 'Importando…' : state === 'error' ? 'Reintentar' : 'Importar datos'}
        </motion.button>
      )}
    </motion.div>
  );
};

// ── Small components ──────────────────────────────────────────────────────────
const KpiCard = ({
  icon, label, value, sub, color, delay = 0,
}: {
  icon: React.ReactNode; label: string; value: string | number;
  sub?: string; color: string; delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col gap-3"
  >
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</span>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + '20' }}>
        <span style={{ color }}>{icon}</span>
      </div>
    </div>
    <p className="text-2xl sm:text-4xl font-display font-black text-slate-800 dark:text-slate-100">{value}</p>
    {sub && <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{sub}</p>}
  </motion.div>
);

const ChartCard = ({ title, subtitle, children, delay = 0 }: {
  title: string; subtitle?: string; children: React.ReactNode; delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm"
  >
    <p className="font-display font-bold text-slate-800 dark:text-slate-100 mb-1">{title}</p>
    {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">{subtitle}</p>}
    {children}
  </motion.div>
);

const EmptyChart = ({ text }: { text: string }) => (
  <div className="h-48 flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 gap-2">
    <Brain className="w-10 h-10" />
    <p className="text-sm font-medium">{text}</p>
  </div>
);

const Pill = ({ cat }: { cat: string }) => (
  <span className={cn(
    'text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wide',
    cat === 'programacion' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                           : 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300',
  )}>
    {cat === 'programacion' ? 'Prog.' : 'Mixta'}
  </span>
);

const AvatarImg = ({ src, username, size = 'sm' }: { src: string; username: string; size?: 'sm' | 'md' }) => (
  <img
    src={src || `https://api.dicebear.com/9.x/avataaars/png?seed=${username}`}
    onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${username}&background=003366&color=FFD700`; }}
    className={cn('rounded-xl object-cover flex-shrink-0', size === 'sm' ? 'w-8 h-8' : 'w-10 h-10')}
    alt={username}
  />
);

// ── OVERVIEW TAB ─────────────────────────────────────────────────────────────
const OverviewTab = ({ sessions }: { sessions: Session[] }) => {
  const players     = useMemo(() => getPlayerStats(sessions), [sessions]);
  const byDay       = useMemo(() => getSessionsByDay(sessions), [sessions]);
  const buckets     = useMemo(() => getScoreBuckets(sessions), [sessions]);
  const catStats    = useMemo(() => getCategoryStats(sessions), [sessions]);
  const recent      = useMemo(() => [...sessions].slice(0, 8), [sessions]);
  const { theme }   = useTheme();
  const isDark      = theme === 'dark';
  const gridColor   = isDark ? '#334155' : '#e2e8f0';
  const tickColor   = isDark ? '#94a3b8' : '#6b7280';

  const totalPlayers  = players.length;
  const avgScore      = Math.round(mean(sessions.map(s => s.score)));
  const avgAccuracy   = Math.round(mean(sessions.map(s => s.accuracy)));
  const avgTime       = Math.round(mean(sessions.map(s => s.avgTimeUsed)) * 10) / 10;
  const reductionPct  = sessions.length
    ? Math.round((sessions.filter(s => s.timerReductions > 0).length / sessions.length) * 100)
    : 0;
  const avgMaxStreak  = Math.round(mean(sessions.map(s => s.maxStreak ?? 0)));

  const pieData = [
    { name: 'Mixta',         value: catStats[0].sesiones, fill: C.gold  },
    { name: 'Programación',  value: catStats[1].sesiones, fill: C.blue  },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-xl shadow-xl">
        <p className="font-bold mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Migración de datos existentes */}
      <MigrationCard sessions={sessions} />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={<ListOrdered className="w-5 h-5" />} label="Total Sesiones"    value={sessions.length} sub="partidas registradas"         color={C.blue}   delay={0}    />
        <KpiCard icon={<Users       className="w-5 h-5" />} label="Jugadores Únicos"  value={totalPlayers}    sub="usuarios distintos"            color={C.purple} delay={0.05} />
        <KpiCard icon={<Award       className="w-5 h-5" />} label="Puntaje Promedio"  value={avgScore || '—'} sub="pts por partida"               color={C.gold}   delay={0.1}  />
        <KpiCard icon={<Target      className="w-5 h-5" />} label="Precisión Promedio" value={avgAccuracy ? `${avgAccuracy}%` : '—'} sub="respuestas correctas" color={C.green}  delay={0.15} />
      </div>

      {/* Behavior Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: <Clock      className="w-5 h-5" />, color: C.teal,
            label: 'Tiempo prom. / pregunta',
            value: avgTime ? `${avgTime}s` : '—',
          },
          {
            icon: <Flame      className="w-5 h-5" />, color: C.orange,
            label: 'Activan timer adaptativo',
            value: sessions.length ? `${reductionPct}%` : '—',
            note: 'de las partidas reducen el tiempo',
          },
          {
            icon: <Shield     className="w-5 h-5" />, color: C.red,
            label: 'Categoría más difícil',
            value: catStats[0].precision && catStats[1].precision
              ? (catStats[0].precision < catStats[1].precision ? 'Mixta' : 'Prog.')
              : '—',
            note: 'menor precisión promedio',
          },
          {
            icon: <TrendingUp className="w-5 h-5" />, color: C.green,
            label: 'Racha máx. promedio',
            value: sessions.length ? `×${avgMaxStreak}` : '—',
            note: 'respuestas correctas seguidas',
          },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4"
          >
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: item.color + '20' }}>
              <span style={{ color: item.color }}>{item.icon}</span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider leading-tight">{item.label}</p>
              <p className="text-xl font-display font-black text-slate-800 dark:text-slate-100 truncate">{item.value}</p>
              {item.note && <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">{item.note}</p>}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ChartCard title="Actividad — Últimos 14 días" subtitle="Sesiones jugadas por día" delay={0.25}>
            {sessions.length === 0 ? <EmptyChart text="Aún no hay sesiones" /> : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={byDay} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={C.blue} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={C.blue} stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="day" tick={{ fontSize: 9, fill: tickColor }} interval={2} />
                  <YAxis tick={{ fontSize: 9, fill: tickColor }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="sesiones" name="Sesiones" stroke={C.blue} fill="url(#areaGrad)" strokeWidth={2} dot={{ r: 3, fill: C.blue }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        <ChartCard title="Categorías" subtitle="Distribución de sesiones" delay={0.3}>
          {sessions.length === 0 ? <EmptyChart text="Sin datos aún" /> : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="45%" innerRadius={50} outerRadius={75}
                  paddingAngle={3} dataKey="value"
                >
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11, color: tickColor }} />
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ChartCard title="Distribución de Puntajes" subtitle="Cantidad de sesiones por rango" delay={0.35}>
            {sessions.length === 0 ? <EmptyChart text="Sin datos aún" /> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={buckets} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="rango" tick={{ fontSize: 9, fill: tickColor }} />
                  <YAxis tick={{ fontSize: 9, fill: tickColor }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="cantidad" name="Sesiones" fill={C.purple} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        <ChartCard title="Top 5 Jugadores" subtitle="Por mejor puntaje" delay={0.4}>
          {players.length === 0 ? <EmptyChart text="Sin jugadores aún" /> : (
            <div className="space-y-3 mt-1">
              {players.slice(0, 5).map((p, i) => (
                <div key={p.uid} className="flex items-center gap-3">
                  <span className="w-5 text-center font-black text-xs text-slate-400">#{i + 1}</span>
                  <AvatarImg src={p.avatar} username={p.username} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">{p.username}</p>
                    <p className="text-[10px] text-slate-400">{p.totalSessions} partidas · {p.avgAccuracy}% precisión</p>
                  </div>
                  <span className="font-display font-black text-sm" style={{ color: C.gold }}>{p.bestScore}</span>
                </div>
              ))}
            </div>
          )}
        </ChartCard>
      </div>

      {/* Recent sessions table */}
      <ChartCard title="Últimas Sesiones" subtitle="Historial de partidas recientes" delay={0.45}>
        {recent.length === 0 ? <EmptyChart text="No hay sesiones registradas" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[580px]">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                  {['Jugador', 'Categoría', 'Puntaje', 'Precisión', 'Tiempo/Preg.', 'Reducciones', 'Fecha'].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                {recent.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <AvatarImg src={s.avatar} username={s.username} />
                        <span className="font-bold text-slate-800 dark:text-slate-100 truncate max-w-[120px]">{s.username}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3"><Pill cat={s.category} /></td>
                    <td className="py-3 px-3 font-display font-black text-ufg-blue dark:text-ufg-gold">{s.score}</td>
                    <td className="py-3 px-3">
                      <span className={cn('font-bold', s.accuracy >= 70 ? 'text-green-500' : s.accuracy >= 50 ? 'text-orange-500' : 'text-red-500')}>
                        {s.accuracy}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{s.avgTimeUsed ?? '—'}s</td>
                    <td className="py-3 px-3">
                      {s.timerReductions > 0
                        ? <span className="text-orange-500 font-bold">⚡ {s.timerReductions}×</span>
                        : <span className="text-slate-300 dark:text-slate-600">—</span>}
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-xs">{fmt(toDate(s.playedAt))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ChartCard>
    </div>
  );
};

// ── PLAYERS TAB ───────────────────────────────────────────────────────────────
const PlayersTab = ({ sessions }: { sessions: Session[] }) => {
  const players    = useMemo(() => getPlayerStats(sessions), [sessions]);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = players.filter(p => p.username.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar jugador…"
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-ufg-blue"
        />
        <span className="text-sm text-slate-400">{filtered.length} jugadores</span>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700">
              {['#', 'Jugador', 'Partidas', 'Mejor Puntaje', 'Prom. Puntaje', 'Precisión', 'T. Prom./Preg.', 'Última Partida'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {filtered.map((p, i) => (
              <React.Fragment key={p.uid}>
                <tr
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer"
                  onClick={() => setExpanded(expanded === p.uid ? null : p.uid)}
                >
                  <td className="py-3 px-4 font-black text-slate-400 text-xs">#{i + 1}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <AvatarImg src={p.avatar} username={p.username} size="md" />
                      <span className="font-bold text-slate-800 dark:text-slate-100">{p.username}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-600 dark:text-slate-300">{p.totalSessions}</td>
                  <td className="py-3 px-4 font-display font-black text-ufg-blue dark:text-ufg-gold">{p.bestScore}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{p.avgScore}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden w-16">
                        <div className="h-full rounded-full" style={{ width: `${p.avgAccuracy}%`, background: p.avgAccuracy >= 70 ? C.green : p.avgAccuracy >= 50 ? C.orange : C.red }} />
                      </div>
                      <span className={cn('font-bold text-xs', p.avgAccuracy >= 70 ? 'text-green-500' : p.avgAccuracy >= 50 ? 'text-orange-500' : 'text-red-500')}>
                        {p.avgAccuracy}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{p.avgTimeUsed}s</td>
                  <td className="py-3 px-4 text-slate-400 text-xs">{fmt(p.lastPlayed)}</td>
                </tr>
                <AnimatePresence>
                  {expanded === p.uid && (
                    <tr>
                      <td colSpan={8} className="bg-slate-50 dark:bg-slate-700/20 px-4 py-4">
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Historial de sesiones</p>
                          <div className="space-y-2">
                            {p.sessions.map((s: Session) => (
                              <div key={s.id} className="flex items-center gap-3 text-xs bg-white dark:bg-slate-800 rounded-xl px-4 py-2.5 border border-slate-100 dark:border-slate-700">
                                <Pill cat={s.category} />
                                <span className="font-display font-black text-ufg-blue dark:text-ufg-gold">{s.score} pts</span>
                                <span className={cn('font-bold', s.accuracy >= 70 ? 'text-green-500' : 'text-orange-500')}>{s.accuracy}%</span>
                                <span className="text-slate-400">{s.correct}/{s.total} correctas</span>
                                <span className="text-slate-400">{s.avgTimeUsed}s/preg.</span>
                                {s.timerReductions > 0 && <span className="text-orange-500 font-bold">⚡{s.timerReductions}×</span>}
                                <span className="text-slate-300 dark:text-slate-600 ml-auto">{fmt(toDate(s.playedAt))}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </tbody>
        </table>
        </div>
        {filtered.length === 0 && <EmptyChart text="No hay jugadores" />}
      </div>
    </div>
  );
};

// ── SESSIONS TAB ──────────────────────────────────────────────────────────────
const SessionsTab = ({ sessions }: { sessions: Session[] }) => {
  const [filter, setFilter] = useState<'all' | 'mixta' | 'programacion'>('all');
  const filtered = filter === 'all' ? sessions : sessions.filter(s => s.category === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {(['all', 'mixta', 'programacion'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn('px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors',
              filter === f ? 'bg-ufg-blue text-white' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
            )}
          >
            {f === 'all' ? 'Todas' : f === 'mixta' ? 'Mixta' : 'Programación'}
          </button>
        ))}
        <span className="ml-auto text-sm text-slate-400">{filtered.length} sesiones</span>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700">
                {['Jugador', 'Categoría', 'Puntaje', 'Correctas', 'Precisión', 'T.Prom./Preg.', 'Timer Final', 'Reducciones', 'Fecha'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <AvatarImg src={s.avatar} username={s.username} />
                      <span className="font-bold text-slate-800 dark:text-slate-100 truncate max-w-[100px]">{s.username}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4"><Pill cat={s.category} /></td>
                  <td className="py-3 px-4 font-display font-black text-ufg-blue dark:text-ufg-gold">{s.score}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{s.correct}/{s.total}</td>
                  <td className="py-3 px-4">
                    <span className={cn('font-bold', s.accuracy >= 70 ? 'text-green-500' : s.accuracy >= 50 ? 'text-orange-500' : 'text-red-500')}>
                      {s.accuracy}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{s.avgTimeUsed ?? '—'}s</td>
                  <td className="py-3 px-4">
                    <span className={cn('font-bold text-xs', s.finalTimeLimit <= 6 ? 'text-red-500' : s.finalTimeLimit <= 8 ? 'text-orange-500' : 'text-green-500')}>
                      {s.finalTimeLimit}s
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {s.timerReductions > 0
                      ? <span className="text-orange-500 font-bold text-xs">⚡ {s.timerReductions}×</span>
                      : <span className="text-slate-300 dark:text-slate-600 text-xs">—</span>}
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-xs whitespace-nowrap">{fmt(toDate(s.playedAt))}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <EmptyChart text="No hay sesiones con ese filtro" />}
        </div>
      </div>
    </div>
  );
};

// ── CATEGORIES TAB ────────────────────────────────────────────────────────────
const CategoriesTab = ({ sessions }: { sessions: Session[] }) => {
  const catStats  = useMemo(() => getCategoryStats(sessions), [sessions]);
  const mixta     = catStats[0];
  const prog      = catStats[1];
  const { theme } = useTheme();
  const isDark    = theme === 'dark';
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const tickColor = isDark ? '#94a3b8' : '#6b7280';

  const radarData = [
    { metric: 'Sesiones',  Mixta: mixta.sesiones, Programación: prog.sesiones },
    { metric: 'Puntaje',   Mixta: Math.round(mixta.puntaje / 10), Programación: Math.round(prog.puntaje / 10) },
    { metric: 'Precisión', Mixta: mixta.precision, Programación: prog.precision },
  ];

  const compareBar = [
    { name: 'Puntaje Prom.', Mixta: mixta.puntaje, Programación: prog.puntaje },
    { name: 'Precisión %',   Mixta: mixta.precision, Programación: prog.precision },
    { name: 'Tiempo s',      Mixta: mixta.tiempo * 10, Programación: prog.tiempo * 10 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-xl shadow-xl">
        <p className="font-bold mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Side-by-side cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[mixta, prog].map((cat, i) => (
          <motion.div key={cat.categoria} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: cat.fill + '20' }}>
                <Tag className="w-5 h-5" style={{ color: cat.fill }} />
              </div>
              <div>
                <h3 className="font-display font-black text-xl text-slate-800 dark:text-slate-100">{cat.categoria}</h3>
                <p className="text-xs text-slate-400">{cat.sesiones} sesiones totales</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { label: 'Puntaje Prom.', value: cat.puntaje || '—' },
                { label: 'Precisión',     value: cat.precision ? `${cat.precision}%` : '—' },
                { label: 'T./Preg.',      value: cat.tiempo ? `${cat.tiempo}s` : '—' },
              ].map(stat => (
                <div key={stat.label} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-2 sm:p-3 text-center">
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className="font-display font-black text-lg sm:text-xl text-slate-800 dark:text-slate-100">{stat.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Comparison charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Comparación de Métricas" subtitle="Mixta vs Programación" delay={0.2}>
          {(catStats[0].sesiones === 0 || catStats[1].sesiones === 0) ? <EmptyChart text="Necesitas sesiones en ambas categorías" /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={compareBar} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: tickColor }} />
                <YAxis tick={{ fontSize: 10, fill: tickColor }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: tickColor }} />
                <Bar dataKey="Mixta"        fill={C.gold}  radius={[4, 4, 0, 0]} />
                <Bar dataKey="Programación" fill={C.blue}  radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Radar de Desempeño" subtitle="Índice comparativo (valores normalizados)" delay={0.25}>
          {(catStats[0].sesiones === 0 || catStats[1].sesiones === 0) ? <EmptyChart text="Necesitas sesiones en ambas categorías" /> : (
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={gridColor} />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: tickColor }} />
                <Radar name="Mixta"        dataKey="Mixta"        stroke={C.gold} fill={C.gold} fillOpacity={0.25} />
                <Radar name="Programación" dataKey="Programación" stroke={C.blue} fill={C.blue} fillOpacity={0.25} />
                <Legend wrapperStyle={{ fontSize: 11, color: tickColor }} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </div>
  );
};

// ── REPORTE TAB ───────────────────────────────────────────────────────────────

const PROFILE_META: Record<string, { color: string; icon: React.ReactNode }> = {
  'Jugador de Respuesta Rápida': { color: C.green,    icon: <Zap          className="w-6 h-6" /> },
  'Jugador Metódico':            { color: C.blue,     icon: <Brain        className="w-6 h-6" /> },
  'Jugador Equilibrado':         { color: C.purple,   icon: <Shield       className="w-6 h-6" /> },
  'Jugador Impulsivo':           { color: C.orange,   icon: <Flame        className="w-6 h-6" /> },
  'Jugador Propenso al Pánico':  { color: C.red,      icon: <AlertTriangle className="w-6 h-6" /> },
  'Jugador en Progreso':         { color: C.teal,     icon: <TrendingUp   className="w-6 h-6" /> },
  'Jugador Constante':           { color: '#64748b',  icon: <Shield       className="w-6 h-6" /> },
  'Jugador en Desarrollo':       { color: C.gold,     icon: <Star         className="w-6 h-6" /> },
};
const DEFAULT_META = { color: '#94a3b8', icon: <Brain className="w-6 h-6" /> };

function tendenciaColor(key: string, val: string): string {
  const ok = '#22c55e'; const warn = '#f97316'; const bad = '#ef4444'; const neutral = '#94a3b8';
  const map: Record<string, Record<string, string>> = {
    velocidad:         { rapido: ok,    moderado: '#3b82f6', lento: warn },
    precision:         { alta: ok,      media: warn,         baja: bad  },
    consistencia:      { alta: ok,      media: warn,         baja: bad,        sin_datos: neutral },
    presionTimer:      { baja: ok,      media: warn,         alta: bad  },
    progresion:        { mejorando: ok, estable: '#3b82f6',  declinando: bad,  sin_datos: neutral },
    rachaMaxima:       { alta: ok,      media: '#3b82f6',    baja: warn,       sin_datos: neutral },
    categoriaFavorita: { mixta: C.gold, programacion: C.blue, equilibrado: C.purple },
    categoriaFuerte:   { mixta: C.gold, programacion: C.blue, igual: C.purple, sin_datos: neutral },
  };
  return map[key]?.[val] ?? neutral;
}

const TEND_LABEL: Record<string, Record<string, string>> = {
  velocidad:         { rapido: 'Rápido', moderado: 'Moderado', lento: 'Lento' },
  precision:         { alta: 'Alta', media: 'Media', baja: 'Baja' },
  consistencia:      { alta: 'Alta', media: 'Media', baja: 'Baja', sin_datos: '—' },
  presionTimer:      { baja: 'Baja', media: 'Media', alta: 'Alta' },
  progresion:        { mejorando: 'Mejorando ↑', estable: 'Estable', declinando: 'Declinando ↓', sin_datos: '—' },
  categoriaFavorita: { mixta: 'Mixta', programacion: 'Programación', equilibrado: 'Equilibrado' },
  categoriaFuerte:   { mixta: 'Mixta', programacion: 'Programación', igual: 'Igual', sin_datos: '—' },
  rachaMaxima:       { alta: 'Alta ≥4', media: 'Media ≥2', baja: 'Baja <2', sin_datos: '—' },
};

const TEND_NAME: Record<string, string> = {
  velocidad: 'Velocidad', precision: 'Precisión', consistencia: 'Consistencia',
  presionTimer: 'Presión Timer', progresion: 'Progresión',
  categoriaFavorita: 'Cat. Favorita', categoriaFuerte: 'Cat. Fuerte',
  rachaMaxima: 'Racha Máx.',
};

const ReporteTab = ({ sessions }: { sessions: Session[] }) => {
  const players = useMemo(() => getPlayerStats(sessions), [sessions]);
  const [selectedUid, setSelectedUid] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedUid && players.length > 0) setSelectedUid(players[0].uid);
  }, [players, selectedUid]);

  const player = players.find(p => p.uid === selectedUid);
  const pSess  = useMemo(() => sessions.filter(s => s.uid === selectedUid), [sessions, selectedUid]);

  const reporte: ReporteFinal | null = useMemo(() => {
    if (!player || pSess.length === 0) return null;
    return generarReporteFinal(pSess as any, { uid: player.uid, username: player.username, avatar: player.avatar });
  }, [player, pSess]);

  if (players.length === 0) return (
    <div className="flex items-center justify-center h-64">
      <EmptyChart text="No hay jugadores registrados aún" />
    </div>
  );

  const meta = PROFILE_META[reporte?.perfil.etiqueta ?? ''] ?? DEFAULT_META;

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">

      {/* ── Player list ──────────────────────────────────────────────────── */}
      <aside className="w-full lg:w-52 flex-shrink-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 lg:mb-3">Jugadores</p>
        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
        {players.map(p => {
          const active = selectedUid === p.uid;
          return (
            <button key={p.uid} onClick={() => setSelectedUid(p.uid)}
              className={cn(
                'flex-shrink-0 min-w-[160px] lg:min-w-0 lg:w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all',
                active
                  ? 'bg-ufg-blue text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-ufg-blue/40',
              )}
            >
              <AvatarImg src={p.avatar} username={p.username} />
              <div className="min-w-0">
                <p className={cn('font-bold text-sm truncate', active ? 'text-white' : 'text-slate-800 dark:text-slate-100')}>{p.username}</p>
                <p className={cn('text-[10px]', active ? 'text-blue-200' : 'text-slate-400')}>{p.totalSessions} partidas · {p.bestScore} pts</p>
              </div>
            </button>
          );
        })}
        </div>
      </aside>

      {/* ── Report panel ─────────────────────────────────────────────────── */}
      {reporte ? (
        <div className="flex-1 min-w-0 space-y-4">

          {/* Perfil hero */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm"
          >
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: meta.color + '20' }}>
                <span style={{ color: meta.color }}>{meta.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4 flex-wrap mb-1">
                  <h3 className="text-xl sm:text-2xl font-display font-black text-slate-800 dark:text-slate-100">{reporte.perfil.etiqueta}</h3>
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Confianza</span>
                    <div className="w-20 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{
                        width: `${reporte.perfil.confianza}%`,
                        background: reporte.perfil.confianza >= 80 ? C.green : reporte.perfil.confianza >= 60 ? C.gold : C.orange,
                      }} />
                    </div>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{reporte.perfil.confianza}%</span>
                  </div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{reporte.perfil.descripcion}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-green-500 uppercase tracking-wider mb-2">Fortalezas</p>
                    <ul className="space-y-1.5">
                      {reporte.perfil.fortalezas.map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                          <span className="text-green-500 font-black mt-0.5">✓</span>{f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-2">Áreas de Oportunidad</p>
                    <ul className="space-y-1.5">
                      {reporte.perfil.areasOportunidad.map((a, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                          <span className="text-orange-400 font-black mt-0.5">→</span>{a}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Métricas */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {[
              { label: 'Puntaje Prom.',   value: reporte.promedios.puntaje,                                                          color: C.blue   },
              { label: 'Mejor Puntaje',   value: reporte.promedios.mejorPuntaje,                                                     color: C.gold   },
              { label: 'Precisión',       value: `${reporte.promedios.precision}%`,                                                  color: C.green  },
              { label: 'Correctas/Part.', value: reporte.promedios.correctasPorPartida,                                              color: C.purple },
              { label: 'Tiempo/Preg.',    value: reporte.promedios.tiempoPorPregunta > 0 ? `${reporte.promedios.tiempoPorPregunta}s` : '—', color: C.teal },
              { label: 'Timer Final',     value: `${reporte.promedios.timerFinal}s`,                                                 color: C.orange },
              { label: 'Reducciones',     value: reporte.promedios.reduccionesTimer,                                                 color: C.red    },
              { label: 'Sesiones',        value: reporte.totalSesiones,                                                              color: '#64748b'},
              { label: 'Racha Máx.',      value: `×${reporte.promedios.maxRacha}`,                                                   color: C.green  },
              { label: 'Recuperaciones',  value: reporte.promedios.recuperaciones,                                                   color: C.teal   },
            ].map((m, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">{m.label}</p>
                <p className="text-2xl font-display font-black" style={{ color: m.color }}>{m.value}</p>
              </div>
            ))}
          </motion.div>

          {/* Tendencias + Distribución */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            {/* Tendencias */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
              <p className="font-display font-bold text-slate-800 dark:text-slate-100 mb-4">Tendencias de Comportamiento</p>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(reporte.tendencias) as [string, string][]).map(([key, val]) => {
                  const col = tendenciaColor(key, val);
                  return (
                    <div key={key} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl px-3 py-2 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide truncate">{TEND_NAME[key] ?? key}</span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-lg whitespace-nowrap" style={{ color: col, background: col + '20' }}>
                        {TEND_LABEL[key]?.[val] ?? val}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Distribución */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
              <p className="font-display font-bold text-slate-800 dark:text-slate-100 mb-4">Distribución de Sesiones</p>
              <div className="space-y-3">
                {[
                  { label: 'Precisión Alta ≥70%',   val: reporte.porcentajes.precisionAlta,             color: C.green  },
                  { label: 'Precisión Media 50–69%', val: reporte.porcentajes.precisionMedia,            color: C.orange },
                  { label: 'Precisión Baja <50%',    val: reporte.porcentajes.precisionBaja,             color: C.red    },
                  { label: 'Timer adaptativo',       val: reporte.porcentajes.sesionesConReduccionTimer, color: C.purple },
                  { label: 'Categoría Mixta',        val: reporte.porcentajes.mixta,                    color: C.gold   },
                  { label: 'Categoría Programación', val: reporte.porcentajes.programacion,             color: C.blue   },
                ].map(row => (
                  <div key={row.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">{row.label}</span>
                      <span className="text-xs font-black" style={{ color: row.color }}>{row.val}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${row.val}%`, background: row.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Rendimiento por categoría */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {([
              { key: 'mixta' as const,        label: 'Mixta',        color: C.gold, data: reporte.rendimientoPorCategoria.mixta        },
              { key: 'programacion' as const, label: 'Programación', color: C.blue, data: reporte.rendimientoPorCategoria.programacion },
            ]).map(cat => (
              <div key={cat.key} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full" style={{ background: cat.color }} />
                  <p className="font-display font-bold text-slate-800 dark:text-slate-100">{cat.label}</p>
                  <span className="ml-auto text-xs text-slate-400">{cat.data.sesiones} partidas</span>
                </div>
                {cat.data.sesiones === 0 ? (
                  <p className="text-sm text-slate-300 dark:text-slate-600 text-center py-4">Sin sesiones</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Puntaje Prom.',  value: cat.data.avgPuntaje },
                      { label: 'Mejor Puntaje',  value: cat.data.mejorPuntaje },
                      { label: 'Precisión',      value: `${cat.data.avgPrecision}%` },
                      { label: 'Tiempo/Preg.',   value: cat.data.avgTiempo > 0 ? `${cat.data.avgTiempo}s` : '—' },
                    ].map(stat => (
                      <div key={stat.label} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-2.5 text-center">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
                        <p className="font-display font-black text-lg text-slate-800 dark:text-slate-100">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </motion.div>

          {/* Observaciones */}
          {reporte.insights.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm"
            >
              <p className="font-display font-bold text-slate-800 dark:text-slate-100 mb-4">Observaciones</p>
              <ul className="space-y-2.5">
                {reporte.insights.map((ins, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-ufg-blue/10 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[9px] font-black text-ufg-blue dark:text-blue-400">{i + 1}</span>
                    </div>
                    {ins}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center h-64">
          <EmptyChart text="Selecciona un jugador para ver su reporte" />
        </div>
      )}
    </div>
  );
};

// ── SIDEBAR ───────────────────────────────────────────────────────────────────
const NAV = [
  { id: 'overview',    label: 'Overview',    icon: LayoutDashboard },
  { id: 'players',    label: 'Jugadores',   icon: Users           },
  { id: 'sessions',   label: 'Sesiones',    icon: ListOrdered     },
  { id: 'categories', label: 'Categorías',  icon: Tag             },
  { id: 'reports',    label: 'Reportes',    icon: FileText        },
];

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export const Admin = () => {
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const [sessions,  setSessions]  = useState<Session[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const isAdmin = ADMIN_EMAILS.includes(user?.email || '');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    const q = query(collection(db, 'sessions'), orderBy('playedAt', 'desc'));
    return onSnapshot(q, snap => {
      setSessions(snap.docs.map(d => ({ id: d.id, ...d.data() } as Session)));
      setLoading(false);
    });
  }, [isAdmin]);

  if (!isAdmin) return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h1 className="text-2xl font-display font-black text-slate-800 dark:text-white mb-2">Acceso Denegado</h1>
        <p className="text-slate-400 mb-6">No tienes permisos para ver esta página.</p>
        <button onClick={() => navigate('/')} className="px-6 py-2.5 bg-ufg-blue text-white rounded-xl font-bold">
          Volver al Lobby
        </button>
      </div>
    </div>
  );

  const TabIcon = NAV.find(n => n.id === activeTab)?.icon || LayoutDashboard;
  const tabLabel = NAV.find(n => n.id === activeTab)?.label || '';

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">

      {/* ── Mobile overlay ───────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className={cn(
        'fixed lg:static inset-y-0 left-0 z-50 w-60 bg-slate-900 dark:bg-slate-950 flex flex-col flex-shrink-0 border-r border-slate-800 transition-transform duration-300 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      )}>
        {/* Logo */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-ufg-gold rounded-xl flex items-center justify-center rotate-6">
              <GraduationCap className="w-5 h-5 text-ufg-blue" />
            </div>
            <div>
              <p className="font-display font-extrabold text-white leading-none text-sm">Trivia UFG</p>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Analytics</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left',
                activeTab === id
                  ? 'bg-ufg-gold/10 text-ufg-gold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800',
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <div className="px-4 py-2 text-[10px] text-slate-600 font-mono">
            {sessions.length} sesiones · tiempo real
          </div>
          <button onClick={() => navigate('/')}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm font-bold"
          >
            <ChevronLeft className="w-4 h-4" /> Ir al Juego
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 px-4 sm:px-8 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
              <TabIcon className="w-4 h-4 text-slate-500 dark:text-slate-300" />
            </div>
            <div>
              <h2 className="font-display font-black text-slate-800 dark:text-slate-100">{tabLabel}</h2>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                {loading ? 'Cargando…' : `${sessions.length} sesiones · actualizado en tiempo real`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {loading && <div className="w-4 h-4 border-2 border-ufg-blue border-t-transparent rounded-full animate-spin" />}
            <ThemeToggle variant="surface" />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" className="flex items-center justify-center h-64"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                <div className="text-center space-y-3">
                  <div className="w-10 h-10 border-2 border-ufg-blue border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-slate-400 font-medium">Cargando datos…</p>
                </div>
              </motion.div>
            ) : (
              <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                {activeTab === 'overview'    && <OverviewTab    sessions={sessions} />}
                {activeTab === 'players'     && <PlayersTab     sessions={sessions} />}
                {activeTab === 'sessions'    && <SessionsTab    sessions={sessions} />}
                {activeTab === 'categories'  && <CategoriesTab  sessions={sessions} />}
                {activeTab === 'reports'     && <ReporteTab     sessions={sessions} />}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
