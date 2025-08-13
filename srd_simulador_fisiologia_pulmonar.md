# Documento de Requisitos de Software (Software Requirements Document - SRD)

**Versión**: 1.0  
**Autor**: Julián Esteban Quintana Puerta
**Fecha**: 12 de agosto de 2025

---

## 1. Propósito
Este documento define de manera clara y detallada los requisitos funcionales y no funcionales para la implementación del simulador de fisiología pulmonar. Sirve como guía para el desarrollo, estableciendo qué se va a construir, con qué tecnologías y bajo qué criterios de calidad. El documento incluye las modificaciones identificadas en la evaluación de usabilidad y calidad educativa del prototipo inicial.

## 2. Alcance
- **Versión 1.0 (MVP)**: Integrar las clases de Python ya desarrolladas para la simulación con una interfaz gráfica web básica, desplegada en un VPS Linux. Debe ser funcional y presentable.
- **Versión 2.0**: Implementar mejoras de alto impacto pedagógico centradas en la interfaz de usuario y usabilidad, basadas en la evaluación del prototipo inicial.
- **Versión 3.0 (Futura)**: Transformar el simulador en una plataforma educativa completa con gestión de usuarios, analítica avanzada y modelos fisiológicos más complejos.

## 3. Definiciones y Acrónimos
- **MVP**: Minimum Viable Product (Producto Mínimo Viable).
- **FR**: Requisito Funcional.
- **NFR**: Requisito No Funcional.
- **VPS**: Virtual Private Server.
- **CI/CD**: Integración Continua / Despliegue Continuo.
- **CDN**: Content Delivery Network.
- **WCAG**: Web Content Accessibility Guidelines.

## 4. Actores y Stakeholders
- **Estudiantes**: Usuarios finales que usarán el simulador para practicar parámetros respiratorios.
- **Profesores/Mentores**: Podrán presentar escenarios y validar resultados.
- **Desarrollador**: Responsable de implementar y mantener el código.
- **Administradores del Sistema**: Gestionan el VPS y el despliegue.

## 5. Descripción General del Sistema
El simulador constará de:
1. **Backend**: API REST en Python que expone los métodos de simulación.
2. **Frontend**: Aplicación web interactiva con componentes gráficos para entrada de parámetros y visualización de resultados.
3. **Infraestructura**: Contenedores Docker, orquestados localmente con Docker Compose y desplegados en un VPS con Nginx como reverse proxy y CDN.

## 6. Requisitos Funcionales

### 6.1 Versión 1.0 (MVP) - Requisitos Base
| ID   | Descripción                                                          |
|------|----------------------------------------------------------------------|
| FR1  | Ejecutar clases de simulación en Python que calculan presión y volumen. |
| FR2  | Exponer un endpoint REST (`/simulate`) que reciba parámetros y devuelva resultados en JSON. |
| FR3  | Mostrar una interfaz web donde el usuario ingrese parámetros (presión, frecuencia, etc.). |
| FR4  | Renderizar curvas y gráficos de resultados en 2D en el navegador.      |
| FR5  | Autenticación mínima de acceso (opcionalmente pública para MVP).       |
| FR6  | Desplegar la aplicación en un VPS Linux con dominio o DNS público.     |
| FR7  | Registrar logs de uso y errores para diagnóstico básico.               |

### 6.2 Versión 2.0 - Mejoras Pedagógicas y de Usabilidad
| ID   | Descripción                                                          |
|------|----------------------------------------------------------------------|
| FR8  | Implementar vista simplificada inicial con solo 3-4 controles esenciales. |
| FR9  | Añadir modo "avanzado" para desbloquear parámetros técnicos completos. |
| FR10 | Integrar tooltips con definiciones claras para cada parámetro técnico. |
| FR11 | Establecer valores por defecto que representen escenarios clínicos realistas. |
| FR12 | Crear sistema de "misiones" guiadas con objetivos claros y medibles. |
| FR13 | Implementar retroalimentación inmediata mediante rúbricas simples. |
| FR14 | Añadir paneles de análisis automático con métricas derivadas importantes. |
| FR15 | Implementar "pausas" interactivas que inviten al usuario a predecir resultados. |
| FR16 | Mejorar la jerarquía visual de la interfaz para mayor intuitividad. |
| FR17 | Añadir indicadores de carga y retroalimentación del sistema. |
| FR18 | Implementar diseño responsive para dispositivos móviles. |
| FR19 | Asegurar cumplimiento de estándares básicos de accesibilidad (WCAG AA). |
| FR20 | Integrar CDN (Cloudflare) para mejorar rendimiento y seguridad. |
| FR21 | Preparar arquitectura del código para compatibilidad futura con estándar LTI 1.3. |

