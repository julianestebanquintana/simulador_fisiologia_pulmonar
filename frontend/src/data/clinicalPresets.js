// Presets clínicos para diferentes escenarios de ventilación mecánica

export const clinicalPresets = {
  pacienteNormal: {
    name: "Paciente Normal",
    description: "Paciente adulto con función pulmonar normal",
    patient: {
      R1: 3.0,  // Resistencia normal de vías aéreas centrales
      C1: 0.08, // Compliance normal de alvéolos centrales
      R2: 3.0,  // Resistencia normal de vías aéreas periféricas
      C2: 0.08  // Compliance normal de alvéolos periféricos
    },
    ventilator: {
      modo: "PCV",
      PEEP: 5.0,
      P_driving: 15.0,
      fr: 12,
      Ti: 1.0,
      Vt: 0.5,
      FiO2: 0.21
    },
    fisiologia: {
      k_sensibilidad: 0.1,
      Gp_control: 0.3,
      Gi_control: 0.01,
      Qs_Qt: 0.05, // Shunt fisiológico del 5%
      V_D: 0.15    // Espacio muerto normal (aprox 2 mL/kg)
    }
  },

  epoc: {
    name: "EPOC",
    description: "Enfermedad Pulmonar Obstructiva Crónica",
    patient: {
      R1: 8.0,  // Resistencia aumentada por obstrucción
      C1: 0.12, // Compliance aumentada por hiperinflación
      R2: 12.0, // Resistencia periférica muy aumentada
      C2: 0.15  // Compliance periférica aumentada
    },
    ventilator: {
      modo: "PCV",
      PEEP: 8.0,  // PEEP aumentado para evitar colapso
      P_driving: 20.0,
      fr: 10,     // Frecuencia más baja para evitar hiperinflación
      Ti: 1.2,
      Vt: 0.6,
      FiO2: 0.30
    },
    fisiologia: {
      k_sensibilidad: 0.1,  // Sensibilidad hemodinámica normal-baja
      Gp_control: 0.15, // Ganancia baja (retención crónica de CO2)
      Gi_control: 0.005,
      Qs_Qt: 0.10, // Shunt moderado por V/Q mismatch
      V_D: 0.25    // Espacio muerto aumentado
    }
  },

  sdra: {
    name: "SDRA",
    description: "Síndrome de Dificultad Respiratoria Aguda",
    patient: {
      R1: 5.0,  // Resistencia moderadamente aumentada
      C1: 0.03, // Compliance muy disminuida
      R2: 8.0,  // Resistencia periférica aumentada
      C2: 0.02  // Compliance periférica muy disminuida
    },
    ventilator: {
      modo: "PCV",
      PEEP: 12.0, // PEEP alto para reclutar alvéolos
      P_driving: 25.0,
      fr: 16,     // Frecuencia aumentada
      Ti: 0.8,
      Vt: 0.4,    // Volumen tidal bajo (estrategia protectora)
      FiO2: 0.60
    },
    fisiologia: {
      k_sensibilidad: 0.25, // Hipovolemia/shock, alta sensibilidad
      Gp_control: 0.4,  // Drive respiratorio aumentado por hipoxemia
      Gi_control: 0.02,
      Qs_Qt: 0.35, // Shunt severo del 35%
      V_D: 0.20    // Espacio muerto aumentado
    }
  },

  neumonia: {
    name: "Neumonía",
    description: "Neumonía bacteriana o viral",
    patient: {
      R1: 6.0,  // Resistencia aumentada por inflamación
      C1: 0.05, // Compliance disminuida
      R2: 10.0, // Resistencia periférica aumentada
      C2: 0.04  // Compliance periférica disminuida
    },
    ventilator: {
      modo: "PCV",
      PEEP: 8.0,
      P_driving: 18.0,
      fr: 14,
      Ti: 1.0,
      Vt: 0.5,
      FiO2: 0.40
    },
    fisiologia: {
      k_sensibilidad: 0.18, // Sensibilidad aumentada (riesgo de sepsis)
      Gp_control: 0.35,
      Gi_control: 0.015,
      Qs_Qt: 0.20, // Shunt del 20% por consolidación
      V_D: 0.18
    }
  },

  asma: {
    name: "Asma Aguda",
    description: "Crisis asmática aguda",
    patient: {
      R1: 15.0, // Resistencia muy aumentada por broncoespasmo
      C1: 0.15, // Compliance aumentada por hiperinflación
      R2: 20.0, // Resistencia periférica muy aumentada
      C2: 0.18  // Compliance periférica aumentada
    },
    ventilator: {
      modo: "PCV",
      PEEP: 3.0,  // PEEP bajo para evitar hiperinflación
      P_driving: 25.0,
      fr: 8,      // Frecuencia muy baja
      Ti: 1.5,
      Vt: 0.7,
      FiO2: 0.50
    },
    fisiologia: {
      k_sensibilidad: 0.12,
      Gp_control: 0.20, // Drive moderado, pero la mecánica es el problema
      Gi_control: 0.008,
      Qs_Qt: 0.15, // V/Q mismatch
      V_D: 0.22
    }
  },

  ventilacionProtectora: {
    name: "Ventilación Protectora",
    description: "Estrategia de ventilación protectora pulmonar",
    patient: {
      R1: 4.0,
      C1: 0.06,
      R2: 6.0,
      C2: 0.05
    },
    ventilator: {
      modo: "PCV",
      PEEP: 10.0,
      P_driving: 20.0,
      fr: 20,     // Frecuencia alta
      Ti: 0.6,    // Tiempo inspiratorio corto
      Vt: 0.3,    // Volumen tidal muy bajo
      FiO2: 0.50
    },
    fisiologia: {
      k_sensibilidad: 0.20, // Paciente crítico
      Gp_control: 0.4,
      Gi_control: 0.02,
      Qs_Qt: 0.25, // Shunt significativo
      V_D: 0.19
    }
  }
};

// Función para obtener un preset por nombre
export const getPreset = (presetName) => {
  return clinicalPresets[presetName] || clinicalPresets.pacienteNormal;
};

// Función para obtener todos los presets como array
export const getAllPresets = () => {
  return Object.entries(clinicalPresets).map(([key, preset]) => ({
    key,
    ...preset
  }));
};
