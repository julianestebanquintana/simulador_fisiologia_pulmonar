# Librerías
import numpy as np
from scipy.integrate import solve_ivp
import math
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

    def _modelo_edo(self, t, y, P_aw_func, R1, E1, R2, E2):
        V1, V2 = y

        if self.ventilador.modo == 'ESP':
            # En modo espontáneo, la presión la genera el módulo de control
            P_aw = self.control.generar_Pmus(t)
        elif self.ventilador.modo == 'VCV':
            # Lógica para VCV
            en_insp = (t % self.ventilador.T_total) < self.ventilador.Ti
            flow_total = np.where(en_insp, self.ventilador.flow_insp, 0.0)
            P_aw_insp = (flow_total + (self.paciente.E1 * V1 / self.paciente.R1) 
                + (self.paciente.E2 * V2 / self.paciente.R2)) / ((1.0 / self.paciente.R1) 
                + (1.0 / self.paciente.R2))
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
        tiempo_total_deseado: float = 15.0, 
        pasos_por_ciclo: int = 200
        )-> tuple[np.ndarray, np.ndarray, np.ndarray]:
        """ Ejecuta la simulación para múltiples ciclos respiratorios hasta alcanzar
        una duración total deseada. Devuelve t, V1 y V2 concatenados."""
        
        # 1. CALCULAR DINÁMICAMENTE EL NÚMERO DE CICLOS 
        tiempo_por_ciclo = 60.0 / self.ventilador.fr
        if tiempo_por_ciclo <= 0:
            raise ValueError("La frecuencia respiratoria debe ser mayor que cero.")
        # Añadimos 2 ciclos de margen
        num_ciclos = math.ceil(tiempo_total_deseado / tiempo_por_ciclo) + 2

        # 2. Ciclo FOR para calcular múltiples ciclos respiratorios
        t_data, V1_data, V2_data = [], [], []
        V0 = [0.0, 0.0]
        P_aw_func = self.ventilador.presion # Se obtiene la función de presión para PCV
        
        for i in range(num_ciclos):
            t0 = i * tiempo_por_ciclo
            t1 = (i + 1) * tiempo_por_ciclo

            # Corrección para evitar puntos de tiempo duplicados
            endpoint = (i == num_ciclos - 1)
            t_eval = np.linspace(t0, t1, pasos_por_ciclo, endpoint=endpoint)

            sol = solve_ivp(
                fun=self._modelo_edo,
                t_span=[t0, t1],
                y0=V0,
                method='RK45',
                t_eval=t_eval,
                args=(P_aw_func, self.paciente.R1, self.paciente.E1, 
                      self.paciente.R2, self.paciente.E2)
            )
            
            t_data.append(sol.t)
            V1_data.append(sol.y[0])
            V2_data.append(sol.y[1])
            
            # Propagar el estado final como condición inicial del siguiente ciclo
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

        # Calcular el Auto-PEEP a partir del volumen atrapado.
        volumen_atrapado_c1 = V1[-1]
        volumen_atrapado_c2 = V2[-1]
        
        # La presión alveolar en cada compartimento al final de la espiración
        P_alv_final_c1 = self.paciente.E1 * volumen_atrapado_c1
        P_alv_final_c2 = self.paciente.E2 * volumen_atrapado_c2
        
        # El Auto-PEEP medido en la vía aérea: es una
        # media ponderada por la conductancia (1/R)
        conductancia_total = (1 / self.paciente.R1) + (1 / self.paciente.R2)
        auto_peep_calculado = (P_alv_final_c1 / self.paciente.R1 
            + P_alv_final_c2 / self.paciente.R2) / conductancia_total
        
        return {
            't': t,
            'V1': V1,
            'V2': V2,
            'Vt': Vt,
            'flow1': flujo1,
            'flow2': flujo2,
            'flow': flujo_total,
            'P_aw': P_aw,
            'auto_peep': auto_peep_calculado
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