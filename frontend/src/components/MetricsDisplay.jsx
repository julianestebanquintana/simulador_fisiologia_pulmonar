import React from 'react';
import { useSimulation } from '../context/SimulationContext';

const MetricItem = ({ label, value, unit }) => (
  <div className="col-auto mb-2">
    <div className="d-flex align-items-center">
      <span className="fw-bold me-2">{label}:</span>
      <span className="text-primary fw-bold">{value}</span>
      <small className="text-muted ms-1">{unit}</small>
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
      <div className="row g-2">
        <MetricItem label="Vt" value={results.metricas_mecanicas.volumen_tidal_entregado.toFixed(2)} unit="L" />
        <MetricItem label="Ppico" value={results.metricas_mecanicas.presion_pico.toFixed(1)} unit="cmH2O" />
        <MetricItem label="Auto-PEEP" value={autoPeepValue.toFixed(1)} unit="cmH2O" />
        <MetricItem label="GC" value={results.metricas_hemodinamicas.GC_actual_L_min.toFixed(2)} unit="L/min" />
        <MetricItem label="PACO₂" value={results.metricas_gases.PACO2_mmHg.toFixed(1)} unit="mmHg" />
        <MetricItem label="PAO₂" value={results.metricas_gases.PAO2_mmHg.toFixed(1)} unit="mmHg" />
        <MetricItem label="DO₂" value={results.metricas_hemodinamicas.DO2_ml_min.toFixed(0)} unit="mL/min" />
      </div>
    </div>
  );
}

export default MetricsDisplay;