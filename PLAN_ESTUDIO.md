# Plan de Estudio React — Evaluación N°3 SportClub
> **5 días** · Foco: agregar un nuevo módulo CRUD con base de datos actualizada

---

## Contexto
La evaluación agrega un **nuevo módulo** al proyecto SportClub existente.
El patrón a replicar ya existe en este repo: `service → page → modal → SweetAlert2`.
Estudiar este proyecto es la mejor preparación.

---

## Contenidos Clave

| # | Tema | Archivos de referencia en este proyecto |
|---|------|-----------------------------------------|
| 1 | `useState` y `useEffect` | `AdminDashboard.jsx`, `UsersPage.jsx` |
| 2 | Context API y `useAuth` | `context/AuthContext.jsx` |
| 3 | React Router — rutas anidadas y protegidas | `routes/AppRoutes.jsx`, `routes/RoleRoute.jsx` |
| 4 | Consumo de API con `fetch` y servicios | `services/api.js`, `services/userService.js` |
| 5 | React-Bootstrap (Modal, Table, Form, Badge, Spinner) | `components/users/UserFormModal.jsx` |
| 6 | SweetAlert2 — confirmaciones y alertas | `pages/admin/UsersPage.jsx` |
| 7 | Patrón CRUD completo | `UsersPage.jsx` + `UserFormModal.jsx` + `userService.js` |
| 8 | Estructura de carpetas y naming conventions | Toda la carpeta `src/` |

---

## Día 1 — Fundamentos React (Hooks + Estado)

**Objetivo:** Dominar cómo React maneja datos locales y efectos secundarios.

### Teoría (2 h)
- [ ] **`useState`**: qué es el estado, cómo actualizarlo, por qué no mutar directo
- [ ] **`useEffect`**: cuándo se ejecuta, arreglo de dependencias, limpiar efectos
- [ ] **Props**: pasar datos entre componentes padre → hijo
- [ ] **Renderizado condicional**: `condition && <Comp />`, ternario `a ? b : c`

### Práctica guiada (1 h)
Leer y entender completamente estos archivos del proyecto:
```
src/pages/admin/UsersPage.jsx        ← useState + useEffect + lógica CRUD
src/pages/user/UserDashboard.jsx     ← componente simple con datos del contexto
```

### Ejercicio (1 h)
Crear desde cero un componente `ListaEjercicios.jsx` (fuera del proyecto) que:
1. Tenga un array de objetos en `useState`
2. Los liste en pantalla con `.map()`
3. Permita agregar un elemento nuevo con un input y botón
4. Permita eliminar por índice

### Conceptos clave a memorizar
```jsx
const [datos, setDatos] = useState([])          // estado inicial vacío
const [cargando, setCargando] = useState(true)  // estado booleano

useEffect(() => {
  cargarDatos()                                  // llamada a API al montar
}, [])                                           // [] = solo al montar

useEffect(() => {
  cargarDatos()                                  // se re-ejecuta cuando cambia filtro
}, [filtro])
```

---

## Día 2 — React Router y Rutas Protegidas

**Objetivo:** Entender cómo funciona la navegación y la protección por rol.

### Teoría (1.5 h)
- [ ] `BrowserRouter`, `Routes`, `Route` — estructura base
- [ ] `Outlet` — rutas anidadas (layout wrapping)
- [ ] `useNavigate` — redirección programática
- [ ] `Navigate` — redirección declarativa
- [ ] `Link` vs `useNavigate` — cuándo usar cada uno

### Práctica guiada (1 h)
Leer y entender:
```
src/routes/AppRoutes.jsx     ← rutas anidadas por rol
src/routes/RoleRoute.jsx     ← guard de autenticación + rol
src/layouts/AdminLayout.jsx  ← uso de <Outlet />
```

### Ejercicio (1.5 h)
Trazar el flujo completo en papel:
1. Usuario entra a `/admin/users` sin sesión → ¿qué pasa?
2. Usuario con rol `coach` entra a `/admin/users` → ¿qué pasa?
3. Usuario con rol `admin` entra a `/admin/users` → ¿qué pasa?

Luego agregar una **ruta nueva** de prueba `/admin/test` que muestre un componente simple, y verificar que funciona.

