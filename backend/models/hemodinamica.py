# Librerías
import numpy as np
from .ventilador import Ventilador

class InteraccionCorazonPulmon:
    """
    Módulo de interacción hemodinámica corazón-pulmón.
    
    Modela el efecto de la presión en la vía aérea sobre el gasto cardíaco.
    """
    def __init__(
        self,
        GC_base_L_min: float = 5.0,
        k_sensibilidad: float = 0.1,
        hb_g_dl: float = 15.0
    ):
        """
        Inicializa el estado cardiovascular basal del paciente.

        Parámetros
        ----------
        GC_base_L_min : float
            Gasto cardíaco basal del paciente en L/min.
        k_sensibilidad : float
            Factor de sensibilidad hemodinámica a la presión intratorácica.
            Un valor bajo (~0.05-0.1) simula un paciente normovolémico.
            Un valor alto (>0.2) simula un paciente hipovolémico o con 
            disfunción cardíaca.
        hb_g_dl : float
            Concentración de hemoglobina en g/dL.
        """
        self.GC_base_L_min = GC_base_L_min
        self.k_sensibilidad = k_sensibilidad
        self.hb_g_dl = hb_g_dl
        # Constantes fisiológicas
        self.O2_CAP_HB = 1.34  # Capacidad de O2 por gramo de Hb (mL O2/g Hb)
        self.O2_SOL_PLASMA = 0.003  # Solubilidad de O2 en plasma (mL O2/dL/mmHg)

    def _estimar_sao2(self, pao2: float) -> float:
        """
        Estima la SaO2 a partir de la PaO2.
        NOTA: Simplificación educativa; no implementa la curva de disociación
        de la hemoglobina (Ecuación de Hill).
        """
        if pao2 >= 100:
            return 1.0
        elif pao2 >= 60:
            # Aproximación lineal груба entre 90% (a 60 mmHg) y 100% (a 100 mmHg)
            return 0.90 + 0.10 * ((pao2 - 60) / 40)
        else:
            # Aproximación para hipoxemia severa
            return 0.90 * (pao2 / 60)

    def calcular(
        self,
        resultados_mecanica: dict,
        resultados_gases: dict,
        ventilador: Ventilador,
        auto_peep_cmH2O: float
    ) -> dict:
        """
        Calcula el impacto hemodinámico de la ventilación mecánica.

        Parámetros
        ----------
        resultados_mecanica : dict
            El diccionario de salida de Simulador.procesar_resultados().
        resultados_gases : dict
            El diccionario de salida de IntercambioGases.calcular().
        ventilador : Ventilador
            La instancia del ventilador para obtener el PEEP.

        Devuelve
        -------
        dict con los resultados cardiovasculares:
            P_mean_cmH2O: Presión media en la vía aérea calculada.
            GC_actual_L_min: Gasto cardíaco resultante.
            PaO2_mmHg: Presión arterial de O2 estimada.
            SaO2_percent: Saturación arterial de O2 estimada.
            CAO2_ml_dl: Contenido arterial de O2.
            DO2_ml_min: Entrega de oxígeno a los tejidos.
        """
        t = resultados_mecanica['t']
        P_aw = resultados_mecanica['P_aw']
        PAO2_mmHg = resultados_gases['PAO2_mmHg']

        # 1. Calcular Presión Media en la Vía Aérea (P_mean)
        # Se integra el área bajo la curva de presión y se divide por la duración
        tiempo_total_ciclo = t[-1] - t[-2-1] if len(t)>1 else t[-1]
        p_aw_ultimo_ciclo = P_aw[t >= t[-1] - tiempo_total_ciclo]
        t_ultimo_ciclo = t[t >= t[-1] - tiempo_total_ciclo]
        area_bajo_curva = np.trapezoid(p_aw_ultimo_ciclo, t_ultimo_ciclo)
        P_mean = area_bajo_curva / (t_ultimo_ciclo[-1] - t_ultimo_ciclo[0])

        # 2. Calcular Gasto Cardíaco Actual
        # GC_actual = GC_base - k * (P_mean - PEEP_base)
        # PEEP_base = ventilador.PEEP
        # delta_p = P_mean - PEEP_base
        # reduccion_gc = self.k_sensibilidad * delta_p
        # GC_actual = self.GC_base_L_min - reduccion_gc
        # Asegurar que el GC no sea negativo
        # GC_actual = max(0, GC_actual)
        PEEP_aplicado = ventilador.PEEP
        
        # La presión efectiva que reduce el retorno venoso es la P_mean, pero al
        # final de la espiración, es el PEEP total (aplicado + intrínseco).
        # PEEP total para un cálculo más representativo del estrés diastólico.
        PEEP_total = PEEP_aplicado + auto_peep_cmH2O
        
        # La reducción del GC depende del gradiente de presión por encima del
        # PEEP base. Se asume que el Auto-PEEP tiene un efecto aditivo sobre 
        # P_mean.
        delta_p = (P_mean - PEEP_aplicado) + auto_peep_cmH2O
        
        reduccion_gc = self.k_sensibilidad * delta_p
        GC_actual = self.GC_base_L_min - reduccion_gc
        GC_actual = max(0, GC_actual)

        # 3. Calcular Contenido Arterial de O2 (CAO2)
        # Se asume un gradiente Alveolo-arterial de O2 de 10 mmHg (simplificación)
        PaO2 = PAO2_mmHg - 10
        SaO2 = self._estimar_sao2(PaO2)

        # CAO2 = (Hb * SaO2 * 1.34) + (PaO2 * 0.003)
        O2_unido_hb = self.hb_g_dl * SaO2 * self.O2_CAP_HB
        O2_disuelto = PaO2 * self.O2_SOL_PLASMA
        CAO2_ml_dl = O2_unido_hb + O2_disuelto

        # 4. Entrega de Oxígeno (DO2)
        # DO2 (mL/min) = GC (L/min) * CAO2 (mL/dL) * 10 (dL/L)
        DO2_ml_min = GC_actual * CAO2_ml_dl * 10

        return {
            'P_mean_cmH2O': P_mean,
            'auto_peep_cmH2O': auto_peep_cmH2O,
            'PEEP_total_cmH2O': PEEP_total,
            'GC_actual_L_min': GC_actual,
            'PaO2_mmHg': PaO2,
            'SaO2_percent': SaO2 * 100,
            'CAO2_ml_dl': CAO2_ml_dl,
            'DO2_ml_min': DO2_ml_min
        }