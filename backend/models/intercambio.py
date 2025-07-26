# Librerías
import numpy as np
from scipy.integrate import solve_ivp
import matplotlib.pyplot as plt

# Estilo
plt.style.use('seaborn-v0_8-whitegrid')

class IntercambioGases:
    """
    Módulo de intercambio gaseoso alveolar.
    Calcula presiones de CO2 y O2 alveolares a partir de los resultados
    de la simulación de mecánica respiratoria.
    """
    def __init__(
        self,
        ventilador,
        V_D: float,
        VCO2: float,
        R: float,
        FiO2: float,
        Pb: float,
        PH2O: float = 47.0,
        K: float = 0.863
    ):
        self.ventilador = ventilador
        self.V_D = V_D      # volumen muerto anatómico (L)
        self.VCO2 = VCO2    # producción de CO2 (mL/min)
        self.R = R          # cociente respiratorio (adimensional)
        self.FiO2 = FiO2    # fracción inspirada de O2 (0-1)
        self.Pb = Pb        # presión barométrica (mmHg)
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
        """
        t = resultados['t']
        # 1. Frecuencia respiratoria (ciclos/min)
        f = self.ventilador.fr

        # 2. Volumen tidal (L)
        if self.ventilador.modo == 'VCV':
            VT = self.ventilador.Vt
        else:
            # Para modos espontáneos o PCV, calculamos el VT promedio
            # integrando el flujo inspiratorio sobre el período de simulación.
            flujo = resultados['flow']

            # 1. Identificar el flujo inspiratorio
            flujo_inspiratorio = np.maximum(0, flujo)

            # 2. Integrar el flujo para obtener el volumen total inspirado en el chunk
            volumen_inspirado_total = np.trapezoid(flujo_inspiratorio, t)

            # 3. Calcular el número de respiraciones en el chunk
            duracion_chunk = t[-1] - t[0]
            num_respiraciones = duracion_chunk * (f / 60.0) # f está en rpm, t en seg

            # 4. Calcular el VT promedio (evitando división por cero)
            if num_respiraciones > 0:
                VT = volumen_inspirado_total / num_respiraciones
            else:
                VT = 0

            # --- INICIO DE BLOQUE DE DEPURACIÓN ---
            print(f"    [DEBUG] Vol. Inspirado Total: {volumen_inspirado_total:.3f} L")
            print(f"    [DEBUG] Num. Respiraciones: {num_respiraciones:.2f}")
            print(f"    [DEBUG] VT Promedio Calculado: {VT:.3f} L")
            # --- FIN DE BLOQUE DE DEPURACIÓN ---

        # 3. Ventilaciones minuto
        VE = VT * f
        VA = (VT - self.V_D) * f

        # --- DEPURACIÓN ADICIONAL ---
        print(f"    [DEBUG] Ventilación Alveolar (VA): {VA:.2f} L/min")
        # --- FIN DE DEPURACIÓN ---

        if VA <= 0:  #ocurre sólo si el VT es realmente muy bajo.
            raise ValueError("Ventilación alveolar ≤ 0, revisa V_D o simulación.")

        # 4. Presión alveolar de CO2 (mmHg)
        PACO2 = (self.VCO2 * self.K) / VA

        # 5. Presión alveolar de O2 (mmHg)
        PIO2 = self.FiO2 * (self.Pb - self.PH2O)
        PAO2 = PIO2 - (PACO2 / self.R)

        return {
            'VE_min': VE,
            'VA_min': VA,
            'PACO2_mmHg': PACO2,
            'PAO2_mmHg': PAO2
        }
