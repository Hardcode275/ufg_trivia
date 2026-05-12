import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = ({ variant = 'nav' }: { variant?: 'nav' | 'surface' }) => {
  const { theme, toggle } = useTheme();
  const onNav = variant === 'nav';
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggle}
      className={onNav
        ? 'p-2.5 bg-white/10 hover:bg-white/20 transition-colors rounded-xl'
        : 'p-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors rounded-xl'
      }
      title={theme === 'dark' ? 'Modo día' : 'Modo oscuro'}
    >
      {theme === 'dark'
        ? <Sun  className="w-5 h-5 text-ufg-gold" />
        : <Moon className={`w-5 h-5 ${onNav ? 'text-white' : 'text-slate-600'}`} />}
    </motion.button>
  );
};
