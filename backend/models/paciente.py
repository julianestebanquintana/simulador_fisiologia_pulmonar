class Paciente:
    """Clase que define un paciente con parámetros normales;
    para agregar pacientes con patologías, crear una subclase con modificaciones
    en los parámetros específicos que haga falta"""
    def __init__(self, R1=5, C1=0.05, R2=10, C2=0.05):
        self.R1 = R1
        self.C1 = C1
        self.R2 = R2
        self.C2 = C2
        self.E1 = 1 / self.C1
        self.E2 = 1 / self.C2