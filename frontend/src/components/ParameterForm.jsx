import React, { useState } from 'react';
import { Container, Row, Col, Button, Card, Tabs, Tab } from 'react-bootstrap';
import SimpleMode from './SimpleMode';
import AdvancedMode from './AdvancedMode';
import ClinicalPresets from './ClinicalPresets';
import { getPreset } from '../data/clinicalPresets';

const ParameterForm = ({ parameters, onParameterChange, onRunSimulation, isLoading }) => {
  const [activeTab, setActiveTab] = useState('simple');
  const [currentPreset, setCurrentPreset] = useState('pacienteNormal');

  const handleLoadPreset = (preset) => {
    // Cargar los parámetros del preset
    onParameterChange({
      patient: preset.patient,
      ventilator: preset.ventilator
    });
    setCurrentPreset(preset.key);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Container fluid>
      <div>
        {/* Presets Clínicos */}
        <ClinicalPresets 
          onLoadPreset={handleLoadPreset}
          currentPreset={currentPreset}
        />

        {/* Selector de Modo */}
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">
              <i className="fas fa-cog me-2"></i>
              Configuración de Parámetros
            </h5>
          </Card.Header>
          <Card.Body>
            <Tabs
              activeKey={activeTab}
              onSelect={handleTabChange}
              className="mb-3"
            >
              <Tab eventKey="simple" title={
                <span>
                  <i className="fas fa-sliders-h me-1"></i>
                  Modo Simple
                </span>
              }>
                <SimpleMode
                  parameters={parameters}
                  onParameterChange={onParameterChange}
                  onRunSimulation={onRunSimulation}
                  isLoading={isLoading}
                />
              </Tab>
              
              <Tab eventKey="advanced" title={
                <span>
                  <i className="fas fa-cogs me-1"></i>
                  Modo Avanzado
                </span>
              }>
                <AdvancedMode
                  parameters={parameters}
                  onParameterChange={onParameterChange}
                  onRunSimulation={onRunSimulation}
                  isLoading={isLoading}
                />
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>

        {/* Información del Preset Actual */}
        {currentPreset && (
          <Card className="mb-4">
            <Card.Body className="py-2">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">Preset actual:</small>
                  <strong className="ms-2">{getPreset(currentPreset).name}</strong>
                </div>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => {
                    const defaultPreset = getPreset('pacienteNormal');
                    handleLoadPreset(defaultPreset);
                  }}
                >
                  <i className="fas fa-undo me-1"></i>
                  Restablecer
                </Button>
              </div>
            </Card.Body>
          </Card>
        )}
      </div>
    </Container>
  );
};

export default ParameterForm;