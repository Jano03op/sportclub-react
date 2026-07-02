import { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

const initialForm = {
  name: '',
  objective: '',
  duration: '',
  status: true,
}

function SportFormModal({ show, handleClose, handleSave, selectedSport }) {
  const [formData, setFormData] = useState(() =>
    selectedSport
      ? {
          name: selectedSport.name || '',
          objective: selectedSport.objective || '',
          duration: selectedSport.duration || '',
          status: selectedSport.status ?? true,
        }
      : initialForm
  )
  const [fieldErrors, setFieldErrors] = useState({})

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
    // Al corregir un campo, su mensaje de error desaparece de inmediato
    setFieldErrors((prev) => ({ ...prev, [name]: '' }))
  }

  // Mismas reglas que el validador del backend, para avisar antes de enviar
  const validate = () => {
    const errors = {}
    const name = formData.name.trim()
    const objective = formData.objective.trim()
    const duration = Number(formData.duration)

    if (!name) {
      errors.name = 'El nombre del deporte es obligatorio.'
    } else if (name.length < 3) {
      errors.name = `El nombre debe tener al menos 3 caracteres (llevas ${name.length}).`
    } else if (name.length > 100) {
      errors.name = 'El nombre no puede superar los 100 caracteres.'
    }

    if (!objective) {
      errors.objective = 'El objetivo es obligatorio.'
    } else if (objective.length < 5) {
      errors.objective = `El objetivo debe tener al menos 5 caracteres (llevas ${objective.length}).`
    } else if (objective.length > 255) {
      errors.objective = 'El objetivo no puede superar los 255 caracteres.'
    }

    if (formData.duration === '' || formData.duration === null) {
      errors.duration = 'La duración es obligatoria.'
    } else if (!Number.isInteger(duration) || duration < 1) {
      errors.duration = 'La duración debe ser un número entero mayor a 0, sin decimales.'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (!validate()) return

    handleSave({
      name: formData.name.trim(),
      objective: formData.objective.trim(),
      duration: Number(formData.duration),
      status: formData.status,
    })
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedSport ? 'Editar Deporte' : 'Nuevo Deporte'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit} noValidate>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: CrossFit"
              isInvalid={!!fieldErrors.name}
            />
            <Form.Control.Feedback type="invalid">
              {fieldErrors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Objetivo</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="objective"
              value={formData.objective}
              onChange={handleChange}
              placeholder="Ej: Mejorar fuerza y resistencia..."
              isInvalid={!!fieldErrors.objective}
            />
            <Form.Control.Feedback type="invalid">
              {fieldErrors.objective}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Duración (minutos)</Form.Label>
            <Form.Control
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min="1"
              placeholder="Ej: 60"
              isInvalid={!!fieldErrors.duration}
            />
            <Form.Control.Feedback type="invalid">
              {fieldErrors.duration}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="sport-status-modal"
              name="status"
              label={formData.status ? 'Activo' : 'Inactivo'}
              checked={formData.status}
              onChange={handleChange}
            />
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

export default SportFormModal
