# Imagen base
FROM python:3.11-slim

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de requerimientos si existen
COPY requirements.txt ./

# Instalar dependencias
RUN pip install --no-cache-dir --upgrade pip \
    && if [ -f requirements.txt ]; then pip install --no-cache-dir -r requirements.txt; fi

# Copiar el resto del código de la app
COPY . .

# Exponer el puerto de FastAPI
EXPOSE 8000

# Comando por defecto: iniciar Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
