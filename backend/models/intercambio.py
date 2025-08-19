# Librerías
import numpy as np
from .ventilador import Ventilador
from .hemodinamica import InteraccionCorazonPulmon

class IntercambioGases:
    """
    Módulo de intercambio gaseoso alveolar.
    Calcula presiones de CO2 y O2 alveolares a partir de los resultados
    de la simulación de mecánica respiratoria.
    """
    def __init__(
        self,
        ventilador: Ventilador,
        hemodinamica: InteraccionCorazonPulmon,
        V_D: float,
        VCO2: float,
        R: float,
        FiO2: float,
        Pb: float,
        Qs_Qt: float = 0.05, # Shunt fisiológico del 5%
        PH2O: float = 47.0,
        K: float = 0.863,
    ):
        self.ventilador = ventilador
        self.hemodinamica = hemodinamica
        self.V_D = V_D      # volumen muerto anatómico (L)
        self.VCO2 = VCO2    # producción de CO2 (mL/min)
        self.R = R          # cociente respiratorio (adimensional)
        self.FiO2 = FiO2    # fracción inspirada de O2 (0-1)
        self.Pb = Pb        # presión barométrica (mmHg)
        self.Qs_Qt = Qs_Qt  # Fracción de shunt (0-1)
        self.PH2O = PH2O    # presión vapor de agua a 37°C (mmHg)
        self.K = K          # constante de conversión de unidades

    def calcular(self, resultados: dict) -> dict:
        """
        Ejecuta el cálculo de intercambio gaseoso.

        Parámetros
        ----------
        resultados : dict
            Diccionario de salida de Simulador.procesar_resultados(),
            con claves 't' (tiempo) y 'Vt' (volumen total alveolar, L).

        Devuelve
        -------
        dict con:
            VE_min: ventilación minuto total (L/min)
            VA_min: ventilación minuto alveolar (L/min)
            PACO2_mmHg: presión alveolar de CO2 (mmHg)
            PAO2_mmHg: presión alveolar de O2 (mmHg)
            PaO2_mmHg: presión arterial de O2 (mmHg)
        """
        t = resultados['t']
        # 1. Frecuencia respiratoria (ciclos/min)
        f = self.ventilador.fr

        # 2. Volumen tidal (L)
        if self.ventilador.modo == 'VCV':
            VT = self.ventilador.Vt
        else:
            flujo = resultados['flow']
            flujo_inspiratorio = np.maximum(0, flujo)
            volumen_inspirado_total = np.trapezoid(flujo_inspiratorio, t)
            duracion_chunk = t[-1] - t[0] if len(t) > 1 else 0
            num_respiraciones = duracion_chunk * (f / 60.0)
            VT = volumen_inspirado_total / num_respiraciones if num_respiraciones > 0 else 0

        # 3. Ventilaciones minuto
        VE = VT * f
        VA = (VT - self.V_D) * f

        if VA <= 0:
            # En lugar de lanzar un error, asignamos valores de fallo fisiológico
            return {
                'VE_min': VE,
                'VA_min': VA,
                'PACO2_mmHg': 100.0, # Hipercapnia severa
                'PAO2_mmHg': 40.0,   # Hipoxemia severa
                'PaO2_mmHg': 35.0
            }

        # 4. Presión alveolar de CO2 (mmHg)
        PACO2 = (self.VCO2 * self.K) / VA

        # 5. Presión alveolar de O2 (Ecuación del Gas Alveolar)
        PIO2 = self.FiO2 * (self.Pb - self.PH2O)
        PAO2 = PIO2 - (PACO2 / self.R)
        
        # 6. Presión arterial de O2 (Ecuación del Shunt)
        # Se requiere el contenido de O2 en sangre capilar (CcO2), arterial (CaO2) y venosa mixta (CvO2)
        
        # Contenido de O2 en sangre capilar final (asumiendo equilibrio con PAO2)
        sao2_capilar = self.hemodinamica._estimar_sao2(PAO2)
        CcO2 = (self.hemodinamica.hb_g_dl * sao2_capilar * self.hemodinamica.O2_CAP_HB) + (PAO2 * self.hemodinamica.O2_SOL_PLASMA)
        
        # Contenido de O2 en sangre venosa mixta (estimación)
        # Asumimos una extracción de O2 de 5 mL/dL (diferencia arterio-venosa normal)
        # Esto es una simplificación; en un modelo completo, CvO2 dependería del consumo de O2 (VO2) y del gasto cardíaco (GC).
        CvO2_estimado = (
            (self.hemodinamica.hb_g_dl * 0.75 * self.hemodinamica.O2_CAP_HB) + 
            (40 * self.hemodinamica.O2_SOL_PLASMA)
        ) # SaO2 venosa ~75%, PvO2 ~40 mmHg
        
        # Ecuación del Shunt: CaO2 = [ (CcO2 * (1 - Qs/Qt)) + (CvO2 * Qs/Qt) ]
        CaO2 = (CcO2 * (1 - self.Qs_Qt)) + (CvO2_estimado * self.Qs_Qt)
        
        # Calcular PaO2 a partir de CaO2 (inverso de la ecuación de contenido)
        # Esta es una aproximación, ya que la relación no es lineal.
        # PaO2 ≈ (CaO2 - O2_disuelto) / (Hb * 1.34 * SaO2_estimada)
        # Para simplificar, usamos una búsqueda iterativa o una aproximación lineal.
        
        # Aproximación para encontrar PaO2 desde CaO2 (requiere _estimar_sao2)
        PaO2_estimada = 0
        for p_test in range(20, 150):
            sao2_test = self.hemodinamica._estimar_sao2(p_test)
            cao2_test = (self.hemodinamica.hb_g_dl * sao2_test * self.hemodinamica.O2_CAP_HB) + (p_test * self.hemodinamica.O2_SOL_PLASMA)
            if cao2_test >= CaO2:
                PaO2_estimada = p_test
                break
        PaO2_estimada = PaO2_estimada if PaO2_estimada > 0 else PAO2 * (1 - self.Qs_Qt)


        return {
            'VE_min': VE,
            'VA_min': VA,
            'PACO2_mmHg': PACO2,
            'PAO2_mmHg': PAO2,
            'PaO2_mmHg': PaO2_estimada,
        }
