# Node.js Big File Exercise

## Descripción

Este proyecto es una solución al desafío técnico que consiste en procesar un archivo CSV de gran tamaño (~80MB, 100,000+ registros) y guardar su contenido en una base de datos MongoDB. El objetivo principal es lograrlo de una manera eficiente, escalable y robusta, asegurando un bajo consumo de memoria y un alto rendimiento.

---

## Instalación y Uso

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/alemontanez/node-mongo-big-file-exercise
    cd node-mongo-big-file-exercise
    ```
2.  **Instalar dependencias:**
    ```bash
    npm install
    ```
3.  **Configurar variables de entorno:**
    * Ajustar la variable `MONGODB_URL` para apuntar a tu base de datos y definir el `PORT`.
4.  **Iniciar el servidor en modo desarrollo:**
    ```bash
    npm run dev
    ```
5.  **Ejecutar linter (opcional):**
    Para verificar el formato del código (eslint-config-airbnb-base):
    ```bash
    npm run lint
    ```

---

## Endpoints de la API

### Subir Archivo
* **`POST /upload`**
* **Descripción:** Sube un archivo CSV para ser procesado e insertado en la base de datos.
* **Cuerpo (`form-data`):**
    * `KEY`: `file`
    * `VALUE`: (Seleccionar el archivo `.csv`)
* **Respuesta de Éxito (`200 OK`):**
    ```json
    {
      "message": "El archivo se procesó correctamente.",
      "readCount": "Indica la cantidad de registros leídos del archivo csv.",
      "insertedCount": "Indica la cantidad de registros insertados en la base de datos (se descartan repetidos).",
      "repeatedCount": "Indica la cantidad de registros repetidos y descartados del archivo csv."
    }
    ```
* **Respuesta de Error (`400 Bad Request` o `500 Internal Server Error`):**
    ```json
    {
      "message": "Descripción del error."
    }
    ```

### Obtener Registros
* **`GET /records`**
* **Descripción:** Devuelve los primeros 10 registros procesados, ordenados por fecha de creación descendente.

---

## Decisiones de Arquitectura y Diseño

Para cumplir con los requisitos de prolijidad, performance y escalabilidad, se tomaron las siguientes decisiones clave durante el desarrollo, yendo más allá de la sugerencia original de insertar código solo en el controlador que se podía encontrar en el archivo mencionado:

* **Refactorización de la Arquitectura:** Se reestructuró el proyecto siguiendo **una arquitectura por capas**. Dentro de esta, se implementó el patrón **controller-service** para separar la lógica de negocio de la manipulación de la petición/respuesta HTTP.
* **Arranque Robusto del Servidor:** Se corrigió la lógica de conexión a la base de datos original, que no era asíncrona. Se implementó un manejador `async/await` para asegurar que el servidor solo comience a aceptar peticiones después de que la conexión con MongoDB se haya establecido exitosamente.
* **Procesamiento Eficiente de Archivos CSV:** Se utiliza `fs.createReadStream` junto con `csv-parser` para leer el archivo CSV línea por línea sin cargarlo entero en memoria, garantizando un uso de RAM constante y bajo, ideal para archivos grandes.
* **Filtrado de Registros Duplicados:** Durante la lectura, se eliminan duplicados en tiempo real mediante un `Map` utilizando el campo `id` como clave, asegurando que solo se inserten registros únicos en la base de datos sin afectar la performance.
* **Calidad de Código:** Se configuró **ESLint** con las reglas de Airbnb para asegurar un estilo de código consistente, limpio y libre de errores comunes en todo el proyecto.
* **Manejo de Errores y Arranque Robusto:** Se implementó una lógica de arranque asíncrona para asegurar que el servidor solo comience a aceptar peticiones después de que la conexión con la base de datos se haya establecido exitosamente.
* **Mejora de Seguridad en Middlewares:** Se eliminó el límite de `100mb` en los middlewares `express.json` y `express.urlencoded`, previniendo un posible ataque de denegación de servicio por consumo de memoria y delegando el manejo de archivos grandes exclusivamente a `multer`.

---

## Seguridad de Dependencias

Al iniciar el proyecto, se detectaron 25 vulnerabilidades con `npm audit`. Se ejecutó el comando `npm audit fix`, que resolvió exitosamente 22 de ellas.

Permanecen 3 vulnerabilidades de severidad alta. Para mantener el foco en la resolución del desafío principal y evitar posibles conflictos o inestabilidad al modificar las dependencias manualmente, se decidió proceder con la versión actual de los paquetes, dejando constancia de las vulnerabilidades pendientes para una futura revisión.

---

## Propuestas de Mejoras a Futuro

Para no exceder el alcance de la consigna, se dejaron varias mejoras potenciales para una futura implementación. Si el proyecto continuara, los siguientes pasos serían:

* **Validación de Datos a Nivel de Esquema:** Implementar reglas de validación en el modelo de Mongoose (`required`, `unique`, `min`, etc.) para asegurar la integridad de los datos y rechazar filas del CSV que no cumplan con el formato esperado.
* **Paginación en el Endpoint GET:** Añadir parámetros de consulta (`?page=...&limit=...`) al endpoint `GET /records` para permitir al cliente navegar por todos los resultados de forma eficiente.
* **Testing Automatizado:** Aunque la consigna limitaba la instalación de librerías, el siguiente paso crítico sería añadir un framework de pruebas como **Jest**. Se crearían pruebas unitarias para el servicio (simulando la base de datos) y pruebas de integración para los endpoints de la API, garantizando la fiabilidad del código a largo plazo.
* **Documentación con Swagger:** Utilizar Swagger para documentar los endpoints de forma profesional.