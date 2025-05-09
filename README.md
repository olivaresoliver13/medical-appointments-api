# 🏥 API RESTful de Gestión de Citas Médicas
Esta API permite gestionar citas médicas entre pacientes y doctores. Los pacientes pueden registrarse, solicitar citas y realizar pagos mediante Stripe; mientras que los médicos pueden confirmar o rechazar citas y visualizar su agenda diaria.

## 🚀 Tecnologías Utilizadas
- Node.js (v20)
- Fastify
- MySQL (v7)
- Docker
- Knex.js (migraciones de base de datos)
- JWT (autenticación)
- Stripe (procesamiento de pagos)
- Swagger (documentación interactiva)

## ⚙️ Requisitos Previos
- Tener instalado Node.js (versión 20)
- Tener instalado Docker Desktop

## 🔧 Configuración del Proyecto
- Clona este repositorio:

```bash
git clone git@github.com:olivaresoliver13/medical-appointments-api.git
cd medical-appointments-api
```

- Copia el archivo de ejemplo de entorno y configúralo:

```bash
cp .env.example .env
```
- Completa las variables: Configuración de Stripe.

    - Levanta el contenedor:

```bash
docker-compose up -d
```

🧱 Migraciones de Base de Datos
- Ejecutar migraciones:
```bash
npm run migrate:latest
```
- Revertir migraciones:
```bash
npm run migrate:rollback
```

- Ejecutar seed para información base(Opcional)
```bash
npm run seed:run
```

**Nota:** Los siguientes comandos se debe ejecutar en imagen de docker `medical-appointments-api-api-1`


## 📄 Documentación de la API
- Disponible en: `http://localhost:3000/docs`, una vez el servidor esté en ejecución.

## 🧪 Pruebas
```bash
npm run test
```
**Nota:** Los siguientes comandos se debe ejecutar en imagen de docker `medical-appointments-api-api-1`

## 🗂️ Estructura del Proyecto
El código fuente está organizado de la siguiente forma:
```bash
src/
│
├── config/
├── controllers/
├── database/
├── middlewares/
├── models/
└── plugins/
├── routes/
├── services/
├── tests/
├── utils/
├── app.js
```

## 🛠️ Consideraciones Adicionales
- **Manejo de Errores:** Utiliza clases personalizadas (utils) para errores consistentes.
- **Validación de Datos:** Implementa validaciones robustas usando Fastify Schemas o librerías como zod o yup.
- **Seguridad**: Protege tus endpoints con JWT y considera CSRF, sanitización de entradas, y rate limiting.
- **Webhooks Stripe:** Asegúrate de verificar la firma del webhook y actualizar correctamente el estado de la cita según el evento recibido.

## Consideraciones Adicionales

* **Manejo de Errores:** Se recomienda implementar un manejo de errores consistente utilizando clases de error personalizadas (`utils/`).
* **Validación de Datos:** Utilizar mecanismos de validación robustos (por ejemplo, con Fastify Hooks o librerías de validación) para asegurar la integridad de los datos en las solicitudes.
* **Seguridad:** Además de JWT, considera otras medidas de seguridad como la protección contra ataques CSRF y la validación de las entradas del usuario.
* **Webhooks de Stripe:** Implementar correctamente el webhook de Stripe para manejar los eventos de pago asíncronos y actualizar el estado de las citas en la base de datos.