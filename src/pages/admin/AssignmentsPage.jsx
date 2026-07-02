import { useEffect, useState } from 'react'
import { Badge, Button, Card, Col, Form, Row, Spinner, Table } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { showApiError } from '../../utils/alerts'
import AssignmentFormModal from '../../components/assignments/AssignmentFormModal'
import {
  createSportRoom,
  deleteSportRoom,
  getSportRooms,
  updateSportRoom,
} from '../../services/sportRoomService'
import { getSports } from '../../services/sportService'
import { getRooms } from '../../services/roomService'
import { getUsers } from '../../services/userService'

function AssignmentsPage() {
  const [assignments, setAssignments] = useState([])
  const [sports, setSports] = useState([])
  const [rooms, setRooms] = useState([])
  const [coaches, setCoaches] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [search, setSearch] = useState('')

  const loadAssignments = () =>
    getSportRooms()
      .then((data) => setAssignments(data))
      .catch((error) => showApiError(error, 'No se pudieron cargar las asignaciones'))
      .finally(() => setLoading(false))

  const reloadAssignments = () => {
    setLoading(true)
    loadAssignments()
  }

  // Carga la tabla y las listas para los selects del modal en paralelo
  useEffect(() => {
    loadAssignments()
    Promise.all([getSports(), getRooms(), getUsers({ role: 'coach' })])
      .then(([sportsData, roomsData, coachesData]) => {
        setSports(sportsData)
        setRooms(roomsData)
        setCoaches(coachesData)
      })
      .catch((error) =>
        showApiError(error, 'No se pudieron cargar deportes, salas o coaches')
      )
  }, [])

  const filteredAssignments = assignments.filter((assignment) =>
    `${assignment.sport?.name || ''} ${assignment.room?.name || ''} ${assignment.coach?.full_name || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const openCreateModal = () => {
    setSelectedAssignment(null)
    setShowModal(true)
  }

  const openEditModal = (assignment) => {
    setSelectedAssignment(assignment)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedAssignment(null)
  }

  const handleSave = async (formData) => {
    try {
      if (selectedAssignment) {
        await updateSportRoom(selectedAssignment.id, formData)
        Swal.fire('Actualizada', 'Asignación actualizada correctamente.', 'success')
      } else {
        await createSportRoom(formData)
        Swal.fire('Creada', 'Asignación creada correctamente.', 'success')
      }
      closeModal()
      reloadAssignments()
    } catch (error) {
      showApiError(
        error,
        selectedAssignment
          ? 'No se pudo actualizar la asignación'
          : 'No se pudo crear la asignación'
      )
    }
  }

  const handleDelete = async (assignment) => {
    const schedulesCount = assignment.schedules?.length || 0
    const result = await Swal.fire({
      title: '¿Eliminar asignación?',
      text:
        `Se eliminará "${assignment.sport?.name} — ${assignment.room?.name}" permanentemente.` +
        (schedulesCount > 0
          ? ` Ojo: tiene ${schedulesCount} horario(s) asociado(s).`
          : ''),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
    })

    if (result.isConfirmed) {
      try {
        await deleteSportRoom(assignment.id)
        Swal.fire('Eliminada', 'Asignación eliminada correctamente.', 'success')
        reloadAssignments()
      } catch (error) {
        showApiError(error, 'No se pudo eliminar la asignación')
      }
    }
  }

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <Row className="align-items-center g-2">
          <Col xs={12} md>
            <h4 className="mb-0 d-flex align-items-center gap-2">
              Gestión de Asignaciones
              <Badge bg="secondary" pill>
                {filteredAssignments.length}
              </Badge>
            </h4>
          </Col>
          <Col xs={12} md="auto">
            <div className="d-flex flex-wrap gap-2">
              <Form.Control
                type="search"
                placeholder="Buscar por deporte, sala o coach..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ minWidth: 280 }}
              />
              <Button variant="outline-secondary" onClick={reloadAssignments}>
                Refrescar
              </Button>
              <Button variant="primary" onClick={openCreateModal}>
                Nueva Asignación
              </Button>
            </div>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="text-center p-4">
            <Spinner animation="border" />
            <p className="mt-2">Cargando asignaciones...</p>
          </div>
        ) : (
          <Table responsive striped bordered hover className="align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Deporte</th>
                <th>Sala</th>
                <th>Coach</th>
                <th>Observación</th>
                <th className="text-center">Horarios</th>
                <th className="text-center">Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-muted py-4">
                    {assignments.length === 0
                      ? 'Sin asignaciones registradas. Crea la primera con "Nueva Asignación".'
                      : `Sin resultados para "${search}".`}
                  </td>
                </tr>
              ) : (
                filteredAssignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td>{assignment.id}</td>
                    <td className="fw-semibold">{assignment.sport?.name || '—'}</td>
                    <td>{assignment.room?.name || '—'}</td>
                    <td>{assignment.coach?.full_name || '—'}</td>
                    <td
                      className="text-truncate"
                      style={{ maxWidth: 200 }}
                      title={assignment.observation || ''}
                    >
                      {assignment.observation || '—'}
                    </td>
                    <td className="text-center">
                      <Badge
                        bg={assignment.schedules?.length ? 'info' : 'light'}
                        text="dark"
                      >
                        {assignment.schedules?.length || 0}
                      </Badge>
                    </td>
                    <td className="text-center">
                      <Badge bg={assignment.status ? 'success' : 'secondary'}>
                        {assignment.status ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </td>
                    <td className="text-center text-nowrap">
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => openEditModal(assignment)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(assignment)}
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
      <AssignmentFormModal
        key={selectedAssignment ? `edit-${selectedAssignment.id}` : `create-${showModal}`}
        show={showModal}
        handleClose={closeModal}
        handleSave={handleSave}
        selectedAssignment={selectedAssignment}
        sports={sports}
        rooms={rooms}
        coaches={coaches}
      />
    </Card>
  )
}

export default AssignmentsPage
