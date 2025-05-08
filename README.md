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

##🔧 Configuración del Proyecto
Clona este repositorio:

```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
```

Copia el archivo de ejemplo de entorno y configúralo:

```bash
cp .env.example .env
```
Completa las variables: conexión a la base de datos, claves JWT y clave secreta de Stripe.

Levanta el contenedor:

```bash
docker-compose up -d
```

🧱 Migraciones de Base de Datos
Las migraciones se encuentran en el directorio migrations/. Comandos disponibles:

Ejecutar migraciones:
```bash
npm run migrate:latest
```

Revertir última migración:
```bash
npm run migrate:rollback
```
Ejecutar seed(semilla):
```bash
npm run seed:run
```

## 📄 Documentación de la API
Disponible en: `http://localhost:3000/docs`

Una vez el servidor esté en ejecución.

## 🔌 Endpoints Principales
### 🔐 Autenticación
- POST `http://localhost:3000/api/v1/auth/register/patient` – Registrar nuevo paciente
- POST `http://localhost:3000/api/v1/auth/register/doctor` – Registrar nuevo médico
- POST `http://localhost:3000/api/v1/auth/login` – Iniciar sesión y obtener JWT

### 👤 Paciente
- POST `http://localhost:3000/api/v1/patients/appointments` – Solicitar cita médica

### 💳 Pagos
- POST `http://localhost:3000/api/v1/payments/checkout/:appointmentId` – Crear sesión de pago (Stripe)
- POST `http://localhost:3000/api/v1/payments/webhook` – Webhook para eventos de pago de Stripe

### 🩺 Médico
- GET `http://localhost:3000/api/v1/doctors/appointments/today` – Citas del día del médico (requiere autenticación)
- PATCH `http://localhost:3000/api/v1/doctors/appointments/:appointmentId/confirm` – Confirmar cita
- PATCH `http://localhost:3000/api/v1/doctors/appointments/:appointmentId/reject` – Rechazar cita

### 🗓️ Agenda
- GET `http://localhost:3000/api/v1/appointments/patient/:patientId` – Listar citas de un paciente (requiere autenticación)


## 🧪 Pruebas
Las pruebas unitarias se ubican en el directorio test/. Para ejecutarlas:
```bash
npm run test
```

## 🗂️ Estructura del Proyecto
El código fuente está organizado dentro del directorio src/ en módulos:
src/
│
├── controllers/
├── routes/
├── models/
├── services/
├── middlewares/
├── utils/
└── plugins/
🛠️ Consideraciones Adicionales
Manejo de Errores: Utiliza clases personalizadas (utils/ApiError) para errores consistentes.

Validación de Datos: Implementa validaciones robustas usando Fastify Schemas o librerías como zod o yup.

Seguridad: Protege tus endpoints con JWT y considera CSRF, sanitización de entradas, y rate limiting.

Webhooks Stripe: Asegúrate de verificar la firma del webhook y actualizar correctamente el estado de la cita según el evento recibido.

📌 Versionamiento de la API
Todas las rutas están versionadas con el prefijo:

bash
Copiar
Editar
/api/v1/


## Consideraciones Adicionales

* **Manejo de Errores:** Se recomienda implementar un manejo de errores consistente utilizando clases de error personalizadas (como `ApiError` en `utils/`).
* **Validación de Datos:** Utilizar mecanismos de validación robustos (por ejemplo, con Fastify Hooks o librerías de validación) para asegurar la integridad de los datos en las solicitudes.
* **Seguridad:** Además de JWT, considera otras medidas de seguridad como la protección contra ataques CSRF y la validación de las entradas del usuario.
* **Webhooks de Stripe:** Implementar correctamente el webhook de Stripe para manejar los eventos de pago asíncronos y actualizar el estado de las citas en la base de datos.