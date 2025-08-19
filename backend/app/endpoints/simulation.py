import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, Any

# Servicios y utilidades
from app.services.simulation_service import SimulationService
from app.utils.validators import ParameterValidator

logger = logging.getLogger(__name__)
router = APIRouter(prefix="", tags=["Simulación"])

# Instancia del servicio de simulación
simulation_service = SimulationService()


# --- Modelos Pydantic ---
class PacienteParams(BaseModel):
    R1: float = Field(10.0, gt=0, description="Resistencia 1 (cmH2O/L/s)")
    C1: float = Field(0.05, gt=0, description="Compliancia 1 (L/cmH2O)")
    R2: float = Field(10.0, gt=0, description="Resistencia 2 (cmH2O/L/s)")
    C2: float = Field(0.05, gt=0, description="Compliancia 2 (L/cmH2O)")


class VentiladorParams(BaseModel):
    # modo: str = Field("PCV", description="Modo ventilatorio (PCV o VCV)")
    modo: str = Field("PCV", description="Modo ventilatorio (PCV, VCV o ESPONTANEO)")
    PEEP: float = Field(5.0, ge=0, description="PEEP (cmH2O)")
    P_driving: float = Field(15.0, ge=0, description="Presión de conducción (cmH2O)")
    fr: float = Field(15.0, gt=0, description="Frecuencia respiratoria (rpm)")
    Ti: float = Field(1.0, gt=0, description="Tiempo inspiratorio (s)")
    Vt: float = Field(0.5, gt=0, description="Volumen Tidal para VCV (L)")


class SimulationRequest(BaseModel):
    paciente: PacienteParams
    ventilador: VentiladorParams


# --- Endpoint de Simulación ---
@router.post("/simulate", response_model=Dict[str, Any])
async def run_simulation(request: SimulationRequest):
    """
    Ejecuta una simulación cardiorrespiratoria integral.
    """
    logger.info(f"Iniciando simulación con parámetros: {request.model_dump()}")
    
    try:
        # Validar parámetros
        paciente_params = request.paciente.model_dump()
        ventilador_params = request.ventilador.model_dump()
        
        # Validar parámetros del paciente
        patient_error = ParameterValidator.validate_patient_params(paciente_params)
        if patient_error:
            raise HTTPException(status_code=400, detail=f"Error en parámetros del paciente: {patient_error}")
        
        # Validar parámetros del ventilador
        ventilator_error = ParameterValidator.validate_ventilator_params(ventilador_params)
        if ventilator_error:
            raise HTTPException(status_code=400, detail=f"Error en parámetros del ventilador: {ventilator_error}")
        
        # Ejecutar simulación usando el servicio
        resultado = simulation_service.run_simulation(paciente_params, ventilador_params)
        
        logger.info("Simulación completada exitosamente.")
        return resultado

    except ValueError as ve:
        logger.error(f"Error de validación: {ve}", exc_info=True)
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Error inesperado: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Error interno del servidor.")
