# Librerías
import numpy as np

class ControlRespiratorio:
    """
    Modelo de control respiratorio Proporcional-Integral (PI).

    Ajusta la amplitud y frecuencia de la presión muscular (P_mus)
    en función del error entre la PaCO2 actual (aproximada como PACO2)
    y un valor de referencia (PACO2_target).

    Ecuaciones:
        A = Gp * (PACO2 - PACO2_target)
        f = f_base + Gf * (PACO2 - PACO2_target)

    Métodos
    -------
    actualizar(PACO2)
        Calcula amplitud y frecuencia actuales del P_mus.
    generar_Pmus(t)
        Genera la señal P_mus(t) = A * sin(2π f t).
    """
    def __init__(self,
                 PACO2_target: float = 40.0,
                 f_base: float = 12.0,
                 Gp: float = 0.3,
                 Gf: float = 0.1,
                 Gi: float = 0.05):
        # Valor de referencia de PaCO2 (mmHg)
        self.PACO2_target = PACO2_target
        # Frecuencia respiratoria basal (ciclos/min)
        self.f_base = f_base
        # Ganancia para amplitud de P_mus (cmH2O por mmHg)
        self.Gp = Gp
        # Ganancia para frecuencia respiratoria (Hz por mmHg)
        # Convertir Gf de (ciclos/min)/mmHg a Hz/mmHg: Gf/60
        self.Gf = Gf / 60.0
        self.Gi = Gi  # Ganancia Integral
        self.integral_error = 0.0 # Acumulador del error
        # Variables de estado
        self.amplitud = None
        self.frecuencia = None

    def actualizar(self, PACO2: float, dt: float):
        """
        Actualiza la amplitud y frecuencia de P_mus en base a la PACO2.
        """
        error = PACO2 - self.PACO2_target
        # Actualizar el término integral
        self.integral_error += error * dt
        # Limitar el término integral para evitar "wind-up"
        self.integral_error = min(max(self.integral_error, -50.0), 50.0)

        # Salida del controlador = Término P + Término I
        amplitud_calculada = (self.Gp * error) + (self.Gi * self.integral_error)
        self.amplitud = min(max(0.0, amplitud_calculada), 25.0)

        self.frecuencia = max(0.1, self.f_base/60.0 + self.Gf * error)
        return self.amplitud, self.frecuencia

    def generar_Pmus(self, t: np.ndarray) -> np.ndarray:
        """
        Genera la señal de presión muscular.
        P_mus(t) = A * sin(2π f t)
        La presión es solo negativa (inspiración) y cero durante la espiración
        pasiva.

        Parámetros
        ----------
        t : np.ndarray Vector de tiempos en segundos.

        Retorna
        -------
        np.ndarray Señal P_mus en cmH2O.
        """
        if self.amplitud is None or self.frecuencia is None:
            raise RuntimeError("Primero debe llamar a actualizar(PACO2)")
        omega = 2 * np.pi * self.frecuencia

        return -self.amplitud * np.maximum(0, np.sin(omega * t))