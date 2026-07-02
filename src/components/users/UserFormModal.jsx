import { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const initialForm = {
  full_name: '',
  email: '',
  role: 'user',
  password: '',
}

// El padre pasa una prop `key` que cambia al abrir/cerrar el modal,
// así el estado del formulario se reinicia sin necesidad de un efecto.
function UserFormModal({ show, handleClose, handleSave, selectedUser }) {
  const [formData, setFormData] = useState(() =>
    selectedUser
      ? {
          full_name: selectedUser.full_name || '',
          email: selectedUser.email || '',
          role: selectedUser.role || 'user',
          password: '',
        }
      : initialForm
  )
  const [fieldErrors, setFieldErrors] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
    // Al corregir un campo, su mensaje de error desaparece de inmediato
    setFieldErrors((prev) => ({ ...prev, [name]: '' }))
  }

  // Mismas reglas que el validador del backend, para avisar antes de enviar
  const validate = () => {
    const errors = {}
    const fullName = formData.full_name.trim()
    const email = formData.email.trim()

    if (!fullName) {
      errors.full_name = 'El nombre completo es obligatorio.'
    } else if (fullName.length < 3) {
      errors.full_name = 'El nombre debe tener al menos 3 caracteres.'
    } else if (fullName.length > 150) {
      errors.full_name = 'El nombre no puede superar los 150 caracteres.'
    }

    if (!email) {
      errors.email = 'El correo es obligatorio.'
    } else if (!EMAIL_REGEX.test(email)) {
      errors.email = 'Ingresa un correo válido, por ejemplo: nombre@dominio.cl'
    } else if (email.length > 150) {
      errors.email = 'El correo no puede superar los 150 caracteres.'
    }

    if (!selectedUser) {
      if (!formData.password) {
        errors.password = 'La contraseña es obligatoria.'
      } else if (formData.password.length < 8) {
        errors.password = `La contraseña debe tener al menos 8 caracteres (llevas ${formData.password.length}).`
      }
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (!validate()) return
    handleSave({
      ...formData,
      full_name: formData.full_name.trim(),
      email: formData.email.trim().toLowerCase(),
    })
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit} noValidate>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre Completo</Form.Label>
            <Form.Control
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Ej: Juan Pérez"
              isInvalid={!!fieldErrors.full_name}
            />
            <Form.Control.Feedback type="invalid">
              {fieldErrors.full_name}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Correo</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ej: nombre@dominio.cl"
              isInvalid={!!fieldErrors.email}
            />
            <Form.Control.Feedback type="invalid">
              {fieldErrors.email}
            </Form.Control.Feedback>
          </Form.Group>
          {!selectedUser && (
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 8 caracteres"
                isInvalid={!!fieldErrors.password}
              />
              <Form.Control.Feedback type="invalid">
                {fieldErrors.password}
              </Form.Control.Feedback>
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Rol</Form.Label>
            <Form.Select name="role" value={formData.role} onChange={handleChange}>
              <option value="user">Usuario</option>
              <option value="coach">Coach</option>
              <option value="admin">Administrador</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Guardar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default UserFormModal
