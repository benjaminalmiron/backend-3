# Backend 3 – Simulador de Consultas con Errores y Resiliencia

Backend desarrollado en **Node.js + Express** para simular múltiples consultas a una base de datos con manejo de errores, respuestas retrasadas y verificación de estabilidad del servidor.  
Incluye versión contenedorizada en Docker y subida a DockerHub.

Este es el repositorio del backend para la aplicación Adoptme.

## 🚀 Funcionalidades
- Simulación de consultas correctas y con error
- Manejo de excepciones y respuestas controladas
- Logs básicos de petición
- Endpoints para pruebas de carga o estrés
- Imagen funcional publicada en DockerHub

## 🛠 Tecnologías utilizadas
- Node.js  
- Express  
- Docker  
- DockerHub  
- JavaScript ES6  
- Control de versiones con Git/GitHub


## Imagen Docker

La imagen Docker de este proyecto está disponible en Docker Hub.

**Nombre de la Imagen:** `benjamin343535/backend-3`
**Link de Docker Hub:** [https://hub.docker.com/r/benjamin343535/backend-3](https://hub.docker.com/r/benjamin343535/backend-3)

### Cómo Usar la Imagen Docker


    ```bash
    docker pull benjamin343535/backend-3:latest
    ```

2.  **Ejecutar el contenedor:**
    ```bash
    docker run -p 4000:4000 --name adoptme-backend-container benjamin343535/backend-3:latest
    ```
    * `-p 4000:4000`: Mapea el puerto 4000 del contenedor al puerto 4000 de tu máquina local.
    * `--name adoptme-backend-container`: Asigna un nombre al contenedor para facilitar su gestión.


# Env

