import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { MobileFrame } from './components/layout/MobileFrame';
import { Toaster } from 'react-hot-toast';

// Pages
import { Login } from './pages/Login';
import { Lobby } from './pages/Lobby';
import { GameRoom } from './pages/GameRoom';
import { Profile } from './pages/Profile';
import { Admin }   from './pages/Admin';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="flex items-center justify-center h-full bg-slate-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-ufg-gold"></div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;
  
  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
      <Router>
        <MobileFrame>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Lobby />
              </ProtectedRoute>
            } />
            <Route path="/game" element={
              <ProtectedRoute>
                <GameRoom />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />
          </Routes>
        </MobileFrame>
        <Toaster position="top-center" />
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
