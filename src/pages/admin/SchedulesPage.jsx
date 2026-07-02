import { useEffect, useState } from 'react'
import { Badge, Button, Card, Col, Form, Row, Spinner, Table } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { showApiError } from '../../utils/alerts'
import { DAYS_OF_WEEK, assignmentLabel, dayName, formatTime } from '../../utils/schedule'
import ScheduleFormModal from '../../components/schedules/ScheduleFormModal'
import {
  createSchedule,
  deleteSchedule,
  getSchedules,
  updateSchedule,
} from '../../services/scheduleService'
import { getSportRooms } from '../../services/sportRoomService'

function SchedulesPage() {
  const [schedules, setSchedules] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState(null)
  const [search, setSearch] = useState('')
  const [dayFilter, setDayFilter] = useState('')

  const loadSchedules = () =>
    getSchedules()
      .then((data) => setSchedules(data))
      .catch((error) => showApiError(error, 'No se pudieron cargar los horarios'))
      .finally(() => setLoading(false))

  const reloadSchedules = () => {
    setLoading(true)
    loadSchedules()
  }

  // Carga la tabla y las asignaciones para el select del modal
  useEffect(() => {
    loadSchedules()
    getSportRooms()
      .then((data) => setAssignments(data))
      .catch((error) => showApiError(error, 'No se pudieron cargar las asignaciones'))
  }, [])

  const filteredSchedules = schedules.filter((schedule) => {
    const matchesDay = !dayFilter || Number(schedule.day_of_week) === Number(dayFilter)
    const sportRoom = schedule.sportRoom
    const matchesSearch = `${sportRoom?.sport?.name || ''} ${sportRoom?.room?.name || ''} ${sportRoom?.coach?.full_name || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
    return matchesDay && matchesSearch
  })

  const openCreateModal = () => {
    setSelectedSchedule(null)
    setShowModal(true)
  }

  const openEditModal = (schedule) => {
    setSelectedSchedule(schedule)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedSchedule(null)
  }

  const handleSave = async (formData) => {
    try {
      if (selectedSchedule) {
        await updateSchedule(selectedSchedule.id, formData)
        Swal.fire('Actualizado', 'Horario actualizado correctamente.', 'success')
      } else {
        await createSchedule(formData)
        Swal.fire('Creado', 'Horario creado correctamente.', 'success')
      }
      closeModal()
      reloadSchedules()
    } catch (error) {
      showApiError(
        error,
        selectedSchedule
          ? 'No se pudo actualizar el horario'
          : 'No se pudo crear el horario'
      )
    }
  }

  const handleDelete = async (schedule) => {
    const result = await Swal.fire({
      title: '¿Eliminar horario?',
      text: `Se eliminará el horario de "${assignmentLabel(schedule.sportRoom)}" (${dayName(schedule.day_of_week)} ${formatTime(schedule.start_time)}–${formatTime(schedule.end_time)}).`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
    })

    if (result.isConfirmed) {
      try {
        await deleteSchedule(schedule.id)
        Swal.fire('Eliminado', 'Horario eliminado correctamente.', 'success')
        reloadSchedules()
      } catch (error) {
        showApiError(error, 'No se pudo eliminar el horario')
      }
    }
  }

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <Row className="align-items-center g-2">
          <Col xs={12} lg>
            <h4 className="mb-0 d-flex align-items-center gap-2">
              Gestión de Horarios
              <Badge bg="secondary" pill>
                {filteredSchedules.length}
              </Badge>
            </h4>
          </Col>
          <Col xs={12} lg="auto">
            <div className="d-flex flex-wrap gap-2">
              <Form.Select
                value={dayFilter}
                onChange={(e) => setDayFilter(e.target.value)}
                style={{ maxWidth: 160 }}
                aria-label="Filtrar por día"
              >
                <option value="">Todos los días</option>
                {DAYS_OF_WEEK.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </Form.Select>
              <Form.Control
                type="search"
                placeholder="Buscar por deporte, sala o coach..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ minWidth: 250 }}
              />
              <Button variant="outline-secondary" onClick={reloadSchedules}>
                Refrescar
              </Button>
              <Button variant="primary" onClick={openCreateModal}>
                Nuevo Horario
              </Button>
            </div>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="text-center p-4">
            <Spinner animation="border" />
            <p className="mt-2">Cargando horarios...</p>
          </div>
        ) : (
          <Table responsive striped bordered hover className="align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Deporte</th>
                <th>Sala</th>
                <th>Coach</th>
                <th>Día</th>
                <th className="text-center">Horario</th>
                <th className="text-center">Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchedules.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-muted py-4">
                    {schedules.length === 0
                      ? 'Sin horarios registrados. Crea el primero con "Nuevo Horario".'
                      : 'Sin resultados para la búsqueda o el filtro aplicado.'}
                  </td>
                </tr>
              ) : (
                filteredSchedules.map((schedule) => (
                  <tr key={schedule.id}>
                    <td>{schedule.id}</td>
                    <td className="fw-semibold">
                      {schedule.sportRoom?.sport?.name || '—'}
                    </td>
                    <td>{schedule.sportRoom?.room?.name || '—'}</td>
                    <td>{schedule.sportRoom?.coach?.full_name || '—'}</td>
                    <td>{dayName(schedule.day_of_week)}</td>
                    <td className="text-center text-nowrap">
                      <Badge bg="info" text="dark">
                        {formatTime(schedule.start_time)} – {formatTime(schedule.end_time)}
                      </Badge>
                    </td>
                    <td className="text-center">
                      <Badge bg={schedule.status ? 'success' : 'secondary'}>
                        {schedule.status ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="text-center text-nowrap">
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => openEditModal(schedule)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(schedule)}
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
      <ScheduleFormModal
        key={selectedSchedule ? `edit-${selectedSchedule.id}` : `create-${showModal}`}
        show={showModal}
        handleClose={closeModal}
        handleSave={handleSave}
        selectedSchedule={selectedSchedule}
        assignments={assignments}
      />
    </Card>
  )
}

export default SchedulesPage
