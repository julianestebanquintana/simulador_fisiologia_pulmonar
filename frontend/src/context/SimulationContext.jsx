import React, { createContext, useState, useContext } from 'react';

// 1. Crear el Contexto
const SimulationContext = createContext();

// 2. Definir el estado inicial de la simulación
const initialState = {
  patient: {
    R1: 10.0,
    C1: 0.05,
    R2: 10.0,
    C2: 0.05,
  },
  ventilator: {
    mode: 'PCV',
    peep: 5.0,
    drivingPressure: 15.0,
    respiratoryRate: 15.0,
    inspiratoryTime: 1.0,
    vt: 0.5,
  },
  results: null, // Iniciar como null para indicar que no hay resultados
  isLoading: false,
  error: null,
};

// 3. Crear el Componente Proveedor (Provider)
export function SimulationProvider({ children }) {
  const [simulationState, setSimulationState] = useState(initialState);

  const updateParameters = (newParams) => {
    setSimulationState((prevState) => ({
      ...prevState,
      ...newParams,
    }));
  };

  const runSimulation = async () => {
    const { patient, ventilator } = simulationState;

    setSimulationState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Variables definidas al principio,
      // con los datos más recientes antes de la actualización.
      const payload = {
        paciente: patient,
        ventilador: ventilator,
      };

      // Imprimir el payload
      console.log("Enviando payload al backend:", payload);

      const response = await fetch('http://localhost:8000/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ocurrió un error en el servidor');
      }

      const data = await response.json();
      
      setSimulationState((prev) => ({
        ...prev,
        results: data,
        isLoading: false,
      }));

    } catch (err) {
      console.error("Error al ejecutar la simulación:", err);
      setSimulationState((prev) => ({
        ...prev,
        isLoading: false,
        error: err.message,
      }));
    }
  };

  const value = {
    simulationState,
    updateParameters,
    runSimulation,
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}

// 4. Crear un "Custom Hook" para facilitar el uso del contexto
export function useSimulation() {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error('useSimulation debe ser usado dentro de un SimulationProvider');
  }
  return context;
}