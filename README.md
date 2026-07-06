# SportClub — Frontend

Aplicación web SPA desarrollada con React para la gestión del club deportivo SportClub.

**🌐 Aplicación desplegada en AWS:** http://34.195.133.17

## Integrantes y distribución de flujos

| Integrante | Flujos desarrollados |
|---|---|
| **Alejandro Aracena** | 1. Gestión de Salas · 2. Gestión de Asignaciones · 3. Gestión de Horarios · 8. Mis Reservas / Cancelar Reserva — base obligatoria (login, registro, gestión de usuarios y deportes, rutas protegidas, roles y Mi Perfil) |
| **Joaquín Pizarro** | 4. Mis Clases (coach) · 5. Mi Horario (coach) · 6. Clases Disponibles · 7. Crear Reserva |

## Tecnologías utilizadas

- React 19 + Vite
- React Router DOM (rutas anidadas y protegidas por rol)
- React-Bootstrap + Bootstrap 5
- SweetAlert2 (confirmaciones y retroalimentación de errores)
- Context API (autenticación con JWT)
- Fetch API centralizado (`services/api.js`)

## Requisitos previos

- Node.js 18+
- pnpm (o npm/yarn)
- Backend SportClub ejecutándose en `http://localhost:3000`

## Instalación y ejecución

```bash
pnpm install
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`.

### Backend (repositorio del docente)

```bash
# Opción 1: Node local
cd ../FrontEnd-Backend-ClubDeportivo
npm install
npm run dev

# Opción 2: Docker (backend + MariaDB)
docker compose up -d --build
```

El backend estará disponible en `http://localhost:3000`.

### Configuración de la URL de la API

`services/api.js` usa la variable `VITE_API_URL`:

- **Desarrollo:** no requiere configuración (usa `http://localhost:3000/api`).
- **Producción:** [.env.production](.env.production) define `VITE_API_URL=/api` (ruta relativa). En AWS, nginx redirige `/api` al backend, por lo que un cambio de IP pública **no** requiere recompilar.

## Usuarios de prueba

| Email | Contraseña | Rol |
|---|---|---|
| admin1@demo.cl | 12345678 | Administrador |
| coach1@demo.cl | 12345678 | Coach |
| user1@demo.cl | 12345678 | Usuario |

(También existen `admin2`, `coach2` y `user2` con la misma contraseña.)

## Módulos implementados

### Base obligatoria
- **Login** con persistencia de sesión (token JWT en localStorage) y expiración manejada.
- **Registro** de cuenta con validaciones en línea campo a campo.
- **Gestión de Usuarios** *(admin)*: CRUD completo con filtro por rol y buscador.
- **Gestión de Deportes** *(admin)*: CRUD con switch de estado activo/inactivo y fechas formateadas.
- **Rutas protegidas** por rol mediante `RoleRoute` + layouts por rol con tema visual propio.
- **Mi Perfil** (los tres roles): edición de datos personales y cambio de contraseña.

### Flujos de Administración
- **Gestión de Salas:** CRUD con capacidad, ubicación y observaciones.
- **Gestión de Asignaciones:** vincula Deporte + Sala + Coach; detecta duplicados (409) y muestra la cantidad de horarios asociados.
- **Gestión de Horarios:** bloques por día de la semana (1–7) y rango horario validado; filtro por día.
- **Dashboard Admin:** estadísticas en vivo de los 5 módulos, clases del día y resumen del sistema.

### Flujos del Coach
- **Mis Clases:** listado de asignaciones activas a cargo del coach autenticado (identificado por su token).
- **Mi Horario:** agenda de bloques horarios con filtros por día y búsqueda.
- **Dashboard Coach:** métricas reales y siguiente clase programada.

### Flujos del Usuario (Miembro)
- **Clases Disponibles:** filtros server-side por deporte y sala (query params).
- **Crear Reserva:** modal con resumen de la clase y observación opcional; maneja duplicados (409).
- **Mis Reservas / Cancelar:** historial personal con filtro por estado; la cancelación es un `PATCH` (soft-cancel) que conserva el registro.
- **Dashboard Usuario:** clases sugeridas y reservas activas.

