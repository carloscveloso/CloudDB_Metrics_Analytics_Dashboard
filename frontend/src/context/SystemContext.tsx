// src/contexts/SystemContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { setChaosMode } from '../data/db';

interface SystemState {
  chaosMode: boolean;
  selectedInstance: string | null;
  timeWindow: number;
  viewMode: 'dashboard' | 'diagnostics';
}

interface SystemContextValue extends SystemState {
  toggleChaosMode: () => void;
  setSelectedInstance: (id: string | null) => void;
  setTimeWindow: (hours: number) => void;
  setViewMode: (mode: 'dashboard' | 'diagnostics') => void;
}

const SystemContext = createContext<SystemContextValue | undefined>(undefined);

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SystemState>({
    chaosMode: false,
    selectedInstance: 'db-prod-pg',
    timeWindow: 24,
    viewMode: 'dashboard',
  });

  const toggleChaosMode = useCallback(() => {
    const newMode = !state.chaosMode;
    setState(prev => ({ ...prev, chaosMode: newMode }));
    setChaosMode(newMode); // Sincroniza com a variável no db.ts
  }, [state.chaosMode]);

  const setSelectedInstance = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, selectedInstance: id }));
  }, []);

  const setTimeWindow = useCallback((hours: number) => {
    setState(prev => ({ ...prev, timeWindow: hours }));
  }, []);

  const setViewMode = useCallback((mode: 'dashboard' | 'diagnostics') => {
    setState(prev => ({ ...prev, viewMode: mode }));
  }, []);

  return (
    <SystemContext.Provider
      value={{
        ...state,
        toggleChaosMode,
        setSelectedInstance,
        setTimeWindow,
        setViewMode,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};