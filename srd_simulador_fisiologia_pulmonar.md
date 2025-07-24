# Documento de Requisitos de Software (Software Requirements Document - SRD)

**Versión**: 0.1  
**Autor**: Equipo de Desarrollo del Simulador de Fisiología Pulmonar  
**Fecha**: 24 de julio de 2025

---

## 1. Propósito
Este documento define de manera clara y detallada los requisitos funcionales y no funcionales para la implementación de la primera iteración (prototipo MVP) del simulador de fisiología pulmonar. Sirve como guía para el equipo de desarrollo, estableciendo qué se va a construir, con qué tecnologías y bajo qué criterios de calidad.

## 2. Alcance
- **Prototipo 1 (MVP)**: Integrar las clases de Python ya desarrolladas para la simulación (Objetivo 2) con una interfaz gráfica web básica, desplegada en un VPS Linux. Debe ser funcional y presentable.
- **Prototipo 2**: A partir del MVP, añadir todas las características pedagógicas y de diseño definidas en el marco teórico (objetivo 3), enfocadas en la experiencia de aprendizaje.
- **Prototipo 3 (hipotético)**: Escalar la aplicación con persistencia en base de datos, gestión de usuarios, almacenamiento de escenarios y reportes.

## 3. Definiciones y Acrónimos
- **MVP**: Minimum Viable Product (Producto Mínimo Viable).
- **FR**: Requisito Funcional.
- **NFR**: Requisito No Funcional.
- **VPS**: Virtual Private Server.
- **CI/CD**: Integración Continua / Despliegue Continuo.

## 4. Actores y Stakeholders
- **Estudiantes**: Usuarios finales que usarán el simulador para practicar parámetros respiratorios.
- **Profesores/Mentores**: Podrán presentar escenarios y validar resultados.
- **Desarrollador**: Responsable de implementar y mantener el código.
- **Administradores del Sistema**: Gestionan el VPS y el despliegue.

## 5. Descripción General del Sistema
El simulador constará de:
1. **Backend**: API REST en Python que expone los métodos de simulación.
2. **Frontend**: Aplicación web interactiva con componentes gráficos para entrada de parámetros y visualización de resultados.
3. **Infraestructura**: Contenedores Docker, orquestados localmente con Docker Compose y desplegados en un VPS con Nginx como reverse proxy.

## 6. Requisitos Funcionales (MVP)
| ID   | Descripción                                                          |
|------|----------------------------------------------------------------------|
| FR1  | Ejecutar clases de simulación en Python que calculan presión y volumen. |
| FR2  | Exponer un endpoint REST (`/simulate`) que reciba parámetros y devuelva resultados en JSON. |
| FR3  | Mostrar una interfaz web donde el usuario ingrese parámetros (presión, frecuencia, etc.). |
| FR4  | Renderizar curvas y gráficos de resultados en 2D en el navegador.      |
| FR5  | Autenticación mínima de acceso (opcionalmente pública para MVP).       |
| FR6  | Desplegar la aplicación en un VPS Linux con dominio o DNS público.     |
| FR7  | Registrar logs de uso y errores para diagnóstico básico.               |

## 7. Requisitos No Funcionales
- **NFR1 (Rendimiento)**: El tiempo de respuesta de la API debe ser < 1 s para simulaciones estándar.
- **NFR2 (Seguridad)**: Conexión HTTPS obligatoria; uso de llaves SSH y firewall configurado.
- **NFR3 (Usabilidad)**: Interfaz responsive y accesible (WCAG AA).
- **NFR4 (Mantenibilidad)**: Código formateado y validado con linters; cobertura de pruebas ≥ 80%.
- **NFR5 (Portabilidad)**: Contenedores Docker que funcionen en cualquier Linux moderno.

## 8. Tecnologías y Herramientas
- **Control de versiones**: Git, GitHub.
- **Frontend**:
  - Node.js + npm  
  - React  
  - Bootstrap 5 (o Tailwind CSS)  
  - Vite  
  - ESLint + Prettier  
  - Jest + React Testing Library
- **Backend**:
  - Python 3.10+  
  - FastAPI  
  - Uvicorn  
  - Pydantic  
  - pytest  
  - black + flake8  
  - NumPy  
  - SciPy  
  - (Opcional) Matplotlib (para generación de gráficos en fase de prototipado)
- **Contenerización y despliegue**:
  - Docker, Docker Compose  
  - Nginx  
  - Certbot (Let's Encrypt)  
  - GitHub Actions (CI/CD)
- **(Opcional)** Redis + RQ/Celery para cache y colas de tareas.

## 9. Entorno de Despliegue (Prototipo 1)
1. **VPS Linux** con IP fija y DNS configurado.  
2. **Docker Engine** y **Docker Compose** instalados.  
3. **Nginx** como reverse proxy en el puerto 80/443.  
4. **Certbot** para certificados TLS.  
5. Despliegue mediante `docker-compose up -d` desde repositorio clonado.

## 10. Plan de Prototipos
- **Prototipo 1 (MVP)**:  
  - Integra backend y frontend básicos.  
  - Despliegue funcional en VPS.  
  - Validación de flujo end-to-end.

- **Prototipo 2 (Pedagógico)**:  
  - Añadir guías interactivas, validaciones de entradas y feedback pedagógico.  
  - Ajustar diseño UI según principios del marco teórico.

- **Prototipo 3 (Escalabilidad)**:  
  - Incorporar base de datos (PostgreSQL o MongoDB).  
  - Gestión de usuarios y roles.  
  - Guardado de escenarios y reportes históricos.

## 11. Supuestos y Dependencias
- Se dispone de clases Python de simulación completas y validadas (Objetivo 2).
- El equipo de desarrollo tiene experiencia básica en CLI, Docker y Linux.
- El VPS cuenta con conexión estable a Internet y acceso SSH.

## 12. Anexos
- Referencias al anteproyecto y al marco teórico.  
- Enlaces a repositorios y documentación de APIs (OpenAPI/Swagger).

---

*Fin del Documento SRD versión 0.1.**

