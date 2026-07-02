import { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { DAYS_OF_WEEK, assignmentLabel, formatTime } from '../../utils/schedule'

const initialForm = {
  sport_room_id: '',
  day_of_week: '',
  start_time: '',
  end_time: '',
  status: true,
}

// Recibe las asignaciones deporte-sala-coach ya cargadas por la página
function ScheduleFormModal({ show, handleClose, handleSave, selectedSchedule, assignments }) {
  const [formData, setFormData] = useState(() =>
    selectedSchedule
      ? {
          sport_room_id: selectedSchedule.sport_room_id || '',
          day_of_week: selectedSchedule.day_of_week || '',
          start_time: formatTime(selectedSchedule.start_time),
          end_time: formatTime(selectedSchedule.end_time),
          status: selectedSchedule.status ?? true,
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

    if (!formData.sport_room_id) {
      errors.sport_room_id = 'Debes seleccionar una clase (deporte, sala y coach).'
    }
    if (!formData.day_of_week) {
      errors.day_of_week = 'Debes seleccionar un día de la semana.'
    }
    if (!formData.start_time) {
      errors.start_time = 'Debes ingresar la hora de inicio.'
    }
    if (!formData.end_time) {
      errors.end_time = 'Debes ingresar la hora de término.'
    }
    if (
      formData.start_time &&
      formData.end_time &&
      formData.start_time >= formData.end_time
    ) {
      errors.end_time = `La hora de término debe ser posterior a la de inicio (${formData.start_time}).`
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (!validate()) return

    handleSave({
      sport_room_id: Number(formData.sport_room_id),
      day_of_week: Number(formData.day_of_week),
      start_time: formData.start_time,
      end_time: formData.end_time,
      status: formData.status,
    })
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedSchedule ? 'Editar Horario' : 'Nuevo Horario'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit} noValidate>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Clase (Deporte — Sala — Coach)</Form.Label>
            <Form.Select
              name="sport_room_id"
              value={formData.sport_room_id}
              onChange={handleChange}
              isInvalid={!!fieldErrors.sport_room_id}
            >
              <option value="">Selecciona una clase...</option>
              {assignments.map((assignment) => (
                <option key={assignment.id} value={assignment.id}>
                  {assignmentLabel(assignment)}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {fieldErrors.sport_room_id}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Día de la semana</Form.Label>
            <Form.Select
              name="day_of_week"
              value={formData.day_of_week}
              onChange={handleChange}
              isInvalid={!!fieldErrors.day_of_week}
            >
              <option value="">Selecciona un día...</option>
              {DAYS_OF_WEEK.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {fieldErrors.day_of_week}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Hora de inicio</Form.Label>
            <Form.Control
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              isInvalid={!!fieldErrors.start_time}
            />
            <Form.Control.Feedback type="invalid">
              {fieldErrors.start_time}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Hora de término</Form.Label>
            <Form.Control
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              isInvalid={!!fieldErrors.end_time}
            />
            <Form.Control.Feedback type="invalid">
              {fieldErrors.end_time}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="schedule-status-modal"
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

export default ScheduleFormModal