### Conceptos clave a memorizar
```jsx
// Ruta protegida con layout anidado
<Route path="/admin" element={<RoleRoute role="admin"><AdminLayout /></RoleRoute>}>
  <Route path="dashboard" element={<AdminDashboard />} />
  <Route path="nuevo-modulo" element={<NuevoModuloPage />} />  // ← aquí va el nuevo módulo
</Route>

// Link en el layout para navegar
<Link to="/admin/nuevo-modulo">Nuevo Módulo</Link>
```

---

## Día 3 — Servicios y Consumo de API

**Objetivo:** Saber crear y usar un archivo de servicio para cualquier entidad nueva.

### Teoría (1.5 h)
- [ ] `async / await` y manejo de errores con `try / catch`
- [ ] `fetch` — métodos GET, POST, PUT, DELETE
- [ ] Headers de autorización con Bearer token
- [ ] Por qué separar la lógica de API en archivos `service`

### Práctica guiada (1 h)
Leer y entender completamente:
```
src/services/api.js           ← cliente HTTP centralizado (patrón del proyecto)
src/services/userService.js   ← servicio específico de usuarios
src/services/authService.js   ← servicio de autenticación
```

### Ejercicio clave (1.5 h) ⚠️ Este ejercicio simula la evaluación
Para **cualquier entidad nueva** (ej: `sports`, `classes`, `reservations`), crear su servicio siguiendo el patrón:

```js
// src/services/[entidad]Service.js
import { apiClient } from './api'

const BASE = '/[entidad]'

export async function getAll() { ... }
export async function getById(id) { ... }
export async function create(data) { ... }
export async function update(id, data) { ... }
export async function remove(id) { ... }
```

### Endpoints del backend SportClub
Revisar qué rutas expone el backend. Patrón probable:
```
GET    /api/[entidad]       → listar
POST   /api/[entidad]       → crear
PUT    /api/[entidad]/:id   → editar
DELETE /api/[entidad]/:id   → eliminar
```

---

## Día 4 — React-Bootstrap y SweetAlert2

**Objetivo:** Usar fluido los componentes de UI requeridos por la evaluación.

### React-Bootstrap (1.5 h)
- [ ] `Modal`, `Modal.Header`, `Modal.Body`, `Modal.Footer`
- [ ] `Form`, `Form.Group`, `Form.Label`, `Form.Control`, `Form.Select`
- [ ] `Table` con `striped`, `bordered`, `hover`, `responsive`
- [ ] `Button` con `variant` (primary, secondary, warning, danger)
- [ ] `Badge` con `bg`
- [ ] `Spinner` con `animation="border"`
- [ ] `Card`, `Card.Header`, `Card.Body`

### Práctica guiada (1 h)
Leer en detalle:
```
src/components/users/UserFormModal.jsx  ← Modal + Form completo
src/pages/admin/UsersPage.jsx           ← Table + Badge + Spinner + Button
```

### SweetAlert2 (1 h)
- [ ] `Swal.fire("Título", "Mensaje", "success|error|warning")`
- [ ] Confirmación con `showCancelButton: true` y `result.isConfirmed`

```js
// Alerta simple
Swal.fire("Éxito", "Operación completada", "success")
Swal.fire("Error", error.message, "error")

// Confirmación antes de eliminar
const result = await Swal.fire({
  title: "¿Eliminar?",
  text: `Se eliminará ${item.nombre}`,
  icon: "warning",
  showCancelButton: true,
  confirmButtonText: "Sí, eliminar",
  cancelButtonText: "Cancelar",
  confirmButtonColor: "#d33",
})
if (result.isConfirmed) { /* eliminar */ }
```

### Ejercicio (30 min)
Agregar a `UsersPage.jsx` un SweetAlert de éxito con timer automático:
```js
Swal.fire({ title: "Listo", icon: "success", timer: 1500, showConfirmButton: false })
```

---

## Día 5 — Simulacro: Nuevo Módulo CRUD Completo

**Objetivo:** Replicar el patrón completo en una entidad nueva, como lo pedirá la evaluación.

### Checklist de implementación (seguir en orden)

#### Paso 1 — Servicio (15 min)
- [ ] Crear `src/services/[entidad]Service.js`
- [ ] Implementar `getAll`, `create`, `update`, `remove`

#### Paso 2 — Modal de formulario (20 min)
- [ ] Crear `src/components/[entidad]/[Entidad]FormModal.jsx`
- [ ] Props: `show`, `handleClose`, `handleSave`, `selectedItem`
- [ ] `useEffect` para cargar datos al editar
- [ ] Campos del formulario según la entidad

