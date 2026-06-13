# SportClub — Frontend

Aplicación web SPA desarrollada con React para la gestión del club deportivo SportClub.

## Integrantes

- Alejandro Aracena

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
cd ../backend-ClubDeportivo

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

## Estructura del proyecto

```
src/
├── assets/
│   └── logo_empresa_letra_v1.png
├── components/
│   ├── navigation/
│   │   └── DashboardNavbar.jsx
│   └── users/
│       └── UserFormModal.jsx
├── context/
│   └── AuthContext.jsx
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
│   │   └── UsersPage.jsx
│   ├── coach/
│   │   └── CoachDashboard.jsx
│   └── user/
│       └── UserDashboard.jsx
├── routes/
│   ├── AppRoutes.jsx
│   ├── ProtectedRoute.jsx
│   └── RoleRoute.jsx
├── services/
│   ├── api.js
│   ├── authService.js
│   └── userService.js
├── App.jsx
└── main.jsx
```
