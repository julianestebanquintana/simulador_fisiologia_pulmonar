"""
Servicio de simulación - Lógica de negocio separada de endpoints
"""
import logging
import numpy as np
from typing import Dict, Any, Tuple

# Clases de simulación
from models.paciente import Paciente
from models.ventilador import Ventilador
from models.simulador import Simulador
from models.intercambio import IntercambioGases
from models.hemodinamica import InteraccionCorazonPulmon
from models.control import ControlRespiratorio

logger = logging.getLogger(__name__)


class SimulationService:
    """Servicio para ejecutar simulaciones de fisiología pulmonar"""
    
    def __init__(self):
        """Inicializa el servicio de simulación"""
        self.logger = logging.getLogger(__name__)
    
    def run_simulation(self, paciente_params: Dict[str, Any], ventilador_params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Ejecuta una simulación cardiorrespiratoria integral.
        
        Args:
            paciente_params: Parámetros del paciente
            ventilador_params: Parámetros del ventilador
            
        Returns:
            Dict con los resultados de la simulación
        """
        try:
            self.logger.info(f"Iniciando simulación con parámetros: paciente={paciente_params}, ventilador={ventilador_params}")
            
            # Crear instancias de las clases de simulación
            paciente = Paciente(**paciente_params)
            ventilador = Ventilador(**ventilador_params)
            
            # Ejecutar simulación según el modo
            if ventilador.modo == "ESPONTANEO":
                control = ControlRespiratorio()
                simulador = Simulador(paciente, ventilador, control)
                t, v1, v2 = simulador.simular_espontaneo()
            else:
                simulador = Simulador(paciente, ventilador)
                t, v1, v2 = simulador.simular(tiempo_total_deseado=30.0)
            
            # Procesar resultados
            resultados_mecanica = simulador.procesar_resultados(t, v1, v2)
            resultados_gases = self._calculate_gas_exchange(ventilador, resultados_mecanica)
            resultados_hemo = self._calculate_hemodynamics(resultados_mecanica, resultados_gases, ventilador)
            
            # Preparar respuesta final
            respuesta_final = self._prepare_final_response(resultados_mecanica, resultados_gases, resultados_hemo)
            
            self.logger.info("Simulación completada exitosamente.")
            return respuesta_final
            
        except Exception as e:
            self.logger.error(f"Error en simulación: {str(e)}")
            raise
    
    def _calculate_gas_exchange(self, ventilador: Ventilador, resultados_mecanica: Dict[str, Any]) -> Dict[str, Any]:
        """Calcula el intercambio de gases"""
        intercambio_gases = IntercambioGases(
            ventilador=ventilador, 
            V_D=0.15, 
            VCO2=200, 
            R=0.8, 
            FiO2=0.21, 
            Pb=560
        )
        return intercambio_gases.calcular(resultados_mecanica)
    
    def _calculate_hemodynamics(self, resultados_mecanica: Dict[str, Any], 
                               resultados_gases: Dict[str, Any], 
                               ventilador: Ventilador) -> Dict[str, Any]:
        """Calcula la hemodinámica"""
        hemodinamica = InteraccionCorazonPulmon()
        auto_peep_calculado = resultados_mecanica.get("auto_peep", 0.0)
        
        return hemodinamica.calcular(
            resultados_mecanica,
            resultados_gases,
            ventilador,
            auto_peep_cmH2O=auto_peep_calculado,
        )
    
    def _prepare_final_response(self, resultados_mecanica: Dict[str, Any], 
                               resultados_gases: Dict[str, Any], 
                               resultados_hemo: Dict[str, Any]) -> Dict[str, Any]:
        """Prepara la respuesta final de la simulación"""
        return {
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
