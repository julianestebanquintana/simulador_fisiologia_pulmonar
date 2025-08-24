# Librerías
import numpy as np


class Ventilador:
    """Parámetros y perfiles de ventilación mecánica."""

    def __init__(
        self,
        modo: str = "PCV",
        PEEP: float = 5.0,
        P_driving: float = 15.0,
        fr: float = 20.0,
        Ti: float = 1.0,
        Vt: float = None,
        FiO2: float = 0.21,
    ):
        self.modo = modo
        self.PEEP = PEEP
        self.P_driving = P_driving
        self.fr = fr
        self.Ti = Ti
        self.T_total = 60.0 / fr
        self.Vt = Vt
        self.FiO2 = FiO2
        if modo == "VCV":
            assert Vt is not None, "Se requiere Vt para modo VCV"
            self.flow_insp = Vt / Ti
        else:
            self.flow_insp = None

    def presion(self, t: float) -> np.ndarray:
        """Perfil de presión en la vía aérea según el modo y el tiempo t."""
        t_arr = np.asarray(t)
        en_insp = (t_arr % self.T_total) < self.Ti
        if self.modo == "PCV":
            P_control = self.PEEP + self.P_driving
            return np.where(en_insp, P_control, self.PEEP)
        elif self.modo == "VCV":
            return np.full_like(t_arr, self.PEEP)
        else:
            raise ValueError(f"Modo desconocido: {self.modo}")

    def flujo(self, t: float) -> np.ndarray:
        """Perfil de flujo inspirado en VCV, 0 fuera de inspiración."""
        if self.modo != "VCV":
            return np.zeros_like(np.asarray(t))
        t_arr = np.asarray(t)
        return np.where((t_arr % self.T_total) < self.Ti, self.flow_insp, 0.0)
