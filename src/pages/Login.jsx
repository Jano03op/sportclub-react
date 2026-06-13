import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { useAuth } from '../context/useAuth';
import logo from '../assets/logo_empresa_letra_v1.png';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate(`/${user.role}/dashboard`, { replace: true });
    return null;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const errors = { email: '', password: '' };
    let valid = true;

    if (!form.email.trim()) {
      errors.email = 'El correo es obligatorio.';
      valid = false;
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      errors.email = 'Ingresa un correo válido.';
      valid = false;
    }

    if (!form.password) {
      errors.password = 'La contraseña es obligatoria.';
      valid = false;
    }

    setFieldErrors(errors);
    return valid;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      const loggedUser = await login(form.email.trim().toLowerCase(), form.password);
      navigate(`/${loggedUser.role}/dashboard`, { replace: true });
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3">
      <Card className="shadow w-100" style={{ maxWidth: 420 }}>
        <Card.Body className="p-4">
          <img src={logo} width="220" alt="SportClub" className="d-block mx-auto mb-3" />
          <h5 className="text-center text-muted mb-4">Iniciar sesión</h5>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                placeholder="usuario@email.com"
                isInvalid={!!fieldErrors.email}
              />
              <Form.Control.Feedback type="invalid">{fieldErrors.email}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                placeholder="••••••••"
                isInvalid={!!fieldErrors.password}
              />
              <Form.Control.Feedback type="invalid">{fieldErrors.password}</Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100" disabled={loading}>
              {loading && <Spinner as="span" animation="border" size="sm" className="me-2" />}
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </Form>

          <p className="text-center small mt-3 mb-1">
            <Link to="/recover">¿Olvidaste tu contraseña?</Link>
          </p>
          <p className="text-center text-muted small mb-0">
            ¿No tienes cuenta? <Link to="/register">Registrarse</Link>
          </p>
        </Card.Body>
      </Card>
    </div>
  );
}
