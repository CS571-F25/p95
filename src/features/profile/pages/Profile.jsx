import { useState, useEffect, useContext } from 'react';
import { Button, Container } from 'react-bootstrap';
import StravaLoginStatusContext from '../../strava/context/StravaLoginStatusContext';

export default function Profile() {
  const [heatLevel, setHeatLevel] = useState(3);
  const { authData } = useContext(StravaLoginStatusContext);

  useEffect(() => {
    const saved = localStorage.getItem('roastCoachHeat');
    if (saved) {
      setHeatLevel(parseInt(saved));
    }
  }, []);

  const handleHeatChange = (level) => {
    setHeatLevel(level);
    localStorage.setItem('roastCoachHeat', level.toString());
  };

  const handleClear = () => {
    handleHeatChange(3);
  };

  return (
    <Container>
      <h2>User Preferences</h2>

      

      {/* Clear Button */}
      <Button
        onClick={handleClear}
      >
        Clear
      </Button>
    </Container>
  );
}