### 6.3 Versión 3.0 - Plataforma Educativa Completa
| ID   | Descripción                                                          |
|------|----------------------------------------------------------------------|
| FR23 | Sistema de autenticación diferenciado entre estudiantes e instructores. |
| FR24 | Experiencias adaptativas que ajusten complejidad según nivel del usuario. |
| FR25 | Plataforma de creación y gestión de escenarios clínicos por docentes. |
| FR26 | Sistema formal de evaluación de competencias con reportes descargables. |
| FR27 | Implementación de repetición espaciada con notificaciones automáticas. |
| FR28 | Recolección y análisis de datos de uso anónimos para mejora continua. |
| FR29 | Integración de currículo de fisiología pulmonar con videos y contenido multimedia. |
| FR30 | Ejercicios y exámenes cortos intercalados en el aprendizaje. |
| FR31 | Implementación de modelo mecánico no lineal con viscoelasticidad e inercia. |
| FR32 | Interacción con otros sistemas fisiológicos (cardiovascular, renal). |
| FR33 | Incorporación de nuevos modos ventilatorios modernos (auto-flujo, presión soporte, etc.). |

## 7. Requisitos No Funcionales

### 7.1 Versión 1.0 (MVP)
- **NFR1 (Rendimiento)**: El tiempo de respuesta de la API debe ser < 1 s para simulaciones estándar.
- **NFR2 (Seguridad)**: Conexión HTTPS obligatoria; uso de llaves SSH y firewall configurado.
- **NFR3 (Usabilidad)**: Interfaz responsive y accesible (WCAG AA).
- **NFR4 (Mantenibilidad)**: Código formateado y validado con linters; cobertura de pruebas ≥ 80%.
- **NFR5 (Portabilidad)**: Contenedores Docker que funcionen en cualquier Linux moderno.

### 7.2 Versión 2.0
- **NFR6 (Usabilidad Avanzada)**: Reducción de carga cognitiva para nuevos usuarios mediante andamiaje contextual.
- **NFR7 (Accesibilidad)**: Despliegue adecuado en dispositivos móviles.
- **NFR8 (Rendimiento Móvil)**: Tiempo de carga < 3s en dispositivos móviles con conexión 3G.
- **NFR9 (Seguridad CDN)**: Protección contra DDoS y tráfico malicioso mediante Cloudflare.
- **NFR10 (Retroalimentación)**: Respuesta visual inmediata (< 500ms) para todas las interacciones del usuario.
- **NFR11 (Arquitectura LTI)**: Estructura de código preparada para futura integración LTI 1.3 sin refactoring mayor.

### 7.3 Versión 3.0
- **NFR13 (Accesibilidad)**: Cumplimiento completo de estándares WCAG AA para dispositivos móviles y de escritorio.
- **NFR14 (Persistencia)**: Base de datos con tiempo de respuesta < 100ms para consultas de usuario.
- **NFR15 (Analítica)**: Procesamiento de datos de uso en tiempo real con latencia < 5s.
- **NFR16 (Seguridad Avanzada)**: Autenticación multi-factor y encriptación de datos sensibles.
- **NFR17 (Disponibilidad)**: 99.9% de uptime con recuperación automática ante fallos.

## 8. Tecnologías y Herramientas

