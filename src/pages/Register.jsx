import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { authApi } from '../services/api';
import logo from '../assets/logo_empresa_letra_v1.png';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm_password: '', birth_date: '' });
  const [fieldErrors, setFieldErrors] = useState({ full_name: '', email: '', password: '', confirm_password: '', birth_date: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const errors = { full_name: '', email: '', password: '', confirm_password: '', birth_date: '' };
    let valid = true;

    if (form.full_name.trim().length < 3) {
      errors.full_name = 'El nombre debe tener al menos 3 caracteres.';
      valid = false;
    }

    if (!form.email.trim()) {
      errors.email = 'El correo es obligatorio.';
      valid = false;
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      errors.email = 'Ingresa un correo válido.';
      valid = false;
    }

    if (form.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres.';
      valid = false;
    }

    if (form.confirm_password !== form.password) {
      errors.confirm_password = 'Las contraseñas no coinciden.';
      valid = false;
    }

    if (form.birth_date) {
      const today = new Date();
      const birth = new Date(form.birth_date);
      if (birth >= today) {
        errors.birth_date = 'La fecha de nacimiento debe ser anterior a hoy.';
        valid = false;
      }
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
      await authApi.register({
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        ...(form.birth_date && { birth_date: form.birth_date }),
      });
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3">
      <Card className="shadow w-100" style={{ maxWidth: 420 }}>
        <Card.Body className="p-4">
          <img src={logo} width="220" alt="SportClub" className="d-block mx-auto mb-3" />
          <h5 className="text-center text-muted mb-4">Crear cuenta</h5>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-3" controlId="full_name">
              <Form.Label>Nombre completo</Form.Label>
              <Form.Control
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                autoComplete="name"
                placeholder="Juan Pérez"
                isInvalid={!!fieldErrors.full_name}
              />
              <Form.Control.Feedback type="invalid">{fieldErrors.full_name}</Form.Control.Feedback>
            </Form.Group>

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
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
                isInvalid={!!fieldErrors.password}
              />
              <Form.Control.Feedback type="invalid">{fieldErrors.password}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirm_password">
              <Form.Label>Confirmar contraseña</Form.Label>
              <Form.Control
                type="password"
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder="Repite tu contraseña"
                isInvalid={!!fieldErrors.confirm_password}
              />
              <Form.Control.Feedback type="invalid">{fieldErrors.confirm_password}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="birth_date">
              <Form.Label>Fecha de nacimiento <span className="text-muted">(opcional)</span></Form.Label>
              <Form.Control
                type="date"
                name="birth_date"
                value={form.birth_date}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                isInvalid={!!fieldErrors.birth_date}
              />
              <Form.Control.Feedback type="invalid">{fieldErrors.birth_date}</Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100" disabled={loading}>
              {loading && <Spinner as="span" animation="border" size="sm" className="me-2" />}
              {loading ? 'Registrando...' : 'Crear cuenta'}
            </Button>
          </Form>

          <p className="text-center text-muted small mt-3 mb-0">
            ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
          </p>
        </Card.Body>
      </Card>
    </div>
  );
}
