import { useEffect, useState } from 'react'
import { Badge, Button, Card, Form, Spinner, Table } from 'react-bootstrap'
import Swal from 'sweetalert2'
import SportFormModal from '../../components/sports/SportFormModal'
import {
  changeSportStatus,
  createSport,
  deleteSport,
  getSports,
  updateSport,
} from '../../services/sportService'

function formatDate(dateStr) {
  const date = new Date(dateStr)
  const formatted = date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
  return formatted.replace(
    / de ([a-záéíóúñ]+) de /i,
    (_, month) => ` de ${month.charAt(0).toUpperCase()}${month.slice(1)} de `
  )
}

function SportsPage() {
  const [sports, setSports] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedSport, setSelectedSport] = useState(null)

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
      Swal.fire('Error', error.message, 'error')
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
        Swal.fire('Error', error.message, 'error')
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
      Swal.fire('Error', error.message, 'error')
    }
  }

  return (
    <Card className="shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h4 className="mb-0">Gestión de Deportes</h4>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={reloadSports}>
            Refrescar
          </Button>
          <Button variant="primary" onClick={openCreateModal}>
            Nuevo Deporte
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="text-center p-4">
            <Spinner animation="border" />
            <p className="mt-2">Cargando deportes...</p>
          </div>
        ) : (
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Objetivo</th>
                <th>Duración (min)</th>
                <th>Estado</th>
                <th>Fecha de Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-4">
                    Sin deportes registrados
                  </td>
                </tr>
              ) : (
                sports.map((sport) => (
                  <tr key={sport.id}>
                    <td>{sport.id}</td>
                    <td>{sport.name}</td>
                    <td>{sport.objective}</td>
                    <td>{sport.duration}</td>
                    <td>
                      <Form.Check
                        type="switch"
                        id={`status-switch-${sport.id}`}
                        checked={sport.status}
                        onChange={() => handleStatusChange(sport)}
                        label={
                          <Badge bg={sport.status ? 'success' : 'secondary'}>
                            {sport.status ? 'Activo' : 'Inactivo'}
                          </Badge>
                        }
                      />
                    </td>
                    <td>{formatDate(sport.created_at)}</td>
                    <td>
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
