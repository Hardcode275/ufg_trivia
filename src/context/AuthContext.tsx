import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, User, onAuthStateChanged, db, doc, getDoc, setDoc, onSnapshot } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubProfile: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      // Limpiar listener anterior si el usuario cambia
      if (unsubProfile) {
        unsubProfile();
        unsubProfile = null;
      }

      if (u) {
        const userDoc = doc(db, 'users', u.uid);
        const snap = await getDoc(userDoc);

        if (!snap.exists()) {
          const newProfile = {
            uid: u.uid,
            username: u.displayName || u.email?.split('@')[0] || 'Usuario',
            avatar: u.photoURL || `https://api.dicebear.com/9.x/avataaars/png?seed=${u.uid}`,
            totalPoints: 0,
            gamesPlayed: 0,
            lastActive: new Date().toISOString(),
            canViewAnalytics: false,
          };
          await setDoc(userDoc, newProfile);
        }

        // Escuchar cambios en tiempo real (ej. canViewAnalytics actualizado por el admin)
        unsubProfile = onSnapshot(userDoc, (snap) => {
          if (snap.exists()) setProfile(snap.data());
          setLoading(false);
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubAuth();
      if (unsubProfile) unsubProfile();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
