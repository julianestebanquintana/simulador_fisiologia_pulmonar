# backend/tests/test_simulation_api.py

from fastapi.testclient import TestClient
from app.main import app  # Aplicación FastAPI

# Cliente de prueba
client = TestClient(app)

def test_run_simulation_happy_path():
    """
    Prueba el endpoint /simulate con un conjunto de datos válidos (happy path).
    Verifica que la API responda con un código 200 y que la estructura
    de la respuesta sea la correcta.
    """
    # 1. Definir los datos de entrada para la petición
    payload = {
        "paciente": {
            "R1": 10.0,
            "C1": 0.05,
            "R2": 10.0,
            "C2": 0.05
        },
        "ventilador": {
            "modo": "PCV",
            "PEEP": 5.0,
            "P_driving": 15.0,
            "fr": 15.0,
            "Ti": 1.0,
            "Vt": 0.5
        }
    }

    # 2. Enviar la petición POST al endpoint /simulate
    response = client.post("/simulate", json=payload)

    # 3. Verificar las aserciones (assertions)
    # Asegurarse de que la petición fue exitosa (código 200)
    assert response.status_code == 200, f"Se esperaba 200 pero se obtuvo {response.status_code}"

    # Asegurarse de que la respuesta es un JSON válido
    response_data = response.json()
    assert isinstance(response_data, dict)

    # Asegurarse de que la estructura principal de la respuesta es correcta
    expected_top_keys = ["series_tiempo", "metricas_mecanicas", "metricas_gases", "metricas_hemodinamicas"]
    for key in expected_top_keys:
        assert key in response_data, f"La clave '{key}' falta en la respuesta"

    # Verificar sub-claves importantes
    assert "tiempo" in response_data["series_tiempo"]
    assert "volumen_tidal_entregado" in response_data["metricas_mecanicas"]
    assert "PACO2_mmHg" in response_data["metricas_gases"]
    assert "GC_actual_L_min" in response_data["metricas_hemodinamicas"]
    
    print("\nPrueba 'test_run_simulation_happy_path' superada con éxito.")