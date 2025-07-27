import React from 'react';
import { useSimulation } from '../context/SimulationContext';

// Componente individual para un slider, para no repetir código
const ParameterSlider = ({ label, value, min, max, step, unit, onChange }) => (
  <div className="mb-3">
    <label htmlFor={label} className="form-label">
      {label}: <span className="fw-bold">{value}</span> {unit}
    </label>
    <input
      type="range"
      className="form-range"
      id={label}
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
  
  const handlePatientChange = (e, param) => {
    updateParameters({
      patient: {
        ...simulationState.patient,
        [param]: parseFloat(e.target.value),
      },
    });
  };

  const handleVentilatorChange = (e, param) => {
    updateParameters({
      ventilator: {
        ...simulationState.ventilator,
        [param]: parseFloat(e.target.value),
      },
    });
  };

  return (
    <div className="d-flex flex-column h-100">
      <div className="flex-grow-1">
        <h5 className="mt-3">Parámetros del Paciente</h5>
        <ParameterSlider
          label="Resistencia (R1)"
          value={simulationState.patient.R1}
          min="5" max="50" step="1" unit="cmH2O/L/s"
          onChange={(e) => handlePatientChange(e, 'R1')}
        />
        <ParameterSlider
          label="Compliancia (C1)"
          value={simulationState.patient.C1}
          min="0.01" max="0.1" step="0.01" unit="L/cmH2O"
          onChange={(e) => handlePatientChange(e, 'C1')}
        />

        <h5 className="mt-4">Parámetros del Ventilador</h5>
        <ParameterSlider
          label="PEEP"
          value={simulationState.ventilator.peep}
          min="0" max="25" step="1" unit="cmH2O"
          onChange={(e) => handleVentilatorChange(e, 'peep')}
        />
        <ParameterSlider
          label="Presión de Conducción"
          value={simulationState.ventilator.drivingPressure}
          min="5" max="35" step="1" unit="cmH2O"
          onChange={(e) => handleVentilatorChange(e, 'drivingPressure')}
        />
        <ParameterSlider
          label="Frecuencia Respiratoria"
          value={simulationState.ventilator.respiratoryRate}
          min="8" max="40" step="1" unit="rpm"
          onChange={(e) => handleVentilatorChange(e, 'respiratoryRate')}
        />
      </div>
      <div className="d-grid mt-auto"> {/* mt-auto empuja el botón hacia abajo */}
        <button 
          className="btn btn-primary btn-lg" 
          onClick={runSimulation}
          disabled={simulationState.isLoading} // <-- Deshabilita el botón al cargar
        >
          {simulationState.isLoading ? 'Simulando...' : 'Ejecutar Simulación'}
        </button>
        {/* Mensaje si hay un error */}
        {simulationState.error && (
          <div className="alert alert-danger mt-2" role="alert">
            Error: {simulationState.error}
          </div>
        )}
      </div>
    </div>
  );
}


export default ParameterForm;