"""
Clase base para autenticación - Preparada para futura integración LTI 1.3
"""

from abc import ABC, abstractmethod
from typing import Optional, Dict, Any


class BaseAuthenticator(ABC):
    """Clase base para autenticación que será extendida para LTI 1.3"""

    @abstractmethod
    def authenticate(self, credentials: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Autentica al usuario y retorna información del usuario"""
        pass

    @abstractmethod
    def validate_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Valida un token de autenticación"""
        pass

    @abstractmethod
    def get_user_info(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Obtiene información del usuario"""
        pass


class MockAuthenticator(BaseAuthenticator):
    """Autenticador mock para desarrollo - será reemplazado por LTI 1.3"""

    def authenticate(self, credentials: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Mock de autenticación - siempre retorna usuario de prueba"""
        return {
            "user_id": "test_user",
            "name": "Usuario de Prueba",
            "role": "student",
            "email": "test@example.com",
        }

    def validate_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Mock de validación de token"""
        if token == "test_token":
            return {
                "user_id": "test_user",
                "name": "Usuario de Prueba",
                "role": "student",
            }
        return None

    def get_user_info(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Mock de información de usuario"""
        return {
            "user_id": user_id,
            "name": "Usuario de Prueba",
            "role": "student",
            "email": "test@example.com",
        }
