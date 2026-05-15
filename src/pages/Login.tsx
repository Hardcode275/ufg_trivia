import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { signInWithPopup, googleProvider, auth } from '../lib/firebase';
import { GraduationCap, Award, Zap, Users, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('¡Bienvenido a Trivia UFG!');
      navigate('/');
    } catch (error: any) {
      console.error('Firebase Auth Error:', error);
      const code = error?.code || 'unknown';
      const msg: Record<string, string> = {
        'auth/popup-blocked':           'El navegador bloqueó el popup. Permite popups para este sitio.',
        'auth/popup-closed-by-user':    'Cerraste la ventana antes de iniciar sesión.',
        'auth/unauthorized-domain':     'Dominio no autorizado en Firebase. Agrega localhost en Firebase Console → Authentication → Settings → Authorized domains.',
        'auth/operation-not-allowed':   'Google Sign-In no está habilitado en Firebase Console.',
        'auth/network-request-failed':  'Error de red. Verifica tu conexión.',
        'auth/cancelled-popup-request': 'Popup cancelado.',
      };
      toast.error(msg[code] || `Error (${code}): ${error?.message}`, { duration: 8000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-ufg-blue flex-col justify-between p-16 relative overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-32 -right-32 w-96 h-96 bg-ufg-gold/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, -45, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl"
        />

        {/* Logo */}
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 bg-ufg-gold rounded-2xl flex items-center justify-center shadow-lg shadow-ufg-gold/30 rotate-6">
            <GraduationCap className="w-8 h-8 text-ufg-blue" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-extrabold text-white leading-none">Trivia UFG</h1>
            <p className="text-blue-300/70 text-sm font-medium">Prueba Tus Conocomientos</p>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-5xl font-display font-black text-white leading-tight mb-4">
              Demuestra tu<br />
              <span className="text-ufg-gold">conocimiento</span><br />
              universitario.
            </h2>
            <p className="text-blue-200/70 text-lg max-w-md">
              Sobre temas de programacion y preguntas mixtas.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 max-w-sm">
            <FeatureRow icon={<Zap className="w-5 h-5 text-ufg-gold" />} text="Juego de 15 preguntas para ambas categorias." />
            <FeatureRow icon={<Trophy className="w-5 h-5 text-ufg-gold" />} text="Ranking de los mejores 10 jugadores" />
            <FeatureRow icon={<Users className="w-5 h-5 text-ufg-gold" />} text="Salas de juego individuales" />
            <FeatureRow icon={<Award className="w-5 h-5 text-ufg-gold" />} text="Insignias y logros desbloqueables" />
          </div>
        </div>

        <p className="text-blue-300/40 text-sm relative z-10 bg-clip-padding backdrop-blur-sm p-3 rounded-md">
          Universidad Francisco Gavidia — San Salvador, SV
        </p>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-slate-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-10"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3">
            <div className="w-12 h-12 bg-ufg-blue rounded-2xl flex items-center justify-center rotate-6">
              <GraduationCap className="w-7 h-7 text-ufg-gold" />
            </div>
            <h1 className="text-2xl font-display font-extrabold text-ufg-blue">Trivia UFG</h1>
          </div>

          <div>
            <h2 className="text-4xl font-display font-black text-slate-800 dark:text-white mb-2">Bienvenido</h2>
            <p className="text-slate-400 text-lg">Inicia sesión para unirte a la competencia.</p>
          </div>

          <div className="space-y-4">
            <motion.button
              whileHover={!loading ? { scale: 1.02, boxShadow: '0 8px 30px rgba(0,51,102,0.15)' } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              onClick={handleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-4 bg-ufg-blue text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all text-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              {loading ? 'Iniciando sesión…' : 'Continuar con Google'}
            </motion.button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <StatPill label="Preguntas" value="300+" />
            <StatPill label="Categorías" value="2" />
            <StatPill label="Modo" value="Live" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const FeatureRow = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-3">
    <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
      {icon}
    </div>
    <span className="text-blue-100/80 font-medium">{text}</span>
  </div>
);

const StatPill = ({ label, value }: { label: string; value: string }) => (
  <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
    <p className="text-xl font-display font-black text-ufg-blue dark:text-ufg-gold">{value}</p>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">{label}</p>
  </div>
);
