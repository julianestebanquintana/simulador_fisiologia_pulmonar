"""
Este paquete contiene las clases fundamentales para
la simulación de fisiología pulmonar.
"""

from .paciente import Paciente
from .ventilador import Ventilador
from .simulador import Simulador
from .intercambio import IntercambioGases
from .hemodinamica import InteraccionCorazonPulmon
from .control import ControlRespiratorio

# Opcional: define qué se importa con 'from models import *'
__all__ = [
    "Paciente",
    "Ventilador",
    "Simulador",
    "IntercambioGases",
    "InteraccionCorazonPulmon",
    "ControlRespiratorio",
]