### 8.1 Versión 1.0 (MVP)
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
- **Contenerización y despliegue**:
  - Docker, Docker Compose  
  - Nginx  
  - Certbot (Let's Encrypt)  
  - GitHub Actions (CI/CD)

### 8.2 Versión 2.0
- **Frontend Adicional**:
  - React Router para navegación entre modos
  - Framer Motion para animaciones suaves
  - React Hook Form para validación de formularios
  - Chart.js o D3.js para gráficos interactivos avanzados
- **Infraestructura Adicional**:
  - Cloudflare CDN
  - Service Workers para funcionalidad offline básica
- **Backend Adicional**:
  - Estructura modular preparada para futura integración LTI 1.3

### 8.3 Versión 3.0
- **Backend Adicional**:
  - PostgreSQL o MongoDB para persistencia
  - Redis para caché y sesiones
  - Celery para tareas asíncronas
  - JWT para autenticación
- **Frontend Adicional**:
  - Redux Toolkit para gestión de estado
  - React Query para gestión de datos del servidor
  - Video.js para reproducción de contenido multimedia
- **Infraestructura Adicional**:
  - Kubernetes para orquestación
  - Prometheus + Grafana para monitoreo
  - Elasticsearch para búsqueda y analítica

## 9. Entorno de Despliegue

### 9.1 Versión 1.0 (MVP)
1. **VPS Linux** con IP fija y DNS configurado.  
2. **Docker Engine** y **Docker Compose** instalados.  
3. **Nginx** como reverse proxy en el puerto 80/443.  
4. **Certbot** para certificados TLS.  
5. Despliegue mediante `docker-compose up -d` desde repositorio clonado.

### 9.2 Versión 2.0
1. **VPS Linux** con recursos incrementados (mínimo 2GB RAM, 2 vCPUs) para soportar CDN y optimizaciones.
2. **Cloudflare CDN** configurado para el dominio con reglas de caché optimizadas.
3. **Optimización de imágenes** y assets estáticos.
4. **Service Workers** para funcionalidad offline básica y caché de recursos críticos.
5. **Monitoreo básico** con logs estructurados y alertas de disponibilidad.

### 9.3 Versión 3.0
1. **Cluster Kubernetes** o múltiples VPS con balanceo de carga.
2. **Base de datos** PostgreSQL con replicación.
3. **Sistema de monitoreo** Prometheus + Grafana.
4. **CDN avanzado** con múltiples regiones.

## 10. Plan de Versiones

### 10.1 Versión 1.0 (MVP) - Completada
- [x] Integra backend y frontend básicos.  
- [x] Despliegue funcional en VPS.  
- [x] Validación de flujo end-to-end.

### 10.2 Versión 2.0 - En Desarrollo
**Objetivos principales:**
- [ ] Reducir carga cognitiva mediante andamiaje contextual
- [ ] Implementar sistema de misiones guiadas con retroalimentación
- [ ] Mejorar usabilidad y accesibilidad móvil
- [ ] Integrar CDN para mejor rendimiento y seguridad
- [ ] Preparar arquitectura para futura compatibilidad LTI 1.3

### 10.3 Versión 3.0 - Futura
**Objetivos principales:**
- Transformar en plataforma educativa completa
- Implementar gestión de usuarios y personalización
- Añadir modelos fisiológicos avanzados
- Integrar currículo completo de fisiología pulmonar


## 11. Supuestos y Dependencias
- Se dispone de clases Python de simulación completas y validadas (Objetivo 2).
- El desarrollador tiene experiencia básica en CLI, Docker y Linux.
- El VPS cuenta con conexión estable a Internet y acceso SSH.
- Para la versión 2.0: Se requiere dominio configurado para CDN.
- Para la versión 3.0: Se requiere infraestructura de base de datos y equipo de desarrollo ampliado.

## 12. Anexos
- Referencias al anteproyecto y al marco teórico.  
- Enlaces a repositorios y documentación de APIs (OpenAPI/Swagger).
- Documentación de evaluación de usabilidad y calidad educativa.
- Especificaciones técnicas de Cloudflare CDN.
- Documentación del estándar LTI 1.3 para referencia futura.

---

*Fin del Documento SRD versión 1.0*

