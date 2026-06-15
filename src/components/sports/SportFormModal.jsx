import { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import Swal from 'sweetalert2'

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

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const onSubmit = (event) => {
    event.preventDefault()

    if (!formData.name.trim()) {
      Swal.fire('Advertencia', 'El nombre es obligatorio.', 'warning')
      return
    }
    if (!formData.objective.trim()) {
      Swal.fire('Advertencia', 'El objetivo es obligatorio.', 'warning')
      return
    }
    if (!formData.duration || Number(formData.duration) <= 0) {
      Swal.fire('Advertencia', 'La duración es obligatoria y debe ser mayor a 0.', 'warning')
      return
    }

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
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: CrossFit"
            />
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
            />
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
            />
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
