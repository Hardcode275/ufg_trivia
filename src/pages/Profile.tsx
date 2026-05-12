import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { ChevronLeft, Trophy, Zap, Star, ShieldCheck, MapPin, Award, GraduationCap } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { useNavigate } from 'react-router-dom';
import { db, collection, query, orderBy, getDocs, doc, getDoc } from '../lib/firebase';

export const Profile = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [rank, setRank] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchRank = async () => {
      const entry = await getDoc(doc(db, 'leaderboard', user.uid));
      if (!entry.exists()) { setRank(null); return; }
      const all = await getDocs(query(collection(db, 'leaderboard'), orderBy('score', 'desc')));
      const pos = all.docs.findIndex(d => d.id === user.uid);
      setRank(pos === -1 ? null : pos + 1);
    };
    fetchRank().catch(console.error);
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors">
      {/* Top Navbar */}
      <nav className="bg-ufg-blue text-white px-4 sm:px-8 py-4 flex items-center gap-4 shadow-xl">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-white/10 rounded-xl transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-ufg-gold rounded-xl flex items-center justify-center rotate-6">
            <GraduationCap className="w-5 h-5 text-ufg-blue" />
          </div>
          <h1 className="font-display font-extrabold">Mi Perfil</h1>
          <ThemeToggle />
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-6 sm:space-y-8">
        {/* Profile hero card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden"
        >
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-ufg-blue to-blue-700 relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-8 -right-8 w-40 h-40 border-4 border-ufg-gold/20 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute -bottom-10 left-32 w-24 h-24 border-2 border-white/10 rounded-full"
            />
          </div>

          <div className="px-8 pb-8">
            <div className="flex items-end justify-between -mt-12 mb-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative"
              >
                <img
                  src={profile?.avatar || ''}
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${profile?.username || 'U'}&background=003366&color=FFD700&size=128`; }}
                  className="w-24 h-24 rounded-2xl bg-white p-1 border-4 border-white shadow-2xl"
                  alt="Avatar"
                />
                <div className="absolute -bottom-2 -right-2 bg-ufg-gold p-1.5 rounded-xl border-4 border-white shadow-md">
                  <ShieldCheck className="w-4 h-4 text-ufg-blue" />
                </div>
              </motion.div>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-display font-black text-slate-800 dark:text-slate-100">{profile?.username}</h2>
                <div className="flex items-center gap-1.5 text-slate-400 font-medium mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>San Salvador, SV</span>
                  <span className="text-slate-300 dark:text-slate-600 mx-1">•</span>
                  <span className="text-ufg-blue dark:text-blue-400 font-bold">Estudiante UFG</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StatCard
              icon={<Trophy className="w-8 h-8 text-ufg-gold" />}
              label="Puntos Totales"
              value={profile?.totalPoints || 0}
              bg="bg-ufg-gold/10"
              border="border-ufg-gold/20"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <StatCard
              icon={<Zap className="w-8 h-8 text-blue-500" />}
              label="Partidas Jugadas"
              value={profile?.gamesPlayed || 0}
              bg="bg-blue-50"
              border="border-blue-100"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StatCard
              icon={<Award className="w-8 h-8 text-purple-500" />}
              label="Rango Global"
              value={rank === null ? '—' : `#${rank}`}
              bg="bg-purple-50"
              border="border-purple-100"
            />
          </motion.div>
        </div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700"
        >
          <h3 className="font-display font-bold text-xl text-slate-800 dark:text-slate-100 mb-6">Insignias</h3>
          <div className="flex flex-wrap gap-4 sm:gap-6">
            <BadgeCard icon={<Star className="w-7 h-7 text-ufg-gold" />} label="Pionero" earned />
            <BadgeCard icon={<Award className="w-7 h-7 text-purple-500" />} label="Intelecto" earned />
            <BadgeCard icon={<Zap className="w-7 h-7 text-slate-300" />} label="Veloz" earned={false} />
            <BadgeCard icon={<Trophy className="w-7 h-7 text-slate-300" />} label="Campeón" earned={false} />
            <BadgeCard icon={<ShieldCheck className="w-7 h-7 text-slate-300" />} label="Veterano" earned={false} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, bg, border }: any) => (
  <div className={`${bg} border ${border} dark:bg-slate-800 dark:border-slate-700 rounded-3xl p-4 sm:p-6 flex flex-col items-center text-center`}>
    <div className="bg-white dark:bg-slate-700 p-3 rounded-2xl mb-3 shadow-sm">{icon}</div>
    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{label}</span>
    <span className="text-3xl sm:text-4xl font-display font-black text-slate-800 dark:text-slate-100">{value}</span>
  </div>
);

const BadgeCard = ({ icon, label, earned }: { icon: React.ReactNode; label: string; earned: boolean }) => (
  <div className="flex flex-col items-center gap-2">
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 ${earned ? 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 shadow-sm' : 'bg-slate-50 dark:bg-slate-700/40 border-slate-100 dark:border-slate-700 opacity-40'}`}>
      {icon}
    </div>
    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</span>
    {earned && <span className="text-[10px] text-green-500 font-bold">Desbloqueada</span>}
  </div>
);
