import React, { createContext, useContext, useState } from 'react';

const SimulationContext = createContext();

// Estado inicial
const initialState = {
  patient: { R1: 10.0, C1: 0.05, R2: 10.0, C2: 0.05 },
  ventilator: {
    modo: 'PCV',
    PEEP: 5.0,
    P_driving: 15.0,
    fr: 15.0,
    Ti: 1.0,
    Vt: 0.5,
    FiO2: 0.21,
  },
  fisiologia: {
    k_sensibilidad: 0.1,
    Gp_control: 0.3,
    Gi_control: 0.01,
    Qs_Qt: 0.05,
    V_D: 0.15
  },
  results: null,
  isLoading: false,
  error: null,
};

export function SimulationProvider({ children }) {
  const [state, setState] = useState(initialState);

  const updateParameters = (newParams) => {
    setState(prev => ({ ...prev, ...newParams }));
  };

  const runSimulation = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const payload = {
        paciente: state.patient,
        ventilador: state.ventilator,
        fisiologia: state.fisiologia,
      };

      const response = await fetch('http://localhost/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Error en la simulación');
      }

      const data = await response.json();
      setState(prev => ({ ...prev, results: data, isLoading: false }));

    } catch (err) {
      setState(prev => ({ ...prev, isLoading: false, error: err.message }));
    }
  };

  const value = {
    simulationState: state,
    updateParameters,
    runSimulation
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation debe ser usado dentro de un SimulationProvider');
  }
  return context;
}