#### Paso 3 — Página principal (30 min)
- [ ] Crear `src/pages/admin/[Entidad]Page.jsx`
- [ ] `useState`: lista, loading, showModal, selectedItem
- [ ] `useEffect`: llamar `loadItems()` al montar
- [ ] Funciones: `loadItems`, `openCreateModal`, `openEditModal`, `closeModal`, `handleSave`, `handleDelete`
- [ ] Render: Card > Table con Spinner condicional + Modal

#### Paso 4 — Ruta (5 min)
- [ ] Agregar `<Route path="[entidad]" element={<[Entidad]Page />} />` en `AppRoutes.jsx`

#### Paso 5 — Navegación (5 min)
- [ ] Agregar `<Link to="/admin/[entidad]">` en `AdminLayout.jsx`

### Template de página CRUD (copiar y adaptar)
```jsx
// src/pages/admin/[Entidad]Page.jsx
import { useEffect, useState } from "react"
import { Badge, Button, Card, Spinner, Table } from "react-bootstrap"
import Swal from "sweetalert2"
import [Entidad]FormModal from "../../components/[entidad]/[Entidad]FormModal"
import { getAll, create, update, remove } from "../../services/[entidad]Service"

function [Entidad]Page() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const loadItems = async () => {
    try {
      setLoading(true)
      const data = await getAll()
      setItems(data.data ?? data)
    } catch (error) {
      Swal.fire("Error", error.message, "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadItems() }, [])

  const openCreateModal = () => { setSelectedItem(null); setShowModal(true) }
  const openEditModal = (item) => { setSelectedItem(item); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setSelectedItem(null) }

  const handleSave = async (formData) => {
    try {
      if (selectedItem) {
        await update(selectedItem.id, formData)
        Swal.fire("Actualizado", "Registro actualizado correctamente", "success")
      } else {
        await create(formData)
        Swal.fire("Creado", "Registro creado correctamente", "success")
      }
      closeModal()
      loadItems()
    } catch (error) {
      Swal.fire("Error", error.message, "error")
    }
  }

  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: "¿Eliminar?",
      text: `Se eliminará el registro`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    })
    if (result.isConfirmed) {
      try {
        await remove(item.id)
        Swal.fire("Eliminado", "Registro eliminado", "success")
        loadItems()
      } catch (error) {
        Swal.fire("Error", error.message, "error")
      }
    }
  }

  return (
    <Card className="shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h4 className="mb-0">Gestión de [Entidad]</h4>
        <Button variant="primary" onClick={openCreateModal}>Nuevo</Button>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="text-center p-4">
            <Spinner animation="border" />
            <p className="mt-2">Cargando...</p>
          </div>
        ) : (
          <Table responsive striped bordered hover>
            <thead>
              <tr><th>ID</th><th>Nombre</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.nombre}</td>
                  <td>
                    <Button variant="warning" size="sm" className="me-2" onClick={() => openEditModal(item)}>Editar</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(item)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
      <[Entidad]FormModal show={showModal} handleClose={closeModal} handleSave={handleSave} selectedItem={selectedItem} />
    </Card>
  )
}

export default [Entidad]Page
```

---

## Resumen de lo que NO olvidar en la evaluación

| ✅ | Qué hacer |
|----|-----------|
| | Crear el servicio en `src/services/` antes de la página |
| | Usar **Modal de React-Bootstrap** para crear y editar |
| | Usar **SweetAlert2** para eliminar (nunca `confirm()`) |
| | Usar **SweetAlert2** para éxito y error |
| | `loadItems()` después de cada operación (sin recargar página) |
| | Nombres de carpetas en **inglés y minúsculas** |
| | Nombres de componentes en **PascalCase** |
| | Textos visibles al usuario en **español** |
| | Agregar la ruta en `AppRoutes.jsx` |
| | Agregar el link en `AdminLayout.jsx` |

---

## Comandos útiles del proyecto

```bash
# Instalar dependencias
pnpm install

# Iniciar frontend (puerto 5173)
pnpm dev

# Verificar que el backend está corriendo
# http://localhost:3000/api/users  →  debe responder JSON
```

---

*Proyecto base: `c:\Users\aleja\Code\React\proyecto clase front`*
*Repositorio: https://github.com/Jano03op/sportclub-frontend*
