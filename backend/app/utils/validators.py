"""
Utilidades de validación - Preparadas para futura integración LTI 1.3
"""

from typing import Dict, Any, Optional
import re


class ParameterValidator:
    """Validador de parámetros de simulación"""

    @staticmethod
    def validate_patient_params(params: Dict[str, Any]) -> Optional[str]:
        """
        Valida los parámetros del paciente

        Args:
            params: Diccionario con parámetros del paciente

        Returns:
            None si es válido, mensaje de error si no
        """
        required_fields = ["R1", "C1", "R2", "C2"]

        for field in required_fields:
            if field not in params:
                return f"Campo requerido faltante: {field}"

            value = params[field]
            if not isinstance(value, (int, float)):
                return f"Campo {field} debe ser numérico"

            if value <= 0:
                return f"Campo {field} debe ser mayor que 0"

        return None

    @staticmethod
    def validate_ventilator_params(params: Dict[str, Any]) -> Optional[str]:
        """
        Valida los parámetros del ventilador

        Args:
            params: Diccionario con parámetros del ventilador

        Returns:
            None si es válido, mensaje de error si no
        """
        required_fields = ["modo", "PEEP", "fr"]

        for field in required_fields:
            if field not in params:
                return f"Campo requerido faltante: {field}"

        # Validar modo
        valid_modes = ["PCV", "VCV", "ESPONTANEO"]
        if params["modo"] not in valid_modes:
            return f"Modo inválido. Debe ser uno de: {valid_modes}"

        # Validar valores numéricos
        numeric_fields = ["PEEP", "fr"]
        for field in numeric_fields:
            value = params[field]
            if not isinstance(value, (int, float)):
                return f"Campo {field} debe ser numérico"

            if value < 0:
                return f"Campo {field} debe ser mayor o igual a 0"

        return None


class UserValidator:
    """Validador de usuarios - Preparado para LTI 1.3"""

    @staticmethod
    def validate_user_info(user_info: Dict[str, Any]) -> Optional[str]:
        """
        Valida información del usuario

        Args:
            user_info: Diccionario con información del usuario

        Returns:
            None si es válido, mensaje de error si no
        """
        required_fields = ["user_id", "name", "role"]

        for field in required_fields:
            if field not in user_info:
                return f"Campo requerido faltante: {field}"

        # Validar role
        valid_roles = ["student", "instructor", "admin"]
        if user_info["role"] not in valid_roles:
            return f"Rol inválido. Debe ser uno de: {valid_roles}"

        # Validar user_id (debe ser alfanumérico)
        if not re.match(r"^[a-zA-Z0-9_-]+$", user_info["user_id"]):
            return "user_id debe contener solo letras, números, guiones y guiones bajos"

        return None
