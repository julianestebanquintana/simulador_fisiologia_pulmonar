import React from 'react';
import { useSimulation } from '../context/SimulationContext';

const ParameterSlider = ({ label, value, min, max, step, unit, onChange, name }) => (
  <div className="mb-3">
    <label htmlFor={label} className="form-label">
      {label}: <span className="fw-bold">{value}</span> {unit}
    </label>
    <input
      type="range"
      className="form-range"
      id={label}
      name={name}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
    />
  </div>
);

function ParameterForm() {
  const { simulationState, updateParameters, runSimulation } = useSimulation();
  
  const handlePatientChange = (e) => {
    updateParameters({
      patient: {
        ...simulationState.patient,
        [e.target.name]: parseFloat(e.target.value),
      },
    });
  };

  const handleVentilatorChange = (e) => {
    updateParameters({
      ventilator: {
        ...simulationState.ventilator,
        [e.target.name]: e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value,
      },
    });
  };

  return (
    <div className="d-flex flex-column h-100">
      <div className="flex-grow-1">
        <h5 className="mt-3">Parámetros del Paciente</h5>
        <ParameterSlider label="Resistencia 1 (R1)" name="R1" value={simulationState.patient.R1} min="5" max="50" step="1" unit="cmH2O/L/s" onChange={handlePatientChange} />
        <ParameterSlider label="Compliancia 1 (C1)" name="C1" value={simulationState.patient.C1} min="0.01" max="0.1" step="0.005" unit="L/cmH2O" onChange={handlePatientChange} />
        <ParameterSlider label="Resistencia 2 (R2)" name="R2" value={simulationState.patient.R2} min="5" max="50" step="1" unit="cmH2O/L/s" onChange={handlePatientChange} />
        <ParameterSlider label="Compliancia 2 (C2)" name="C2" value={simulationState.patient.C2} min="0.01" max="0.1" step="0.005" unit="L/cmH2O" onChange={handlePatientChange} />

        <h5 className="mt-4">Parámetros del Ventilador</h5>
        <div className="mb-3">
          <label htmlFor="vent-mode" className="form-label">Modo Ventilatorio</label>
          <select className="form-select" id="vent-mode" name="modo" value={simulationState.ventilator.modo} onChange={handleVentilatorChange}>
            <option value="PCV">Controlado por Presión (PCV)</option>
            <option value="VCV">Controlado por Volumen (VCV)</option>
          </select>
        </div>
        <ParameterSlider label="PEEP" name="PEEP" value={simulationState.ventilator.PEEP} min="0" max="25" step="1" unit="cmH2O" onChange={handleVentilatorChange} />
        <ParameterSlider label="Presión de Conducción" name="P_driving" value={simulationState.ventilator.P_driving} min="5" max="35" step="1" unit="cmH2O" onChange={handleVentilatorChange} />
        <ParameterSlider label="Frecuencia Respiratoria" name="fr" value={simulationState.ventilator.fr} min="8" max="40" step="1" unit="rpm" onChange={handleVentilatorChange} />
        <ParameterSlider label="FiO₂" name="FiO2" value={simulationState.ventilator.FiO2} min="0.21" max="1.0" step="0.01" unit="%" onChange={handleVentilatorChange} />
      </div>
      <div className="d-grid mt-auto">
        <button className="btn btn-primary btn-lg" onClick={runSimulation} disabled={simulationState.isLoading}>
          {simulationState.isLoading ? 'Simulando...' : 'Ejecutar Simulación'}
        </button>
        {simulationState.error && <div className="alert alert-danger mt-2">{simulationState.error}</div>}
      </div>
    </div>
  );
}

export default ParameterForm;