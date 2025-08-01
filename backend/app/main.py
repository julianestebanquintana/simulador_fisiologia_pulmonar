import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
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

# --- Orígenes permitidos ---
origins = [
    "http://localhost:3000",  # El origen de tu frontend en desarrollo
    # Podrías añadir aquí el dominio de producción en el futuro
]

# --- Middleware a la aplicación
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todas las cabeceras
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
