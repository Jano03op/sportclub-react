import { useEffect, useState } from 'react'
import { Badge, Button, Card, Spinner, Table } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { showApiError } from '../../utils/alerts'
import UserFormModal from '../../components/users/UserFormModal'
import { createUser, deleteUser, getUsers, updateUser } from '../../services/userService'

function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // setUsers/setLoading se llaman en callbacks de la promesa (nunca de forma
  // síncrona), por eso es seguro usar loadUsers también dentro del efecto
  const loadUsers = () =>
    getUsers()
      .then((data) => setUsers(data))
      .catch((error) => Swal.fire('Error', error.message, 'error'))
      .finally(() => setLoading(false))

  // Recarga desde un evento (no desde el efecto): aquí sí se muestra el spinner
  const reloadUsers = () => {
    setLoading(true)
    loadUsers()
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const openCreateModal = () => {
    setSelectedUser(null)
    setShowModal(true)
  }

  const openEditModal = (user) => {
    setSelectedUser(user)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedUser(null)
  }

  const handleSave = async (formData) => {
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, formData)
        Swal.fire('Actualizado', 'Usuario actualizado correctamente', 'success')
      } else {
        await createUser(formData)
        Swal.fire('Creado', 'Usuario creado correctamente', 'success')
      }
      closeModal()
      reloadUsers()
    } catch (error) {
      showApiError(
        error,
        selectedUser ? 'No se pudo actualizar el usuario' : 'No se pudo crear el usuario'
      )
    }
  }

  const handleDelete = async (user) => {
    const result = await Swal.fire({
      title: '¿Eliminar usuario?',
      text: `Se eliminará a ${user.full_name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
    })

    if (result.isConfirmed) {
      try {
        await deleteUser(user.id)
        Swal.fire('Eliminado', 'Usuario eliminado correctamente', 'success')
        reloadUsers()
      } catch (error) {
        showApiError(error, 'No se pudo eliminar el usuario')
      }
    }
  }

  const roleLabel = { user: 'Usuario', coach: 'Entrenador', admin: 'Administrador' }
  const roleBadge = { admin: 'danger', coach: 'success', user: 'primary' }

  return (
    <Card className="shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h4 className="mb-0">Gestión de Usuarios</h4>
        <Button variant="primary" onClick={openCreateModal}>
          Nuevo Usuario
        </Button>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="text-center p-4">
            <Spinner animation="border" />
            <p className="mt-2">Cargando usuarios...</p>
          </div>
        ) : (
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-4">
                    Sin usuarios registrados
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>
                    <td>
                      <Badge bg={roleBadge[user.role] || 'secondary'}>
                        {roleLabel[user.role] || user.role}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => openEditModal(user)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(user)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </Card.Body>
      <UserFormModal
        key={selectedUser ? `edit-${selectedUser.id}` : `create-${showModal}`}
        show={showModal}
        handleClose={closeModal}
        handleSave={handleSave}
        selectedUser={selectedUser}
      />
    </Card>
  )
}

export default UsersPage
