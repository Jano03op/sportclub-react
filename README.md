# SportClub — Frontend

Aplicación web SPA desarrollada con React para la gestión del club deportivo SportClub.

## Integrantes

- Alejandro Aracena
- Joaquín Pizarro

## Tecnologías utilizadas

- React 19
- Vite
- React Router DOM
- React-Bootstrap + Bootstrap 5
- SweetAlert2
- Context API (autenticación)

## Requisitos previos

- Node.js 18+
- pnpm (o npm/yarn)
- Backend SportClub ejecutándose en `http://localhost:3000`

## Instalación de dependencias

```bash
pnpm install
```

## Cómo ejecutar el frontend

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`.

## Cómo ejecutar el backend

```bash
# Ingresar al directorio del backend
cd ../Backend-SportClub-E3

# Instalar dependencias
npm install

# Ejecutar el servidor
npm run dev
```

El backend estará disponible en `http://localhost:3000`.

## Usuarios de prueba

| Email | Contraseña | Rol |
|---|---|---|
| admin1@demo.cl | 12345678 | Administrador |
| coach1@demo.cl | 12345678 | Coach |
| user1@demo.cl | 12345678 | Usuario |

## Módulos implementados

### Autenticación
- Login con persistencia de sesión (token en localStorage)
- Registro de cuenta con campo de fecha de nacimiento (opcional)
- Cierre de sesión
- Rutas protegidas por rol mediante `RoleRoute`

### Gestión de Usuarios *(solo Administrador)*
- Listar, crear, editar y eliminar usuarios
- Modal React-Bootstrap para crear y editar
- SweetAlert2 para confirmaciones y notificaciones

### Gestión de Deportes *(solo Administrador)*
- Listar deportes en tabla con: Nombre, Objetivo, Duración, Estado, Fecha de creación
- Fechas formateadas como `15 de Julio de 2026`
- Crear y editar mediante Modal React-Bootstrap con validaciones
- Eliminar con confirmación SweetAlert2
- Cambio de estado activo/inactivo con Switch directamente desde el listado
- Botón Refrescar para recargar datos desde la API
- Actualización automática en pantalla tras cada operación

### Dashboards
- Dashboard Usuario (tema azul) - Carga datos dinámicos y clases sugeridas
- Dashboard Coach (tema verde) - Carga estadísticas reales y próxima clase activa
- Dashboard Administrador (tema morado)

### Módulos del Coach
- **Mis Clases:** Consulta y listado de clases y asignaciones activas a cargo del coach.
- **Mi Horario:** Agenda cronológica de clases asignadas en salas.

### Módulos del Usuario (Miembro)
- **Clases Disponibles:** Filtros dinámicos de búsqueda por Deporte y por Sala.
- **Crear Reserva:** Proceso de agendamiento de horas con modal de observaciones opcionales.
- **Mis Reservas / Cancelación:** Historial personal de reservas con posibilidad de cancelaciones utilizando alertas de SweetAlert2.

## Estructura del proyecto

```
src/
├── assets/
│   └── logo_empresa_letra_v1.png
├── components/
│   ├── navigation/
│   │   └── DashboardNavbar.jsx
│   ├── sports/
│   │   └── SportFormModal.jsx
│   └── users/
│       └── UserFormModal.jsx
├── context/
│   ├── AuthContext.jsx
│   └── useAuth.js
├── layouts/
│   ├── AdminLayout.jsx
│   ├── CoachLayout.jsx
│   └── UserLayout.jsx
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Recover.jsx
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── SportsPage.jsx
│   │   └── UsersPage.jsx
│   ├── coach/
│   │   └── CoachDashboard.jsx
│   └── user/
│       └── UserDashboard.jsx
├── routes/
│   ├── AppRoutes.jsx
│   └── RoleRoute.jsx
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── sportService.js
│   └── userService.js
├── App.jsx
└── main.jsx
```

## Endpoints consumidos

### Autenticación
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/register` | Registrar cuenta |
| GET | `/api/auth/me` | Obtener usuario autenticado |

### Usuarios
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/users` | Listar usuarios |
| POST | `/api/users` | Crear usuario |
| PUT | `/api/users/:id` | Actualizar usuario |
| DELETE | `/api/users/:id` | Eliminar usuario |

### Deportes
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/sport` | Listar deportes |
| POST | `/api/sport` | Crear deporte |
| PUT | `/api/sport/:id` | Actualizar deporte |
| DELETE | `/api/sport/:id` | Eliminar deporte |
| PATCH | `/api/sport/:id/status` | Cambiar estado |

### Coach (Entrenador)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/coach/dashboard` | Métricas y siguiente clase del coach |
| GET | `/api/coach/my-classes` | Listar clases asignadas |
| GET | `/api/coach/my-schedules` | Listar bloques horarios asignados |

### Miembro (Usuario) y Reservas
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/member/dashboard` | Métricas y clases sugeridas del usuario |
| GET | `/api/member/classes` | Buscar y filtrar clases disponibles |
| GET | `/api/reservations/my-reservations` | Historial de reservas del usuario |
| POST | `/api/reservations` | Crear nueva reserva en un horario |
| PATCH | `/api/reservations/:id/cancel` | Cancelar reserva activa |
