import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import Badge from 'react-bootstrap/Badge';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { getCoachClasses } from '../../services/coachService';
import { showApiError } from '../../utils/alerts';

export default function MyClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadClasses = () => {
    getCoachClasses()
      .then((data) => setClasses(data))
      .catch((error) => showApiError(error, 'No se pudieron cargar tus clases'))
      .finally(() => setLoading(false));
  };

  const handleRefresh = () => {
    setLoading(true);
    loadClasses();
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const filteredClasses = classes.filter((item) =>
    `${item.sport?.name || ''} ${item.room?.name || ''} ${item.room?.location || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <Row className="align-items-center g-2">
          <Col xs={12} md>
            <h4 className="mb-0 d-flex align-items-center gap-2">
              Mis Clases Asignadas
              <Badge bg="secondary" pill>
                {filteredClasses.length}
              </Badge>
            </h4>
          </Col>
          <Col xs={12} md="auto">
            <div className="d-flex gap-2">
              <Form.Control
                type="search"
                placeholder="Buscar por deporte, sala o ubicación..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ minWidth: 260 }}
              />
              <Button variant="outline-secondary" onClick={handleRefresh}>
                Refrescar
              </Button>
            </div>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="text-center p-4">
            <Spinner animation="border" />
            <p className="mt-2 text-muted">Cargando tus clases...</p>
          </div>
        ) : (
          <Table responsive striped bordered hover className="align-middle">
            <thead className="table-light">
              <tr>
                <th>ID Asignación</th>
                <th>Deporte</th>
                <th>Objetivo del Deporte</th>
                <th>Duración</th>
                <th>Sala</th>
                <th className="text-center">Capacidad</th>
                <th>Ubicación</th>
                <th className="text-center">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredClasses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-muted py-4">
                    {classes.length === 0
                      ? 'No tienes clases asignadas actualmente.'
                      : `Sin resultados para "${search}".`}
                  </td>
                </tr>
              ) : (
                filteredClasses.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td className="fw-semibold text-primary">{item.sport?.name}</td>
                    <td>{item.sport?.objective || '—'}</td>
                    <td>{item.sport?.duration ? `${item.sport.duration} min` : '—'}</td>
                    <td className="fw-semibold">{item.room?.name}</td>
                    <td className="text-center">
                      <Badge bg="info" text="dark">
                        {item.room?.capacity} pers.
                      </Badge>
                    </td>
                    <td>{item.room?.location || '—'}</td>
                    <td className="text-center">
                      <Badge bg={item.status ? 'success' : 'secondary'}>
                        {item.status ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}
