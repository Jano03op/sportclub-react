import { useEffect, useState } from 'react'
import { Badge, Button, Card, Col, Form, Row, Spinner, Table } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { showApiError } from '../../utils/alerts'
import { formatDate } from '../../utils/format'
import RoomFormModal from '../../components/rooms/RoomFormModal'
import { createRoom, deleteRoom, getRooms, updateRoom } from '../../services/roomService'

function RoomsPage() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [search, setSearch] = useState('')

  const loadRooms = () =>
    getRooms()
      .then((data) => setRooms(data))
      .catch((error) => showApiError(error, 'No se pudieron cargar las salas'))
      .finally(() => setLoading(false))

  const reloadRooms = () => {
    setLoading(true)
    loadRooms()
  }

  useEffect(() => {
    loadRooms()
  }, [])

  const filteredRooms = rooms.filter((room) =>
    `${room.name} ${room.description} ${room.location || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const openCreateModal = () => {
    setSelectedRoom(null)
    setShowModal(true)
  }

  const openEditModal = (room) => {
    setSelectedRoom(room)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedRoom(null)
  }

  const handleSave = async (formData) => {
    try {
      if (selectedRoom) {
        await updateRoom(selectedRoom.id, formData)
        Swal.fire('Actualizada', 'Sala actualizada correctamente.', 'success')
      } else {
        await createRoom(formData)
        Swal.fire('Creada', 'Sala creada correctamente.', 'success')
      }
      closeModal()
      reloadRooms()
    } catch (error) {
      showApiError(
        error,
        selectedRoom ? 'No se pudo actualizar la sala' : 'No se pudo crear la sala'
      )
    }
  }

  const handleDelete = async (room) => {
    const result = await Swal.fire({
      title: '¿Eliminar sala?',
      text: `Se eliminará "${room.name}" permanentemente.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
    })

    if (result.isConfirmed) {
      try {
        await deleteRoom(room.id)
        Swal.fire('Eliminada', 'Sala eliminada correctamente.', 'success')
        reloadRooms()
      } catch (error) {
        showApiError(error, 'No se pudo eliminar la sala')
      }
    }
  }

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <Row className="align-items-center g-2">
          <Col xs={12} md>
            <h4 className="mb-0 d-flex align-items-center gap-2">
              Gestión de Salas
              <Badge bg="secondary" pill>
                {filteredRooms.length}
              </Badge>
            </h4>
          </Col>
          <Col xs={12} md="auto">
            <div className="d-flex flex-wrap gap-2">
              <Form.Control
                type="search"
                placeholder="Buscar por nombre, descripción o ubicación..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ minWidth: 280 }}
              />
              <Button variant="outline-secondary" onClick={reloadRooms}>
                Refrescar
              </Button>
              <Button variant="primary" onClick={openCreateModal}>
                Nueva Sala
              </Button>
            </div>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="text-center p-4">
            <Spinner animation="border" />
            <p className="mt-2">Cargando salas...</p>
          </div>
        ) : (
          <Table responsive striped bordered hover className="align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th className="text-center">Capacidad</th>
                <th>Ubicación</th>
                <th>Observación</th>
                <th className="text-center">Estado</th>
                <th>Creada</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center text-muted py-4">
                    {rooms.length === 0
                      ? 'Sin salas registradas. Crea la primera con "Nueva Sala".'
                      : `Sin resultados para "${search}".`}
                  </td>
                </tr>
              ) : (
                filteredRooms.map((room) => (
                  <tr key={room.id}>
                    <td>{room.id}</td>
                    <td className="fw-semibold">{room.name}</td>
                    <td
                      className="text-truncate"
                      style={{ maxWidth: 220 }}
                      title={room.description}
                    >
                      {room.description}
                    </td>
                    <td className="text-center">
                      <Badge bg="info" text="dark">
                        {room.capacity} pers.
                      </Badge>
                    </td>
                    <td>{room.location || '—'}</td>
                    <td
                      className="text-truncate"
                      style={{ maxWidth: 160 }}
                      title={room.observation || ''}
                    >
                      {room.observation || '—'}
                    </td>
                    <td className="text-center">
                      <Badge bg={room.status ? 'success' : 'secondary'}>
                        {room.status ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </td>
                    <td>{formatDate(room.created_at)}</td>
                    <td className="text-center text-nowrap">
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => openEditModal(room)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(room)}
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
      <RoomFormModal
        key={selectedRoom ? `edit-${selectedRoom.id}` : `create-${showModal}`}
        show={showModal}
        handleClose={closeModal}
        handleSave={handleSave}
        selectedRoom={selectedRoom}
      />
    </Card>
  )
}

export default RoomsPage
