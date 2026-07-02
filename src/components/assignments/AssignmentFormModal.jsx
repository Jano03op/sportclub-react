import { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

const initialForm = {
  sport_id: '',
  room_id: '',
  coach_id: '',
  observation: '',
  status: true,
}

// Recibe las listas de deportes, salas y coaches ya cargadas por la página
function AssignmentFormModal({
  show,
  handleClose,
  handleSave,
  selectedAssignment,
  sports,
  rooms,
  coaches,
}) {
  const [formData, setFormData] = useState(() =>
    selectedAssignment
      ? {
          sport_id: selectedAssignment.sport_id || '',
          room_id: selectedAssignment.room_id || '',
          coach_id: selectedAssignment.coach_id || '',
          observation: selectedAssignment.observation || '',
          status: selectedAssignment.status ?? true,
        }
      : initialForm
  )
  const [fieldErrors, setFieldErrors] = useState({})

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
    setFieldErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const errors = {}

    if (!formData.sport_id) {
      errors.sport_id = 'Debes seleccionar un deporte.'
    }
    if (!formData.room_id) {
      errors.room_id = 'Debes seleccionar una sala.'
    }
    if (!formData.coach_id) {
      errors.coach_id = 'Debes seleccionar un coach.'
    }
    if (formData.observation.trim().length > 255) {
      errors.observation = 'La observación no puede superar los 255 caracteres.'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (!validate()) return

    // El backend hace observation.length, por lo que enviar null lo rompe:
    // siempre se envía string (vacío si el usuario no escribió nada)
    handleSave({
      sport_id: Number(formData.sport_id),
      room_id: Number(formData.room_id),
      coach_id: Number(formData.coach_id),
      observation: formData.observation.trim(),
      status: formData.status,
    })
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedAssignment ? 'Editar Asignación' : 'Nueva Asignación'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit} noValidate>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Deporte</Form.Label>
            <Form.Select
              name="sport_id"
              value={formData.sport_id}
              onChange={handleChange}
              isInvalid={!!fieldErrors.sport_id}
            >
              <option value="">Selecciona un deporte...</option>
              {sports.map((sport) => (
                <option key={sport.id} value={sport.id}>
                  {sport.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {fieldErrors.sport_id}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Sala</Form.Label>
            <Form.Select
              name="room_id"
              value={formData.room_id}
              onChange={handleChange}
              isInvalid={!!fieldErrors.room_id}
            >
              <option value="">Selecciona una sala...</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name} (capacidad: {room.capacity})
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {fieldErrors.room_id}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Coach</Form.Label>
            <Form.Select
              name="coach_id"
              value={formData.coach_id}
              onChange={handleChange}
              isInvalid={!!fieldErrors.coach_id}
            >
              <option value="">Selecciona un coach...</option>
              {coaches.map((coach) => (
                <option key={coach.id} value={coach.id}>
                  {coach.full_name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {fieldErrors.coach_id}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Observación <span className="text-muted">(opcional)</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="observation"
              value={formData.observation}
              onChange={handleChange}
              isInvalid={!!fieldErrors.observation}
            />
            <Form.Control.Feedback type="invalid">
              {fieldErrors.observation}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="assignment-status-modal"
              name="status"
              label={formData.status ? 'Activa' : 'Inactiva'}
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

export default AssignmentFormModal
