import logging
import numpy as np
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, Any

# Clases de simulación
from models.paciente import Paciente
from models.ventilador import Ventilador
from models.simulador import Simulador
from models.intercambio import IntercambioGases
from models.hemodinamica import InteraccionCorazonPulmon

logger = logging.getLogger(__name__)
router = APIRouter(prefix="", tags=["Simulación"])


# --- Modelos Pydantic ---
class PacienteParams(BaseModel):
    R1: float = Field(10.0, gt=0, description="Resistencia 1 (cmH2O/L/s)")
    C1: float = Field(0.05, gt=0, description="Compliancia 1 (L/cmH2O)")
    R2: float = Field(10.0, gt=0, description="Resistencia 2 (cmH2O/L/s)")
    C2: float = Field(0.05, gt=0, description="Compliancia 2 (L/cmH2O)")


class VentiladorParams(BaseModel):
    modo: str = Field("PCV", description="Modo ventilatorio (PCV o VCV)")
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
        paciente = Paciente(**request.paciente.model_dump())
        ventilador = Ventilador(**request.ventilador.model_dump())
        simulador = Simulador(paciente, ventilador)
        # t, v1, v2 = simulador.simular(num_ciclos=10)
        t, v1, v2 = simulador.simular(tiempo_total_deseado=15.0)
        resultados_mecanica = simulador.procesar_resultados(t, v1, v2)

        intercambio_gases = IntercambioGases(
            ventilador=ventilador, V_D=0.15, VCO2=200, R=0.8, FiO2=0.21, Pb=560
        )
        resultados_gases = intercambio_gases.calcular(resultados_mecanica)

        hemodinamica = InteraccionCorazonPulmon()
        # Extraer el auto_peep calculado por el módulo mecánico
        auto_peep_calculado = resultados_mecanica.get("auto_peep", 0.0)

        resultados_hemo = hemodinamica.calcular(
            resultados_mecanica,
            resultados_gases,
            ventilador,
            auto_peep_cmH2O=auto_peep_calculado,
        )

        respuesta_final = {
            "series_tiempo": {
                "tiempo": resultados_mecanica["t"].tolist(),
                "presion_via_aerea": resultados_mecanica["P_aw"].tolist(),
                "flujo_total": resultados_mecanica["flow"].tolist(),
                "volumen_total": resultados_mecanica["Vt"].tolist(),
            },
            "metricas_mecanicas": {
                "volumen_tidal_entregado": (
                    np.max(resultados_mecanica["Vt"][-200:])
                    - np.min(resultados_mecanica["Vt"][-200:])
                ),
                "presion_pico": np.max(resultados_mecanica["P_aw"]),
            },
            "metricas_gases": resultados_gases,
            "metricas_hemodinamicas": resultados_hemo,
        }
        logger.info("Simulación completada exitosamente.")
        return respuesta_final

    except ValueError as ve:
        logger.error(f"Error de validación: {ve}", exc_info=True)
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Error inesperado: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Error interno del servidor.")
