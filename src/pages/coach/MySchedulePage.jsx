import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import Badge from 'react-bootstrap/Badge';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { getCoachSchedules } from '../../services/coachService';
import { showApiError } from '../../utils/alerts';
import { DAYS_OF_WEEK, dayName, formatTime } from '../../utils/schedule';

export default function MySchedulePage() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dayFilter, setDayFilter] = useState('');
  const [search, setSearch] = useState('');

  const loadSchedules = () => {
    getCoachSchedules()
      .then((data) => setSchedules(data))
      .catch((error) => showApiError(error, 'No se pudo cargar tu horario'))
      .finally(() => setLoading(false));
  };

  const handleRefresh = () => {
    setLoading(true);
    loadSchedules();
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const filteredSchedules = schedules.filter((schedule) => {
    const matchesDay = !dayFilter || Number(schedule.day_of_week) === Number(dayFilter);
    const sportRoom = schedule.sportRoom;
    const matchesSearch = `${sportRoom?.sport?.name || ''} ${sportRoom?.room?.name || ''} ${sportRoom?.room?.location || ''}`
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesDay && matchesSearch;
  });

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <Row className="align-items-center g-2">
          <Col xs={12} lg>
            <h4 className="mb-0 d-flex align-items-center gap-2">
              Mi Horario de Clases
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
                placeholder="Buscar deporte, sala..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ minWidth: 220 }}
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
            <p className="mt-2 text-muted">Cargando horario...</p>
          </div>
        ) : (
          <Table responsive striped bordered hover className="align-middle">
            <thead className="table-light">
              <tr>
                <th>ID Bloque</th>
                <th>Día</th>
                <th className="text-center">Hora de Clase</th>
                <th>Deporte</th>
                <th>Sala</th>
                <th>Ubicación</th>
                <th className="text-center">Capacidad Máx.</th>
                <th className="text-center">Estado del Bloque</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchedules.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-muted py-4">
                    {schedules.length === 0
                      ? 'No tienes horarios registrados actualmente.'
                      : 'Sin resultados para los filtros aplicados.'}
                  </td>
                </tr>
              ) : (
                filteredSchedules.map((schedule) => (
                  <tr key={schedule.id}>
                    <td>{schedule.id}</td>
                    <td className="fw-semibold">{dayName(schedule.day_of_week)}</td>
                    <td className="text-center text-nowrap">
                      <Badge bg="info" text="dark">
                        {formatTime(schedule.start_time)} – {formatTime(schedule.end_time)}
                      </Badge>
                    </td>
                    <td className="fw-semibold text-primary">
                      {schedule.sportRoom?.sport?.name || '—'}
                    </td>
                    <td className="fw-semibold">{schedule.sportRoom?.room?.name || '—'}</td>
                    <td>{schedule.sportRoom?.room?.location || '—'}</td>
                    <td className="text-center">
                      <Badge bg="secondary">
                        {schedule.sportRoom?.room?.capacity || 0} pers.
                      </Badge>
                    </td>
                    <td className="text-center">
                      <Badge bg={schedule.status ? 'success' : 'secondary'}>
                        {schedule.status ? 'Activo' : 'Inactivo'}
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
