import React from 'react';
import { useSimulation } from '../context/SimulationContext';

const MetricItem = ({ label, value, unit }) => (
  <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
    <div className="card text-center h-100">
      <div className="card-header">{label}</div>
      <div className="card-body">
        <h5 className="card-title">{value} <small className="text-muted">{unit}</small></h5>
      </div>
    </div>
  </div>
);

function MetricsDisplay() {
  const { simulationState } = useSimulation();
  const { results } = simulationState;

  if (!results) return null; // No mostrar nada si no hay resultados
  const autoPeepValue = results.metricas_mecanicas.auto_peep || 0;

  return (
    <div className="container-fluid">
      <div className="row">
        <MetricItem label="Volumen Tidal" value={results.metricas_mecanicas.volumen_tidal_entregado.toFixed(2)} unit="L" />
        <MetricItem label="Presión Pico" value={results.metricas_mecanicas.presion_pico.toFixed(1)} unit="cmH2O" />
        <MetricItem label="Auto-PEEP" value={autoPeepValue.toFixed(1)} unit="cmH2O" />
        <MetricItem label="Gasto Cardíaco" value={results.metricas_hemodinamicas.GC_actual_L_min.toFixed(2)} unit="L/min" />
        <MetricItem label="PACO₂" value={results.metricas_gases.PACO2_mmHg.toFixed(1)} unit="mmHg" />
        <MetricItem label="PAO₂" value={results.metricas_gases.PAO2_mmHg.toFixed(1)} unit="mmHg" />
        <MetricItem label="Entrega O₂ (DO₂)" value={results.metricas_hemodinamicas.DO2_ml_min.toFixed(0)} unit="mL/min" />
      </div>
    </div>
  );
}

export default MetricsDisplay;