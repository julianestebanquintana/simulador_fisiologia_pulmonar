import React from 'react';
import { Card, Row, Col, Button, Badge } from 'react-bootstrap';
import { getAllPresets } from '../data/clinicalPresets';
import CustomTooltip from './CustomTooltip';

const ClinicalPresets = ({ onLoadPreset, currentPreset }) => {
  const presets = getAllPresets();

  const handlePresetClick = (preset) => {
    onLoadPreset(preset);
  };

  const getPresetColor = (presetKey) => {
    const colors = {
      pacienteNormal: 'success',
      epoc: 'warning',
      sdra: 'danger',
      neumonia: 'info',
      asma: 'primary',
      ventilacionProtectora: 'secondary'
    };
    return colors[presetKey] || 'light';
  };

  const getPresetTooltip = (preset) => {
    return `
      <strong>${preset.name}</strong><br/>
      ${preset.description}<br/><br/>
      <strong>Parámetros principales:</strong><br/>
      • PEEP: ${preset.ventilator.PEEP} cmH₂O<br/>
      • Frecuencia: ${preset.ventilator.fr} rpm<br/>
      • R₁: ${preset.patient.R1} cmH₂O·s/L<br/>
      • C₁: ${preset.patient.C1} L/cmH₂O
    `;
  };

  return (
    <div>
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">
            <i className="fas fa-user-md me-2"></i>
            Presets Clínicos
          </h5>
          <small className="text-muted">
            Carga configuraciones predefinidas para diferentes escenarios clínicos
          </small>
        </Card.Header>
        <Card.Body>
          <Row>
            {presets.map((preset, index) => (
              <Col key={preset.key} md={6} lg={4} className="mb-3">
                <Card 
                  className={`h-100 preset-card ${currentPreset === preset.key ? 'border-primary' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handlePresetClick(preset)}
                >
                  <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center">
                    <div className="mb-2">
                      <CustomTooltip content={getPresetTooltip(preset)}>
                        <h6 className="card-title mb-2" style={{ cursor: 'help' }}>
                          {preset.name} <i className="fas fa-info-circle text-muted" style={{ fontSize: '0.8em' }}></i>
                        </h6>
                      </CustomTooltip>
                      <Badge bg={getPresetColor(preset.key)}>
                        {preset.key === 'pacienteNormal' && 'Saludable'}
                        {preset.key === 'epoc' && 'Enfermedad'}
                        {preset.key === 'sdra' && 'Crítico'}
                        {preset.key === 'neumonia' && 'Infección'}
                        {preset.key === 'asma' && 'Obstrucción'}
                        {preset.key === 'ventilacionProtectora' && 'Terapéutico'}
                      </Badge>
                    </div>
                    
                    <Button
                      variant={currentPreset === preset.key ? "primary" : "outline-primary"}
                      size="sm"
                      className="w-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePresetClick(preset);
                      }}
                    >
                      {currentPreset === preset.key ? (
                        <>
                          <i className="fas fa-check me-1"></i>
                          Cargado
                        </>
                      ) : (
                        <>
                          <i className="fas fa-download me-1"></i>
                          Cargar
                        </>
                      )}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ClinicalPresets;