### Experiencia de usuario
- Design system propio sobre Bootstrap (`src/index.css`): tipografía Lexend, paleta púrpura/dorado, capas tonales sin bordes, acento de color por rol.
- Validación en dos capas: en línea bajo cada campo (antes de enviar) + errores del backend listados en SweetAlert2.
- Estados de carga (spinners), estados vacíos descriptivos y actualización automática de la interfaz tras cada operación.
- Diseño responsive (navbar colapsable, tablas con scroll, cards apilables).

## Estructura del proyecto

```
src/
├── assets/                     # Logo e imágenes
├── components/
│   ├── navigation/DashboardNavbar.jsx
│   ├── users/UserFormModal.jsx
│   ├── sports/SportFormModal.jsx
│   ├── rooms/RoomFormModal.jsx
│   ├── assignments/AssignmentFormModal.jsx
│   ├── schedules/ScheduleFormModal.jsx
│   └── reservations/ReservationModal.jsx
├── context/                    # AuthContext + hook useAuth
├── layouts/                    # AdminLayout / CoachLayout / UserLayout
├── pages/
│   ├── Home.jsx · Login.jsx · Register.jsx · Recover.jsx · ProfilePage.jsx
│   ├── admin/                  # Dashboard, Users, Sports, Rooms, Assignments, Schedules
│   ├── coach/                  # Dashboard, MyClasses, MySchedule
│   └── user/                   # Dashboard, AvailableClasses, MyReservations
├── routes/                     # AppRoutes + RoleRoute
├── services/                   # api.js (fetch central) + un servicio por módulo
├── utils/                      # alerts.js · schedule.js · format.js
├── App.jsx
└── main.jsx
```

## Endpoints consumidos

### Autenticación y perfil
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/register` | Registrar cuenta |
| GET | `/api/auth/me` | Obtener usuario autenticado |
| PUT | `/api/auth/me` | Actualizar perfil propio |
| PUT | `/api/auth/me/password` | Cambiar contraseña |

### Usuarios (admin)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/users` | Listar usuarios (`?role=` para filtrar) |
| POST | `/api/users` | Crear usuario |
| PUT | `/api/users/:id` | Actualizar usuario |
| DELETE | `/api/users/:id` | Eliminar usuario |

### Deportes (admin)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET / POST | `/api/sports` | Listar / crear deportes |
| PUT / DELETE | `/api/sports/:id` | Actualizar / eliminar deporte |
| PATCH | `/api/sports/:id/status` | Cambiar estado |

### Salas, Asignaciones y Horarios (admin)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET / POST | `/api/rooms` | Listar / crear salas |
| PUT / DELETE | `/api/rooms/:id` | Actualizar / eliminar sala |
| GET / POST | `/api/sport-rooms` | Listar / crear asignaciones (Deporte+Sala+Coach) |
| PUT / DELETE | `/api/sport-rooms/:id` | Actualizar / eliminar asignación |
| GET / POST | `/api/class-schedules` | Listar / crear horarios |
| PUT / DELETE | `/api/class-schedules/:id` | Actualizar / eliminar horario |

### Coach
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/coach/dashboard` | Métricas y siguiente clase del coach |
| GET | `/api/coach/my-classes` | Clases asignadas al coach autenticado |
| GET | `/api/coach/my-schedules` | Bloques horarios del coach |

### Miembro y Reservas
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/member/dashboard` | Métricas y clases sugeridas |
| GET | `/api/member/classes` | Clases disponibles (`?sport_id=&room_id=`) |
| GET | `/api/member/sports` · `/api/member/rooms` | Catálogos activos para filtros |
| GET | `/api/reservations/my-reservations` | Historial de reservas del usuario |
| POST | `/api/reservations` | Crear reserva en un horario |
| PATCH | `/api/reservations/:id/cancel` | Cancelar reserva activa |

## Despliegue en AWS

La aplicación corre en una instancia **EC2 (Amazon Linux 2023)** con IP elástica:

```
Navegador ── http://34.195.133.17 (puerto 80)
              [ nginx ]
               ├── /        → build de Vite (dist/) con fallback a index.html (React Router)
               └── /api/... → proxy inverso → backend en localhost:3000
                                  [ Docker Compose ]
                                  ├── club_backend (Node/Express)
                                  └── club_mariadb (MariaDB 11)
```

- El backend y la base de datos corren con `docker compose` (`restart: always`), y nginx está habilitado como servicio: **todo se levanta automáticamente** al encender la instancia.
- Solo los puertos 22 (SSH) y 80 (HTTP) están abiertos en el Security Group; el 3000 no se expone públicamente.
