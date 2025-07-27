# backend/app/main.py

import logging
from fastapi import FastAPI, Request
from app.endpoints import simulation

# --- Configuración del Logging ---
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(message)s",
)
logger = logging.getLogger(__name__)

# --- Aplicación FastAPI ---
app = FastAPI(
    title="Simulador de Fisiología Pulmonar API",
    description="API para ejecutar simulaciones de fisiología pulmonar.",
    version="0.1.0",
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Middleware para loggear cada petición recibida."""
    logger.info(f"Petición: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Respuesta: {response.status_code}")
    return response


# --- Incluir Routers ---
app.include_router(simulation.router)
