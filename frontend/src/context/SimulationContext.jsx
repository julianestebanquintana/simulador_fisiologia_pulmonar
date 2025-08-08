import React, { createContext, useState, useContext } from 'react';

const SimulationContext = createContext();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Estado inicial con todos los parámetros
const initialState = {
  patient: { R1: 10.0, C1: 0.05, R2: 10.0, C2: 0.05 },
  ventilator: {
    modo: 'PCV',
    PEEP: 5.0,
    P_driving: 15.0,
    fr: 15.0,
    Ti: 1.0,
    Vt: 0.5,
    FiO2: 0.21, // Añadido
  },
  results: null,
  isLoading: false,
  error: null,
};

export function SimulationProvider({ children }) {
  const [simulationState, setSimulationState] = useState(initialState);

  const updateParameters = (newParams) => {
    setSimulationState((prevState) => ({ ...prevState, ...newParams }));
  };

  const runSimulation = async () => {
    const { patient, ventilator } = simulationState;
    setSimulationState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // El payload envía los nombres de clave que el backend espera
      const payload = {
        paciente: patient,
        ventilador: ventilator,
      };

      console.log("Enviando payload al backend:", payload);

      const response = await fetch(`${API_BASE_URL}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ocurrió un error en el servidor');
      }

      const data = await response.json();
      setSimulationState((prev) => ({ ...prev, results: data, isLoading: false }));

    } catch (err) {
      console.error("Error al ejecutar la simulación:", err);
      setSimulationState((prev) => ({ ...prev, isLoading: false, error: err.message }));
    }
  };

  const value = { simulationState, updateParameters, runSimulation };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error('useSimulation debe ser usado dentro de un SimulationProvider');
  }
  return context;
}