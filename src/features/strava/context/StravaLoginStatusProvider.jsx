import { useEffect, useState } from "react";
import StravaLoginStatusContext from "./StravaLoginStatusContext";

export default function StravaLoginStatusProvider({ children }) {
  const [authData, setAuthData] = useState(null);

  const login = async (data) => {
    let nextAuth;

    // Compute state synchronously
    setAuthData((prev) => {
      nextAuth = {
        ...prev,
        ...data,
        athlete: data.athlete ?? prev.athlete,
      };

      localStorage.setItem('auth_data', JSON.stringify(nextAuth));

      return nextAuth;
    });

    // Do async side-effects AFTER state update
    if (nextAuth?.athlete?.firstname && nextAuth?.athlete?.lastname) {
      await generateRoastName(nextAuth);
    }
  };


  const logout = () => {
    const tempAuth = authData;
    setAuthData(null);
    setRoastName(null);
    localStorage.removeItem("auth_data");
    localStorage.removeItem(`${tempAuth.athlete.id}_username`);
    localStorage.removeItem(`heatLevel`);

    const keysToRemove = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (key && key.startsWith('strava_roast_') || key.startsWith('strava_week_roast_')) {
              keysToRemove.push(key);
        }
    }
        
    keysToRemove.forEach(key => localStorage.removeItem(key));
  };

  const [roastName, setRoastName] = useState(null);
  const [generatingRoast, setGeneratingRoast] = useState(false);

  const generateRoastName = async (data) => {

    const result = localStorage.getItem(`${data.athlete.id}_username`, false);
    if (result && !result.endsWith("The Legend")) {
      const username = result;
      setRoastName(username);
      return;
    }

    const firstName = data.athlete.firstname;
    const lastName = data.athlete.firstname;

    setGeneratingRoast(true);
    try {
      const prompt = `You're a witty gym buddy creating a playful roast nickname for athlete ${firstName} ${lastName}.

      FORMAT OPTIONS (choose the best fit):
      1. "[Roast Adjective] [LastName]" - e.g., "Half-Rep Martinez", "Quarter-Squat Johnson"
      2. "[Roast Phrase] [FirstName]" - e.g., "Cardio-Only Chris", "Skip-Day Sarah"
      3. "[FirstName] [Roast Surname Pun]" - e.g., "Mike Jog-son", "Brad Tread-mills"

      ROAST VOCABULARY (use these types of terms):
      - Incomplete effort: Half-Rep, Quarter-Squat, Almost, Kinda, Maybe
      - Avoidance: Skip-Day, Rest-Day, No-Show, Ghost
      - Low intensity: Light-Weight, Easy-Mode, Casual, Zone-Two
      - Slow pace: Slow-Mo, Turtle-Pace, Stroll
      - Poor form: Bad-Form, Wobbly, Shaky

      RULES:
      - Maximum 3 words total
      - Must include their actual first OR last name
      - Playful and teasing, not mean
      - Gym/fitness humor focused

      GOOD EXAMPLES:
      "Half-Rep Rodriguez"
      "Quarter-Squat Williams"  
      "Skip-Day Sarah"
      "Light-Weight Lopez"
      "Cardio-Only Chris"
      "Maybe-Tomorrow Mike"

      Now create ONE perfect roast nickname for ${firstName} ${lastName}.
      Return ONLY the 3-word nickname. No quotes. No explanation.`;

      const response = await fetch('https://strava-backend-eight.vercel.app/api/claude', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              messages: [
                  { role: 'user', content: prompt }
              ]
          })
      });

      const roast = await response.json();
      const nickname = roast.content[0].text.trim();
      setRoastName(nickname);

      localStorage.setItem(`${data.athlete.id}_username`, nickname)

      return nickname;
    } catch (error) {
      console.error("Failed to generate roast name:", error);
      setRoastName(`${firstName} "The Legend"`); // Fallback
    } finally {
      setGeneratingRoast(false);
    }
  };

useEffect(() => {
    const checkSavedAuth = async () => {
      try {
        const result = localStorage.getItem('auth_data');
        if (result) {
          let authData = JSON.parse(result);
          setAuthData(authData)
          
          // Check if token is expired get new authentication
          const EXPIRY_BUFFER_MS = 2 * 60 * 1000; // 2 minutes early to avoid edge case

          if (authData.expires_at && Date.now() > authData.expires_at * 1000 - EXPIRY_BUFFER_MS) {
            localStorage.removeItem('auth_data');

            if (authData.refresh_token) {
              authData = await refreshAuth(authData.refresh_token);
            }
          }

          if(authData) {
            await login(authData);
          }
        }
      } catch (error) {
        console.log('Auth validation failed:', error);
        localStorage.removeItem('auth_data');
      }
    };
    
    checkSavedAuth();
  }, []);

  async function refreshAuth(refreshToken) {
    const BACKEND_URL = 'https://strava-backend-eight.vercel.app/api/strava';

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`Token exchange failed: ${response.status} - ${errorData.error || errorData.message}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Login error:', error);
    }

    return null;
  }

  return (
    <StravaLoginStatusContext.Provider 
      value={{ 
        authData, 
        login, 
        logout,
        roastName,
        generatingRoast,
        isAuthenticated: !!authData 
      }}
    >
      {children}
    </StravaLoginStatusContext.Provider>
  );
}