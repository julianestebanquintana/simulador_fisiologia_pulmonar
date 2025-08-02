import React from 'react';
import { Form } from 'react-bootstrap';
import { useSimulation } from '../context/SimulationContext';

const ParameterSlider = ({ label, value, min, max, step, unit, onChange, name, disabled = false }) => (
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
      disabled={disabled} // <-- Se añade la propiedad 'disabled'
    />
  </div>
);

function ParameterForm() {
  const { simulationState, updateParameters, runSimulation } = useSimulation();
  const { patient, ventilator } = simulationState;
  const isSpontaneous = ventilator.modo === 'ESPONTANEO';

  const handleModeChange = (e) => {
    const newMode = e.target.checked ? 'ESPONTANEO' : 'PCV';
    updateParameters({
      ventilator: { ...ventilator, modo: newMode },
    });
  };
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
    <div className="control-panel">
      <div className="control-panel__sliders">
        <h5 className="mt-3">Parámetros del Paciente</h5>
        <ParameterSlider label="Resistencia 1 (R1)" name="R1" value={patient.R1} min="5" max="50" step="1" unit="cmH2O/L/s" onChange={handlePatientChange} />
        <ParameterSlider label="Compliancia 1 (C1)" name="C1" value={patient.C1} min="0.01" max="0.1" step="0.005" unit="L/cmH2O" onChange={handlePatientChange} />
        <ParameterSlider label="Resistencia 2 (R2)" name="R2" value={patient.R2} min="5" max="50" step="1" unit="cmH2O/L/s" onChange={handlePatientChange} />
        <ParameterSlider label="Compliancia 2 (C2)" name="C2" value={patient.C2} min="0.01" max="0.1" step="0.005" unit="L/cmH2O" onChange={handlePatientChange} />
        
        <h5 className="mt-4">Modo de Ventilación</h5>
        <Form.Group className="mb-3">
          {['PCV', 'VCV', 'ESPONTANEO'].map((mode) => (
            <Form.Check
              key={mode}
              inline
              type="radio"
              id={`mode-${mode}`}
              name="modo"
              label={mode}
              value={mode}
              checked={ventilator.modo === mode}
              onChange={handleVentilatorChange}
            />
          ))}
        </Form.Group>

        <h5 className="mt-4">Parámetros del Ventilador</h5>
        
        {ventilator.modo === 'PCV' && (
          <ParameterSlider label="Presión de Conducción" name="P_driving" value={ventilator.P_driving} min="5" max="35" step="1" unit="cmH2O" onChange={handleVentilatorChange} disabled={isSpontaneous} />
        )}

        {ventilator.modo === 'VCV' && (
          <ParameterSlider label="Volumen Tidal" name="Vt" value={ventilator.Vt} min="0.1" max="1.0" step="0.05" unit="L" onChange={handleVentilatorChange} disabled={isSpontaneous} />
        )}
        
        <ParameterSlider label="PEEP" name="PEEP" value={ventilator.PEEP} min="0" max="25" step="1" unit="cmH2O" onChange={handleVentilatorChange} disabled={isSpontaneous} />
        <ParameterSlider label="Frecuencia Respiratoria" name="fr" value={ventilator.fr} min="8" max="40" step="1" unit="rpm" onChange={handleVentilatorChange} disabled={isSpontaneous} />
        <ParameterSlider label="FiO₂" name="FiO2" value={ventilator.FiO2} min="0.21" max="1.0" step="0.01" unit="" onChange={handleVentilatorChange} />
      </div>

      <div className="d-grid mt-auto pt-3 border-top">
        <button className="btn btn-primary btn-lg" onClick={runSimulation} disabled={simulationState.isLoading}>
          {simulationState.isLoading ? 'Simulando...' : 'Ejecutar Simulación'}
        </button>
        {simulationState.error && <div className="alert alert-danger mt-2">{simulationState.error}</div>}
      </div>
    </div> 
  );
}

export default ParameterForm;