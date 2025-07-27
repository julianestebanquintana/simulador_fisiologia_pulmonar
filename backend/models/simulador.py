# Librerías
import numpy as np
from scipy.integrate import solve_ivp
#import matplotlib.pyplot as plt

# Estilo
#plt.style.use('seaborn-v0_8-whitegrid')

from .paciente import Paciente
from .ventilador import Ventilador
from .control import ControlRespiratorio

class Simulador:
    """Orquesta la simulación paciente-ventilador."""
    def __init__(self,
                 paciente: Paciente,
                 ventilador: Ventilador,
                 control: 'ControlRespiratorio' = None):
        self.paciente = paciente
        self.ventilador = ventilador
        self.control = control
        if ventilador.modo == 'ESP':
            assert self.control is not None, "Se requiere un módulo de ControlRespiratorio para el modo 'ESP'"

    def _modelo_edo(self, t, y):
        V1, V2 = y

        if self.ventilador.modo == 'ESP':
            # En modo espontáneo, la presión la genera el módulo de control
            P_aw = self.control.generar_Pmus(t)
        elif self.ventilador.modo == 'VCV':
            # Lógica para VCV
            en_insp = (t % self.ventilador.T_total) < self.ventilador.Ti
            flow_total = np.where(en_insp, self.ventilador.flow_insp, 0.0)
            P_aw_insp = (flow_total + (self.paciente.E1 * V1 / self.paciente.R1) + (self.paciente.E2 * V2 / self.paciente.R2)) / ((1.0 / self.paciente.R1) + (1.0 / self.paciente.R2))
            P_aw = np.where(en_insp, P_aw_insp, self.ventilador.PEEP)
        elif self.ventilador.modo == 'PCV':
            # Lógica para PCV
            P_aw = self.ventilador.presion(t)
        else:
            raise ValueError(f"Modo desconocido: {self.ventilador.modo}")

        # Se calculan las derivadas dV/dt (sin cambios)
        dV1_dt = (P_aw - self.paciente.E1 * V1) / self.paciente.R1
        dV2_dt = (P_aw - self.paciente.E2 * V2) / self.paciente.R2

        return [dV1_dt, dV2_dt]

    def simular(self,
                num_ciclos: int=15,
                pasos_por_ciclo: int = 100):
        """Ejecuta múltiples ciclos y devuelve t, V1 y V2 concatenados."""
        t_data, V1_data, V2_data = [], [], []
        V0 = [0.0, 0.0]
        for i in range(num_ciclos):
            t0 = i * self.ventilador.T_total
            t1 = (i + 1) * self.ventilador.T_total
            if i < num_ciclos-1: #corrección para evitar discontinuidad en t=3.0
                t_eval = np.linspace(t0, t1, pasos_por_ciclo, endpoint=False)
            else:
                t_eval = np.linspace(t0, t1, pasos_por_ciclo, endpoint=True)
            sol = solve_ivp(self._modelo_edo,
                            [t0, t1],
                            V0,
                            t_eval=t_eval)
            t_data.append(sol.t)
            V1_data.append(sol.y[0])
            V2_data.append(sol.y[1])
            V0 = sol.y[:, -1]
        t = np.concatenate(t_data)
        V1 = np.concatenate(V1_data)
        V2 = np.concatenate(V2_data)
        return t, V1, V2

    def procesar_resultados(self,
                            t: np.ndarray,
                            V1: np.ndarray,
                            V2: np.ndarray) -> dict:
        """Calcula flujo, volumen total y presión resultante."""
        flujo1 = np.gradient(V1, t)
        flujo2 = np.gradient(V2, t)
        flujo_total = flujo1 + flujo2
        Vt = V1 + V2
        if self.ventilador.modo == 'PCV':
            P_aw = self.ventilador.presion(t)
        else:
            P_aw = ((flujo_total
                     + (self.paciente.E1 * V1 / self.paciente.R1)
                     + (self.paciente.E2 * V2 / self.paciente.R2))
                    / ((1 / self.paciente.R1) + (1 / self.paciente.R2)))
        return {
            't': t,
            'V1': V1,
            'V2': V2,
            'Vt': Vt,
            'flow1': flujo1,
            'flow2': flujo2,
            'flow': flujo_total,
            'P_aw': P_aw
        }

    # def graficar_resultados(self,
    #                         resultados: dict,
    #                         titulo: str = 'Simulación Pulmonar'):
    #     """Grafica presión, flujo total y volumen total a partir del diccionario
    #     de resultados."""
    #     t = resultados['t']
    #     P_aw = resultados['P_aw']
    #     flujo = resultados['flow']
    #     Vt = resultados['Vt']

    #     fig, axs = plt.subplots(3, 1, figsize=(15, 10), sharex=True)
    #     fig.suptitle(titulo, fontsize=16)

    #     # Presión
    #     axs[0].plot(t, P_aw, color='red', label='Presión (P_aw)')
    #     axs[0].set_ylabel('Presión (cmH2O)')
    #     axs[0].legend()

    #     # Flujo
    #     axs[1].plot(t, flujo, color='blue', label='Flujo Total')
    #     axs[1].set_ylabel('Flujo (L/s)')
    #     axs[1].axhline(0, color='grey', linewidth=0.8)
    #     axs[1].legend()

    #     # Volumen
    #     axs[2].plot(t, Vt, color='green', label='Volumen (L)')
    #     axs[2].set_ylabel('Volumen (L)')
    #     axs[2].set_xlabel('Tiempo (s)')
    #     axs[2].legend()

    #     plt.tight_layout(rect=[0, 0, 1, 0.96])
    #     plt.show()