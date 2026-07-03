import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { dayName, formatTime } from '../../utils/schedule';

export default function ReservationModal({ show, handleClose, handleSave, schedule }) {
  const [observation, setObservation] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!schedule) return null;

  const sportName = schedule.sportRoom?.sport?.name || 'Deporte';
  const roomName = schedule.sportRoom?.room?.name || 'Sala';
  // Los endpoints de member solo exponen el email del coach (no full_name)
  const coachName =
    schedule.sportRoom?.coach?.full_name || schedule.sportRoom?.coach?.email || 'Sin asignar';
  const day = dayName(schedule.day_of_week);
  const timeSlot = `${formatTime(schedule.start_time)} – ${formatTime(schedule.end_time)}`;

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // El backend hace observation.length al validar, por lo que enviar
      // null lo rompe: siempre se envía string (vacío si no se escribió nada)
      await handleSave({
        class_schedule_id: schedule.id,
        observation: observation.trim(),
      });
      setObservation('');
    } catch {
      // El error se manejará en el componente padre
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Reserva</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <div className="mb-4 p-3 bg-light rounded border">
            <h6 className="text-primary fw-bold mb-2">{sportName}</h6>
            <div className="small text-muted mb-1">
              <strong>Sala:</strong> {roomName}
            </div>
            <div className="small text-muted mb-1">
              <strong>Entrenador:</strong> {coachName}
            </div>
            <div className="small text-muted mb-1">
              <strong>Día:</strong> {day}
            </div>
            <div className="small text-muted">
              <strong>Horario:</strong> {timeSlot}
            </div>
          </div>

          <Form.Group controlId="reservationObservation" className="mb-3">
            <Form.Label>Observaciones (Opcional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Ej: Tengo una lesión leve en la rodilla, primera vez asistiendo, etc."
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              disabled={submitting}
              maxLength={255}
            />
            <Form.Text className="text-muted">
              Máximo 255 caracteres.
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button variant="success" type="submit" disabled={submitting}>
            {submitting ? 'Reservando...' : 'Confirmar Reserva'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
