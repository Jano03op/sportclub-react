import { useEffect, useState } from 'react'
import { Badge, Button, Card, Col, Form, Row, Spinner, Table } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { showApiError } from '../../utils/alerts'
import { formatDate } from '../../utils/format'
import SportFormModal from '../../components/sports/SportFormModal'
import {
  changeSportStatus,
  createSport,
  deleteSport,
  getSports,
  updateSport,
} from '../../services/sportService'

function SportsPage() {
  const [sports, setSports] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedSport, setSelectedSport] = useState(null)
  const [search, setSearch] = useState('')

  const loadSports = () =>
    getSports()
      .then((data) => setSports(data))
      .catch((error) => Swal.fire('Error', error.message, 'error'))
      .finally(() => setLoading(false))

  const reloadSports = () => {
    setLoading(true)
    loadSports()
  }

  useEffect(() => {
    loadSports()
  }, [])

  const filteredSports = sports.filter((sport) =>
    `${sport.name} ${sport.objective}`.toLowerCase().includes(search.toLowerCase())
  )

  const openCreateModal = () => {
    setSelectedSport(null)
    setShowModal(true)
  }

  const openEditModal = (sport) => {
    setSelectedSport(sport)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedSport(null)
  }

  const handleSave = async (formData) => {
    try {
      if (selectedSport) {
        await updateSport(selectedSport.id, formData)
        Swal.fire('Actualizado', 'Deporte actualizado correctamente.', 'success')
      } else {
        await createSport(formData)
        Swal.fire('Creado', 'Deporte creado correctamente.', 'success')
      }
      closeModal()
      reloadSports()
    } catch (error) {
      showApiError(
        error,
        selectedSport ? 'No se pudo actualizar el deporte' : 'No se pudo crear el deporte'
      )
    }
  }

  const handleDelete = async (sport) => {
    const result = await Swal.fire({
      title: '¿Está seguro de eliminar este deporte?',
      text: `Se eliminará "${sport.name}" permanentemente.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
    })

    if (result.isConfirmed) {
      try {
        await deleteSport(sport.id)
        Swal.fire('Eliminado', 'Deporte eliminado correctamente.', 'success')
        reloadSports()
      } catch (error) {
        showApiError(error, 'No se pudo eliminar el deporte')
      }
    }
  }

  const handleStatusChange = async (sport) => {
    try {
      await changeSportStatus(sport.id, !sport.status)
      setSports((prev) =>
        prev.map((s) => (s.id === sport.id ? { ...s, status: !s.status } : s))
      )
    } catch (error) {
      showApiError(error, 'No se pudo cambiar el estado del deporte')
    }
  }

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <Row className="align-items-center g-2">
          <Col xs={12} md>
            <h4 className="mb-0 d-flex align-items-center gap-2">
              Gestión de Deportes
              <Badge bg="secondary" pill>
                {filteredSports.length}
              </Badge>
            </h4>
          </Col>
          <Col xs={12} md="auto">
            <div className="d-flex flex-wrap gap-2">
              <Form.Control
                type="search"
                placeholder="Buscar por nombre u objetivo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ minWidth: 250 }}
              />
              <Button variant="outline-secondary" onClick={reloadSports}>
                Refrescar
              </Button>
              <Button variant="primary" onClick={openCreateModal}>
                Nuevo Deporte
              </Button>
            </div>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="text-center p-4">
            <Spinner animation="border" />
            <p className="mt-2">Cargando deportes...</p>
          </div>
        ) : (
          <Table responsive striped bordered hover className="align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Objetivo</th>
                <th className="text-center">Duración</th>
                <th className="text-center">Estado</th>
                <th>Fecha de Creación</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredSports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-4">
                    {sports.length === 0
                      ? 'Sin deportes registrados. Crea el primero con "Nuevo Deporte".'
                      : `Sin resultados para "${search}".`}
                  </td>
                </tr>
              ) : (
                filteredSports.map((sport) => (
                  <tr key={sport.id}>
                    <td>{sport.id}</td>
                    <td className="fw-semibold">{sport.name}</td>
                    <td
                      className="text-truncate"
                      style={{ maxWidth: 260 }}
                      title={sport.objective}
                    >
                      {sport.objective}
                    </td>
                    <td className="text-center">
                      <Badge bg="info" text="dark">
                        {sport.duration} min
                      </Badge>
                    </td>
                    <td className="text-center">
                      <Form.Check
                        type="switch"
                        id={`status-switch-${sport.id}`}
                        checked={sport.status}
                        onChange={() => handleStatusChange(sport)}
                        className="d-inline-block"
                        label={
                          <Badge bg={sport.status ? 'success' : 'secondary'}>
                            {sport.status ? 'Activo' : 'Inactivo'}
                          </Badge>
                        }
                      />
                    </td>
                    <td>{formatDate(sport.created_at)}</td>
                    <td className="text-center text-nowrap">
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => openEditModal(sport)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(sport)}
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
      <SportFormModal
        key={selectedSport ? `edit-${selectedSport.id}` : `create-${showModal}`}
        show={showModal}
        handleClose={closeModal}
        handleSave={handleSave}
        selectedSport={selectedSport}
      />
    </Card>
  )
}

export default SportsPage
