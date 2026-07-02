import { useEffect, useState } from 'react';
import { Badge, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { authApi } from '../services/api';
import { useAuth } from '../context/useAuth';
import { showApiError } from '../utils/alerts';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const roleLabel = { user: 'Usuario', coach: 'Entrenador', admin: 'Administrador' };
const roleBadge = { admin: 'danger', coach: 'success', user: 'primary' };

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);

  const [profileForm, setProfileForm] = useState({ full_name: '', email: '', birth_date: '' });
  const [profileErrors, setProfileErrors] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [savingPassword, setSavingPassword] = useState(false);

  // El user del contexto viene del login y no incluye birth_date,
  // por eso se piden los datos completos a /auth/me al entrar
  useEffect(() => {
    authApi
      .me()
      .then((res) => {
        const me = res.data;
        setProfileForm({
          full_name: me.full_name || '',
          email: me.email || '',
          birth_date: me.birth_date || '',
        });
      })
      .catch((error) => showApiError(error, 'No se pudo cargar tu perfil'))
      .finally(() => setLoading(false));
  }, []);

  function handleProfileChange(e) {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
    setProfileErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function handlePasswordChange(e) {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setPasswordErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validateProfile() {
    const errors = {};
    const fullName = profileForm.full_name.trim();
    const email = profileForm.email.trim();

    if (!fullName) {
      errors.full_name = 'El nombre completo es obligatorio.';
    } else if (fullName.length < 3) {
      errors.full_name = 'El nombre debe tener al menos 3 caracteres.';
    } else if (fullName.length > 150) {
      errors.full_name = 'El nombre no puede superar los 150 caracteres.';
    }

    if (!email) {
      errors.email = 'El correo es obligatorio.';
    } else if (!EMAIL_REGEX.test(email)) {
      errors.email = 'Ingresa un correo válido, por ejemplo: nombre@dominio.cl';
    } else if (email.length > 150) {
      errors.email = 'El correo no puede superar los 150 caracteres.';
    }

    if (profileForm.birth_date && new Date(profileForm.birth_date) >= new Date()) {
      errors.birth_date = 'La fecha de nacimiento debe ser anterior a hoy.';
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function validatePassword() {
    const errors = {};

    if (!passwordForm.current_password) {
      errors.current_password = 'Debes ingresar tu contraseña actual.';
    }

    if (!passwordForm.new_password) {
      errors.new_password = 'La nueva contraseña es obligatoria.';
    } else if (passwordForm.new_password.length < 8) {
      errors.new_password = `La nueva contraseña debe tener al menos 8 caracteres (llevas ${passwordForm.new_password.length}).`;
    }

    if (!passwordForm.confirm_password) {
      errors.confirm_password = 'Debes confirmar la nueva contraseña.';
    } else if (passwordForm.confirm_password !== passwordForm.new_password) {
      errors.confirm_password = 'Las contraseñas no coinciden.';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleProfileSubmit(e) {
    e.preventDefault();
    if (!validateProfile()) return;
    setSavingProfile(true);
    try {
      const res = await authApi.updateMe({
        full_name: profileForm.full_name.trim(),
        email: profileForm.email.trim().toLowerCase(),
        ...(profileForm.birth_date && { birth_date: profileForm.birth_date }),
      });
      updateUser(res.data);
      Swal.fire('Perfil actualizado', 'Tus datos se guardaron correctamente.', 'success');
    } catch (error) {
      showApiError(error, 'No se pudo actualizar tu perfil');
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    if (!validatePassword()) return;
    setSavingPassword(true);
    try {
      await authApi.changePassword(passwordForm);
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
      Swal.fire('Contraseña actualizada', 'Tu contraseña se cambió correctamente.', 'success');
    } catch (error) {
      showApiError(error, 'No se pudo cambiar la contraseña');
    } finally {
      setSavingPassword(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" />
        <p className="mt-2">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <Row className="g-4 justify-content-center">
      <Col xs={12} lg={6}>
        <Card className="shadow-sm h-100">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Mis Datos</h5>
            <Badge bg={roleBadge[user?.role] || 'secondary'}>
              {roleLabel[user?.role] || user?.role}
            </Badge>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleProfileSubmit} noValidate>
              <Form.Group className="mb-3" controlId="profile_full_name">
                <Form.Label>Nombre completo</Form.Label>
                <Form.Control
                  type="text"
                  name="full_name"
                  value={profileForm.full_name}
                  onChange={handleProfileChange}
                  isInvalid={!!profileErrors.full_name}
                />
                <Form.Control.Feedback type="invalid">
                  {profileErrors.full_name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="profile_email">
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  isInvalid={!!profileErrors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {profileErrors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="profile_birth_date">
                <Form.Label>
                  Fecha de nacimiento <span className="text-muted">(opcional)</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  name="birth_date"
                  value={profileForm.birth_date}
                  onChange={handleProfileChange}
                  max={new Date().toISOString().split('T')[0]}
                  isInvalid={!!profileErrors.birth_date}
                />
                <Form.Control.Feedback type="invalid">
                  {profileErrors.birth_date}
                </Form.Control.Feedback>
              </Form.Group>

              <Button type="submit" variant="primary" disabled={savingProfile}>
                {savingProfile && (
                  <Spinner as="span" animation="border" size="sm" className="me-2" />
                )}
                {savingProfile ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>

      <Col xs={12} lg={6}>
        <Card className="shadow-sm h-100">
          <Card.Header>
            <h5 className="mb-0">Cambiar Contraseña</h5>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handlePasswordSubmit} noValidate>
              <Form.Group className="mb-3" controlId="current_password">
                <Form.Label>Contraseña actual</Form.Label>
                <Form.Control
                  type="password"
                  name="current_password"
                  value={passwordForm.current_password}
                  onChange={handlePasswordChange}
                  autoComplete="current-password"
                  isInvalid={!!passwordErrors.current_password}
                />
                <Form.Control.Feedback type="invalid">
                  {passwordErrors.current_password}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="new_password">
                <Form.Label>Nueva contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="new_password"
                  value={passwordForm.new_password}
                  onChange={handlePasswordChange}
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
                  isInvalid={!!passwordErrors.new_password}
                />
                <Form.Control.Feedback type="invalid">
                  {passwordErrors.new_password}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="confirm_password">
                <Form.Label>Confirmar nueva contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="confirm_password"
                  value={passwordForm.confirm_password}
                  onChange={handlePasswordChange}
                  autoComplete="new-password"
                  placeholder="Repite la nueva contraseña"
                  isInvalid={!!passwordErrors.confirm_password}
                />
                <Form.Control.Feedback type="invalid">
                  {passwordErrors.confirm_password}
                </Form.Control.Feedback>
              </Form.Group>

              <Button type="submit" variant="outline-primary" disabled={savingPassword}>
                {savingPassword && (
                  <Spinner as="span" animation="border" size="sm" className="me-2" />
                )}
                {savingPassword ? 'Actualizando...' : 'Cambiar contraseña'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
