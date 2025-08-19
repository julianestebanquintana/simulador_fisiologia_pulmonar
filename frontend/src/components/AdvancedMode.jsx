import React from 'react';
import { Form, Button, Card, Row, Col, Accordion } from 'react-bootstrap';

const AdvancedMode = ({ parameters, onParameterChange, onRunSimulation, isLoading }) => {
  const handlePatientChange = (field, value) => {
    onParameterChange({ patient: { ...parameters.patient, [field]: value } });
  };

  const handleVentilatorChange = (field, value) => {
    onParameterChange({ ventilator: { ...parameters.ventilator, [field]: value } });
  };

  return (
    <div>
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">
            <i className="fas fa-cogs me-2"></i>
            Modo Avanzado - Parámetros Técnicos
          </h5>
        </Card.Header>
        <Card.Body>
          <Accordion defaultActiveKey="0">
            {/* Parámetros del Ventilador */}
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <i className="fas fa-wind me-2"></i>
                Parámetros del Ventilador
              </Accordion.Header>
              <Accordion.Body>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        Modo de Ventilación
                      </Form.Label>
                      <Form.Select
                        value={parameters.ventilator.modo}
                        onChange={(e) => handleVentilatorChange('modo', e.target.value)}
                      >
                        <option value="PCV">Presión Controlada (PCV)</option>
                        <option value="VCV">Volumen Controlado (VCV)</option>
                        <option value="ESPONTANEO">Espontáneo</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        PEEP (cmH₂O)
                      </Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        value={parameters.ventilator.PEEP}
                        onChange={(e) => handleVentilatorChange('PEEP', parseFloat(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        Presión de Conducción (cmH₂O)
                      </Form.Label>
                      <Form.Control
                        type="number"
                        min="5"
                        max="50"
                        step="1"
                        value={parameters.ventilator.P_driving}
                        onChange={(e) => handleVentilatorChange('P_driving', parseFloat(e.target.value))}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        Volumen Tidal (L)
                      </Form.Label>
                      <Form.Control
                        type="number"
                        min="0.1"
                        max="2"
                        step="0.1"
                        value={parameters.ventilator.Vt}
                        onChange={(e) => handleVentilatorChange('Vt', parseFloat(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        Frecuencia Respiratoria (rpm)
                      </Form.Label>
                      <Form.Control
                        type="number"
                        min="5"
                        max="40"
                        step="1"
                        value={parameters.ventilator.fr}
                        onChange={(e) => handleVentilatorChange('fr', parseInt(e.target.value))}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        Tiempo Inspiratorio (s)
                      </Form.Label>
                      <Form.Control
                        type="number"
                        min="0.5"
                        max="3"
                        step="0.1"
                        value={parameters.ventilator.Ti}
                        onChange={(e) => handleVentilatorChange('Ti', parseFloat(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        FiO₂ (%)
                      </Form.Label>
                      <Form.Control
                        type="number"
                        min="21"
                        max="100"
                        step="1"
                        value={parameters.ventilator.FiO2 * 100}
                        onChange={(e) => handleVentilatorChange('FiO2', parseFloat(e.target.value) / 100)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>

            {/* Parámetros del Paciente */}
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                <i className="fas fa-user me-2"></i>
                Parámetros del Paciente (Modelo de Dos Compartimientos)
              </Accordion.Header>
              <Accordion.Body>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        R₁ (cmH₂O·s/L)
                      </Form.Label>
                      <Form.Control
                        type="number"
                        min="1"
                        max="50"
                        step="0.5"
                        value={parameters.patient.R1}
                        onChange={(e) => handlePatientChange('R1', parseFloat(e.target.value))}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        C₁ (L/cmH₂O)
                      </Form.Label>
                      <Form.Control
                        type="number"
                        min="0.01"
                        max="0.5"
                        step="0.01"
                        value={parameters.patient.C1}
                        onChange={(e) => handlePatientChange('C1', parseFloat(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        R₂ (cmH₂O·s/L)
                      </Form.Label>
                      <Form.Control
                        type="number"
                        min="1"
                        max="50"
                        step="0.5"
                        value={parameters.patient.R2}
                        onChange={(e) => handlePatientChange('R2', parseFloat(e.target.value))}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        C₂ (L/cmH₂O)
                      </Form.Label>
                      <Form.Control
                        type="number"
                        min="0.01"
                        max="0.5"
                        step="0.01"
                        value={parameters.patient.C2}
                        onChange={(e) => handlePatientChange('C2', parseFloat(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          {/* Botón de Ejecutar Simulación */}
          <Row className="mt-4">
            <Col className="text-center">
              <div>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onRunSimulation}
                  disabled={isLoading}
                  className="px-5"
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Ejecutando Simulación...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-play me-2"></i>
                      Ejecutar Simulación
                    </>
                  )}
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdvancedMode;
