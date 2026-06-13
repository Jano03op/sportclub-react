import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import logo from '../assets/logo_empresa_letra_v1.png';

export default function Recover() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3">
      <Card className="shadow w-100" style={{ maxWidth: 420 }}>
        <Card.Body className="p-4">
          <img src={logo} width="220" alt="SportClub" className="d-block mx-auto mb-3" />
          <h5 className="text-center text-muted mb-4">Recuperar contraseña</h5>

          {sent ? (
            <>
              <Alert variant="success">
                Si el correo existe, recibirás instrucciones para restablecer tu contraseña.
              </Alert>
              <p className="text-center small mb-0">
                <Link to="/login">← Volver al inicio de sesión</Link>
              </p>
            </>
          ) : (
            <>
              <Form onSubmit={handleSubmit} noValidate>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="usuario@email.com"
                  />
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                  {loading && <Spinner as="span" animation="border" size="sm" className="me-2" />}
                  {loading ? 'Enviando...' : 'Enviar instrucciones'}
                </Button>
              </Form>

              <p className="text-center small mt-3 mb-0">
                <Link to="/login">← Volver al inicio de sesión</Link>
              </p>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
