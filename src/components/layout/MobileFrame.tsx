import React from 'react';
import type { ReactNode, FC } from 'react';

interface MobileFrameProps {
  children: ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {children}
    </div>
  );
};
