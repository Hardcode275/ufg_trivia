import React from 'react';
import { motion } from 'motion/react';
import { signInWithPopup, googleProvider, auth } from '../lib/firebase';
import { LogIn, GraduationCap, Award, Zap, Users, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('¡Bienvenido a Trivia UFG!');
      navigate('/');
    } catch (error: any) {
      console.error('Firebase Auth Error:', error);
      const code = error?.code || 'unknown';
      const msg: Record<string, string> = {
        'auth/popup-blocked':        'El navegador bloqueó el popup. Permite popups para este sitio.',
        'auth/popup-closed-by-user': 'Cerraste la ventana antes de iniciar sesión.',
        'auth/unauthorized-domain':  'Dominio no autorizado en Firebase. Agrega localhost en Firebase Console → Authentication → Settings → Authorized domains.',
        'auth/operation-not-allowed':'Google Sign-In no está habilitado en Firebase Console.',
        'auth/network-request-failed':'Error de red. Verifica tu conexión.',
        'auth/cancelled-popup-request': 'Popup cancelado.',
      };
      toast.error(msg[code] || `Error (${code}): ${error?.message}`, { duration: 8000 });
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
            <p className="text-blue-300/70 text-sm font-medium">Elite Edition</p>
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
              Compite en tiempo real contra otros estudiantes de la Universidad Francisco Gavidia.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 max-w-sm">
            <FeatureRow icon={<Zap className="w-5 h-5 text-ufg-gold" />} text="Duelos en tiempo real con IA" />
            <FeatureRow icon={<Trophy className="w-5 h-5 text-ufg-gold" />} text="Ranking global de estudiantes" />
            <FeatureRow icon={<Users className="w-5 h-5 text-ufg-gold" />} text="Salas multijugador abiertas" />
            <FeatureRow icon={<Award className="w-5 h-5 text-ufg-gold" />} text="Insignias y logros desbloqueables" />
          </div>
        </div>

        <p className="text-blue-300/40 text-sm relative z-10">
          Universidad Francisco Gavidia — San Salvador, SV
        </p>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-10"
        >
          {/* Mobile logo (only on small screens) */}
          <div className="lg:hidden flex items-center gap-3">
            <div className="w-12 h-12 bg-ufg-blue rounded-2xl flex items-center justify-center rotate-6">
              <GraduationCap className="w-7 h-7 text-ufg-gold" />
            </div>
            <h1 className="text-2xl font-display font-extrabold text-ufg-blue">Trivia UFG</h1>
          </div>

          <div>
            <h2 className="text-4xl font-display font-black text-slate-800 mb-2">Bienvenido</h2>
            <p className="text-slate-400 text-lg">Inicia sesión para unirte a la competencia.</p>
          </div>

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(0,51,102,0.15)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-4 bg-ufg-blue text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all text-lg"
            >
              <LogIn className="w-6 h-6" />
              Continuar con Google
            </motion.button>

            <p className="text-center text-slate-400 text-sm">
              Solo usuarios con cuenta institucional UFG.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <StatPill label="Preguntas" value="IA" />
            <StatPill label="Jugadores" value="∞" />
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
  <div className="text-center p-3 bg-slate-50 rounded-2xl">
    <p className="text-xl font-display font-black text-ufg-blue">{value}</p>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">{label}</p>
  </div>
);
