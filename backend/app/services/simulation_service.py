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

    def run_simulation(
        self,
        paciente_params: Dict[str, Any],
        ventilador_params: Dict[str, Any],
        fisiologia_params: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Ejecuta una simulación cardiorrespiratoria integral.

        Args:
            paciente_params: Parámetros del paciente
            ventilador_params: Parámetros del ventilador
            fisiologia_params: Parámetros fisiológicos avanzados

        Returns:
            Dict con los resultados de la simulación
        """
        try:
            self.logger.info(
                f"Iniciando simulación con parámetros: paciente={paciente_params}, "
                f"ventilador={ventilador_params}, fisiologia={fisiologia_params}"
            )

            # Crear instancias de las clases de simulación
            paciente = Paciente(**paciente_params)
            ventilador = Ventilador(**ventilador_params)

            # Crear instancias de los modelos fisiológicos con parámetros dinámicos
            hemodinamica = InteraccionCorazonPulmon(
                k_sensibilidad=fisiologia_params["k_sensibilidad"]
            )

            intercambio_gases = IntercambioGases(
                ventilador=ventilador,
                hemodinamica=hemodinamica,
                V_D=fisiologia_params["V_D"],
                Qs_Qt=fisiologia_params["Qs_Qt"],
                FiO2=ventilador.FiO2,  # Usar el FiO2 del ventilador
                VCO2=200,  # Valor fijo por ahora
                R=0.8,  # Valor fijo por ahora
                Pb=560,  # Presión barométrica de Bogotá (mmHg)
            )

            # Ejecutar simulación según el modo
            if ventilador.modo == "ESPONTANEO":
                control = ControlRespiratorio(
                    Gp=fisiologia_params["Gp_control"],
                    Gi=fisiologia_params["Gi_control"],
                )
                simulador = Simulador(paciente, ventilador, control)
                t, v1, v2 = simulador.simular_espontaneo()
            elif ventilador.modo == "VCV":
                if ventilador.Vt is None:
                    raise ValueError(
                        "El volumen tidal (Vt) es requerido para el modo VCV"
                    )
                simulador = Simulador(paciente, ventilador)
                t, v1, v2 = simulador.simular(tiempo_total_deseado=30.0)
            elif ventilador.modo == "PCV":
                simulador = Simulador(paciente, ventilador)
                t, v1, v2 = simulador.simular(tiempo_total_deseado=30.0)
            else:
                raise ValueError(f"Modo ventilatorio no soportado: {ventilador.modo}")

            # Procesar resultados
            resultados_mecanica = simulador.procesar_resultados(t, v1, v2)

            # Calcular intercambio de gases y hemodinámica con las instancias ya creadas
            resultados_gases = intercambio_gases.calcular(resultados_mecanica)

            auto_peep_calculado = resultados_mecanica.get("auto_peep", 0.0)
            resultados_hemo = hemodinamica.calcular(
                resultados_mecanica,
                resultados_gases,
                ventilador,
                auto_peep_cmH2O=auto_peep_calculado,
            )

            # Preparar respuesta final
            respuesta_final = self._prepare_final_response(
                resultados_mecanica, resultados_gases, resultados_hemo
            )

            self.logger.info("Simulación completada exitosamente.")
            return respuesta_final

        except Exception as e:
            self.logger.error(f"Error en simulación: {str(e)}")
            raise

    def _prepare_final_response(
        self,
        resultados_mecanica: Dict[str, Any],
        resultados_gases: Dict[str, Any],
        resultados_hemo: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Prepara la respuesta final de la simulación"""

        volumen_tidal_entregado = 0
        presion_pico = 0

        # Siempre calculamos el volumen tidal a partir de los datos, si están disponibles
        if len(resultados_mecanica.get("Vt", [])) > 200:
            volumen_tidal_entregado = np.max(resultados_mecanica["Vt"][-200:]) - np.min(
                resultados_mecanica["Vt"][-200:]
            )

        # La presión pico solo aplica en modos controlados
        if resultados_mecanica.get("modo") == "ESPONTANEO":
            presion_pico = None  # Usamos None para indicar que no aplica
        else:
            if len(resultados_mecanica.get("P_aw", [])) > 0:
                presion_pico = np.max(resultados_mecanica["P_aw"])

        return {
            "series_tiempo": {
                "tiempo": resultados_mecanica.get("t", []).tolist(),
                "presion_via_aerea": resultados_mecanica.get("P_aw", []).tolist(),
                "flujo_total": resultados_mecanica.get("flow", []).tolist(),
                "volumen_total": resultados_mecanica.get("Vt", []).tolist(),
            },
            "metricas_mecanicas": {
                "volumen_tidal_entregado": volumen_tidal_entregado,
                "presion_pico": presion_pico,
            },
            "metricas_gases": resultados_gases,
            "metricas_hemodinamicas": resultados_hemo,
        }
