import React from 'react';
import ParameterForm from './components/ParameterForm';
import SimulationCharts from './components/SimulationCharts';

function App() {
  return (
    <div className="container-fluid vh-100 d-flex flex-column p-3">
      <header className="mb-3">
        <h1 className="text-center">Simulador de Fisiología Pulmonar</h1>
        <hr />
      </header>

    <main className="row flex-grow-1">
        {/* Columna Izquierda: Panel de Control */}
        <aside className="col-md-4 border-end">
          <div className="p-3">
            <ParameterForm />
          </div>
        </aside>

        {/* Columna Derecha: Visualizaciones */}
        <section className="col-md-8 d-flex flex-column">
          {/* Fila Superior para Gráficos */}
          <div className="flex-grow-1 p-3">
            <h2>Visualización</h2>
            {/* Aquí irá nuestro componente SimulationCharts.jsx */}
            <SimulationCharts />
          </div>
          
          {/* Fila Inferior para Métricas */}
          <div className="p-3 border-top">
            <h2>Métricas Clave</h2>
            {/* Aquí irá nuestro componente MetricsDisplay.jsx */}
            <p className="text-muted">Datos numéricos...</p>
          </div>
        </section>
      </main>

      <footer className="mt-auto pt-3 text-center text-muted border-top">
        <small>Proyecto de Grado - Maestría en Ingeniería Biomédica</small>
      </footer>
    </div>
  );
}

export default App;