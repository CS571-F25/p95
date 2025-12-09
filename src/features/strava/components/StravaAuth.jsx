import { useState, useEffect } from 'react';
import { useStravaAuth } from '../context/StravaLoginStatusContext';
import { Button, Container, Modal, Spinner } from 'react-bootstrap';

export default function StravaAuth({setLoginVisible}) {
  const { authData, login } = useStravaAuth();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);
    setLoginVisible(false);
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  // ---- Strava OAuth config ----
  const CLIENT_ID = '180983';
  const REDIRECT_URI = `${window.location.origin}${window.location.pathname}`;
  const SCOPE = 'read,activity:read_all,profile:read_all,activity:write';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');

    if (error) {
      console.error('Strava auth error:', error);
      return;
    }

    if (code && !authData) {
      exchangeToken(code);
    }
  }, [authData]);

  const handleLogin = () => {
    const authUrl =
      `https://www.strava.com/oauth/authorize` +
      `?client_id=${CLIENT_ID}` +
      `&redirect_uri=${REDIRECT_URI}` +
      `&response_type=code` +
      `&scope=${SCOPE}`;

    window.location.href = authUrl;
  };

  const exchangeToken = async (code) => {
    setLoading(true);

    const BACKEND_URL = 'https://strava-backend-eight.vercel.app/api/strava';

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`Token exchange failed: ${response.status} - ${errorData.error || errorData.message}`);
      }

      const data = await response.json();
      
      // No longer storing in localStorage - tokens are in HTTP-only cookies now
      // Only store the non-sensitive athlete data in context
      login(data);
      
      window.history.replaceState({}, document.title, window.location.pathname);
      setLoginVisible(false);
    } catch (error) {
      console.error('Login error:', error);
    }
    finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Modal show={loading} centered backdrop="static" keyboard={false}>
        <Modal.Body className="text-center py-4">
          <Spinner animation="border" variant="warning" className="mb-3" />
          <h5 className="mb-2">Authenticating with Strava</h5>
          <p className="text-muted mb-0">
            Please wait while we connect to your account...
          </p>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
    >
      <Modal.Body>
        <Container style={{ textAlign: "center" }}>
          <h4>Connect to Strava</h4>
          <p>Authenticate your Strava account to continue</p>

          <Button
            onClick={handleLogin}
            style={{
              backgroundColor: "#FC4C02",
              borderColor: "#FC4C02",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              margin: "0 auto"
            }}
          >
            <svg style={{ width: "20px", height: "20px" }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
            </svg>
            Connect with Strava
          </Button>
        </Container>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}