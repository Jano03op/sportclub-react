import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Card, Col, Row, Spinner, Table } from 'react-bootstrap';
import { useAuth } from '../../context/useAuth';
import { showApiError } from '../../utils/alerts';
import { dayName, formatTime } from '../../utils/schedule';
import { getUsers } from '../../services/userService';
import { getSports } from '../../services/sportService';
import { getRooms } from '../../services/roomService';
import { getSportRooms } from '../../services/sportRoomService';
import { getSchedules } from '../../services/scheduleService';

// getDay() entrega 0 = Domingo; el backend usa 1 = Lunes ... 7 = Domingo
function todayDayOfWeek() {
  const jsDay = new Date().getDay();
  return jsDay === 0 ? 7 : jsDay;
}

function StatCard({ title, value, detail, variant, onClick }) {
  return (
    <Card
      className="h-100 shadow-sm text-center"
      role="button"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <Card.Body>
        <div className={`display-6 fw-bold text-${variant}`}>{value}</div>
        <div className="fw-semibold">{title}</div>
        {detail && <small className="text-muted">{detail}</small>}
      </Card.Body>
    </Card>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [sports, setSports] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    Promise.all([getUsers(), getSports(), getRooms(), getSportRooms(), getSchedules()])
      .then(([usersData, sportsData, roomsData, assignmentsData, schedulesData]) => {
        setUsers(usersData);
        setSports(sportsData);
        setRooms(roomsData);
        setAssignments(assignmentsData);
        setSchedules(schedulesData);
      })
      .catch((error) => showApiError(error, 'No se pudieron cargar las estadísticas'))
      .finally(() => setLoading(false));
  }, []);

  const roleCount = (role) => users.filter((u) => u.role === role).length;
  const activeCount = (list) => list.filter((item) => item.status).length;

  const today = todayDayOfWeek();
  const todaySchedules = schedules
    .filter((schedule) => schedule.day_of_week === today && schedule.status)
    .sort((a, b) => String(a.start_time).localeCompare(String(b.start_time)));

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" />
        <p className="mt-2">Cargando panel...</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4">
        <h2>Bienvenido, {user?.full_name}</h2>
        <p className="text-muted mb-0">Panel de Administración — SportClub</p>
      </div>

      <Row xs={2} md={3} xl={5} className="g-3 mb-4">
        <Col>
          <StatCard
            title="Usuarios"
            value={users.length}
            detail={`${roleCount('coach')} coaches · ${roleCount('admin')} admins`}
            variant="primary"
            onClick={() => navigate('/admin/users')}
          />
        </Col>
        <Col>
          <StatCard
            title="Deportes"
            value={sports.length}
            detail={`${activeCount(sports)} activos`}
            variant="success"
            onClick={() => navigate('/admin/sports')}
          />
        </Col>
        <Col>
          <StatCard
            title="Salas"
            value={rooms.length}
            detail={`${activeCount(rooms)} activas`}
            variant="info"
            onClick={() => navigate('/admin/rooms')}
          />
        </Col>
        <Col>
          <StatCard
            title="Asignaciones"
            value={assignments.length}
            detail={`${activeCount(assignments)} activas`}
            variant="warning"
            onClick={() => navigate('/admin/assignments')}
          />
        </Col>
        <Col>
          <StatCard
            title="Horarios"
            value={schedules.length}
            detail={`${activeCount(schedules)} activos`}
            variant="danger"
            onClick={() => navigate('/admin/schedules')}
          />
        </Col>
      </Row>

      <Row className="g-4">
        <Col xs={12} lg={7}>
          <Card className="shadow-sm h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Clases de hoy — {dayName(today)}</h5>
              <Badge bg="secondary" pill>
                {todaySchedules.length}
              </Badge>
            </Card.Header>
            <Card.Body className={todaySchedules.length === 0 ? '' : 'p-0'}>
              {todaySchedules.length === 0 ? (
                <p className="text-muted text-center py-4 mb-0">
                  No hay clases programadas para hoy.
                </p>
              ) : (
                <Table responsive hover className="align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Horario</th>
                      <th>Deporte</th>
                      <th>Sala</th>
                      <th>Coach</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todaySchedules.map((schedule) => (
                      <tr key={schedule.id}>
                        <td className="text-nowrap">
                          <Badge bg="info" text="dark">
                            {formatTime(schedule.start_time)} – {formatTime(schedule.end_time)}
                          </Badge>
                        </td>
                        <td className="fw-semibold">
                          {schedule.sportRoom?.sport?.name || '—'}
                        </td>
                        <td>{schedule.sportRoom?.room?.name || '—'}</td>
                        <td>{schedule.sportRoom?.coach?.full_name || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} lg={5}>
          <Card className="shadow-sm h-100">
            <Card.Header>
              <h5 className="mb-0">Resumen del sistema</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center py-2">
                <span>Usuarios por rol</span>
                <span className="d-flex gap-1">
                  <Badge bg="primary">{roleCount('user')} usuarios</Badge>
                  <Badge bg="success">{roleCount('coach')} coaches</Badge>
                  <Badge bg="danger">{roleCount('admin')} admins</Badge>
                </span>
              </div>
              <div className="d-flex justify-content-between align-items-center py-2">
                <span>Deportes inactivos</span>
                <Badge bg={sports.length - activeCount(sports) ? 'warning' : 'success'} text="dark">
                  {sports.length - activeCount(sports)}
                </Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center py-2">
                <span>Salas inactivas</span>
                <Badge bg={rooms.length - activeCount(rooms) ? 'warning' : 'success'} text="dark">
                  {rooms.length - activeCount(rooms)}
                </Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center py-2">
                <span>Asignaciones sin horarios</span>
                <Badge
                  bg={
                    assignments.filter((a) => !a.schedules?.length).length
                      ? 'warning'
                      : 'success'
                  }
                  text="dark"
                >
                  {assignments.filter((a) => !a.schedules?.length).length}
                </Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center py-2">
                <span>Capacidad total de salas activas</span>
                <Badge bg="info" text="dark">
                  {rooms
                    .filter((room) => room.status)
                    .reduce((sum, room) => sum + (room.capacity || 0), 0)}{' '}
                  personas
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
