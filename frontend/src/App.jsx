import React from 'react';
import { useSimulation } from './context/SimulationContext';
import ParameterForm from './components/ParameterForm';
import SimulationCharts from './components/SimulationCharts';
import MetricsDisplay from './components/MetricsDisplay';
import './App.css';

function App() {
  const { simulationState, updateParameters, runSimulation } = useSimulation();
  const { patient, ventilator, fisiologia, isLoading } = simulationState;

  const handleParameterChange = (changes) => {
    updateParameters(changes);
  };

  const handleRunSimulation = () => {
    runSimulation();
  };

  return (
    <div className="app-container container-fluid p-3">
      <header className="mb-3">
        <h1 className="text-center">Simulador de Fisiología Pulmonar</h1>
        <hr />
      </header>

      <main className="row main-content">
        {/* Columna Izquierda: Panel de Control */}
        <aside className="col-md-4 border-end sidebar">
          <div className="sidebar-content">
            <ParameterForm
              parameters={{ patient, ventilator, fisiologia }}
              onParameterChange={handleParameterChange}
              onRunSimulation={handleRunSimulation}
              isLoading={isLoading}
            />
          </div>
        </aside>

        {/* Columna Derecha: Visualizaciones */}
        <section className="col-md-8 charts-column">
          {/* Fila Superior para Gráficos */}
          <div className="flex-grow-1 p-3">
            <h2>Visualización</h2>
            {/* Componente SimulationCharts.jsx */}
            <SimulationCharts />
          </div>
          
          {/* Fila Inferior para Métricas */}
          <div className="p-3 border-top">
            <h2>Métricas Clave</h2>
            {/* 2. Reemplaza el placeholder con el componente de métricas */}
            <MetricsDisplay />
          </div>
        </section>
    </main>

      <footer className="mt-auto pt-3 text-center text-muted border-top">
        <small>Julián Esteban Quintana. Medellín, Colombia. 2025.</small>
      </footer>
    </div>
  );
}

export default App;