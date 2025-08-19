import React from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import CustomTooltip from './CustomTooltip';

const SimpleMode = ({ parameters, onParameterChange, onRunSimulation, isLoading }) => {
  const handleInputChange = (field, value) => {
    onParameterChange({ 
      ventilator: { 
        ...parameters.ventilator, 
        [field]: value 
      } 
    });
  };

  const handleModeChange = (mode) => {
    onParameterChange({ 
      ventilator: { 
        ...parameters.ventilator, 
        modo: mode 
      } 
    });
  };

  return (
    <div>
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">
            <i className="fas fa-sliders-h me-2"></i>
            Controles Esenciales
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            {/* Modo de Ventilación */}
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>
                  Modo de Ventilación
                  <CustomTooltip content="<strong>PCV:</strong> El ventilador mantiene una presión constante<br/><strong>VCV:</strong> El ventilador entrega un volumen fijo<br/><strong>Espontáneo:</strong> El paciente respira por sí mismo">
                    <i className="fas fa-info-circle ms-2 text-info" />
                  </CustomTooltip>
                </Form.Label>
                <Form.Select
                  value={parameters.ventilator.modo}
                  onChange={(e) => handleModeChange(e.target.value)}
                >
                  <option value="PCV">Presión Controlada (PCV)</option>
                  <option value="VCV">Volumen Controlado (VCV)</option>
                  <option value="ESPONTANEO">Espontáneo</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* PEEP */}
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>
                  PEEP (cmH₂O)
                  <CustomTooltip content="<strong>PEEP:</strong> Presión que se mantiene en las vías aéreas<br/>al final de la espiración. Ayuda a mantener los alvéolos abiertos.">
                    <i className="fas fa-info-circle ms-2 text-info" />
                  </CustomTooltip>
                </Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  value={parameters.ventilator.PEEP}
                  onChange={(e) => handleInputChange('PEEP', parseFloat(e.target.value))}
                />
              </Form.Group>
            </Col>
          </Row>

          {parameters.ventilator.modo !== 'ESPONTANEO' && (
            <Row>
              {/* Presión de Conducción o Volumen Tidal */}
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>
                    {parameters.ventilator.modo === 'PCV' ? 'Presión de Conducción (cmH₂O)' : 'Volumen Tidal (L)'}
                    <CustomTooltip content={parameters.ventilator.modo === 'PCV' 
                      ? "<strong>Presión de Conducción:</strong> Presión máxima que alcanza<br/>el ventilador durante la inspiración. Controla qué tan fuerte<br/>respira el paciente."
                      : "<strong>Volumen Tidal:</strong> Cantidad de aire que se entrega<br/>en cada respiración. Típicamente 6-8 ml/kg de peso corporal."
                    }>
                      <i className="fas fa-info-circle ms-2 text-info" />
                    </CustomTooltip>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min={parameters.ventilator.modo === 'PCV' ? "5" : "0.1"}
                    max={parameters.ventilator.modo === 'PCV' ? "50" : "2"}
                    step={parameters.ventilator.modo === 'PCV' ? "1" : "0.1"}
                    value={parameters.ventilator.modo === 'PCV' 
                      ? parameters.ventilator.P_driving 
                      : parameters.ventilator.Vt
                    }
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (parameters.ventilator.modo === 'PCV') {
                        handleInputChange('P_driving', value);
                      } else {
                        handleInputChange('Vt', value);
                      }
                    }}
                  />
                </Form.Group>
              </Col>

              {/* Frecuencia Respiratoria */}
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>
                    Frecuencia Respiratoria (rpm)
                    <CustomTooltip content="<strong>Frecuencia Respiratoria:</strong> Número de respiraciones<br/>por minuto. Controla qué tan rápido respira el paciente.">
                      <i className="fas fa-info-circle ms-2 text-info" />
                    </CustomTooltip>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min="5"
                    max="40"
                    step="1"
                    value={parameters.ventilator.fr}
                    onChange={(e) => handleInputChange('fr', parseFloat(e.target.value))}
                  />
                </Form.Group>
              </Col>
            </Row>
          )}

          {/* Botón de Ejecutar Simulación */}
          <Row>
            <Col className="text-center">
              <Button
                variant="primary"
                size="lg"
                onClick={onRunSimulation}
                disabled={isLoading}
                className="px-5"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin me-2"></i>
                    Ejecutando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-play me-2"></i>
                    Ejecutar Simulación
                  </>
                )}
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SimpleMode;
