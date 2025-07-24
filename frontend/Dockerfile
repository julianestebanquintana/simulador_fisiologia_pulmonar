# Usar una imagen oficial de Python como base
FROM python:3.11-slim

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Instalar las librerías científicas que necesitamos
RUN pip install numpy scipy matplotlib jupyter

# Exponer el puerto que Jupyter usará para que podamos acceder desde el navegador
EXPOSE 8888

# El comando que se ejecutará cuando inicie el contenedor
CMD ["jupyter", "notebook", "--ip=0.0.0.0", "--port=8888", "--no-browser", "--allow-root"]