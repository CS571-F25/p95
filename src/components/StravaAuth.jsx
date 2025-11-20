import { useState, useEffect, useContext } from 'react';
import StravaLoginStatusContext from '../contexts/StravaLoginStatusContext';
import { Button, Container, Modal } from 'react-bootstrap';

export default function StravaAuth(props) {
  const { authData, setAuthData } = useContext(StravaLoginStatusContext);
  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState(true);

  const handleClose = () => {
    setAuthData("")
    setShow(false);
    props.setLoginVisible(false);
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  // Strava OAuth configuration
  const CLIENT_ID = '180983';
  const REDIRECT_URI = `${window.location.origin}${window.location.pathname}`;
  const SCOPE = 'read,activity:read_all,profile:read_all,activity:write';

  useEffect(() => {
    // Check if returning from Strava with auth code
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
  }, []);

  const handleLogin = () => {
    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}`;
    window.location.href = authUrl;
  };

  const exchangeToken = async (code) => {
      setLoading(true);

      const BACKEND_URL = 'https://strava-backend-eight.vercel.app/api/strava';

      try {
          const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              code: code,
            }),
          });

          if (!response.ok) {
              // Read the error body if available
              const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
              throw new Error(`Token exchange failed: ${response.status} - ${errorData.error || errorData.message}`);
          }

          const data = await response.json();
          setAuthData(data);
          
          window.history.replaceState({}, document.title, window.location.pathname);
          props.setLoginVisible(false);
      } catch (err) {
          console.error('Token exchange error:', err);
      } finally {
          setLoading(false);
      }
  };

  if (loading) {
    return (
      <div>
        <div>
          <div></div>
          <p>Authenticating with Strava...</p>
        </div>
      </div>
    );
  }

  return (
    <Modal
      show={show} 
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <Container style={{textAlign:"center"}}>
          <Container>
            <h4>Connect to Strava</h4>
            <p>Authenticate your Strava account to continue</p>
          </Container>
          <Button
            onClick={handleLogin}
            style={{
              backgroundColor:"#FC4C02", 
              borderColor: "#FC4C02",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              margin: "0 auto"
            }}
          >
            <svg 
              style={{width: "20px", height: "20px"}} 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
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