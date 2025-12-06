import { useEffect, useState } from "react";
import StravaLoginStatusContext from "./StravaLoginStatusContext";

export default function StravaLoginStatusProvider({ children }) {
  const [authData, setAuthData] = useState(null);

  const login = async (data) => {
    setAuthData(data);

    if (data.athlete?.firstname && data.athlete?.lastname) {
      await generateRoastName(data.athlete.firstname, data.athlete.lastname);
    }
  };

  const logout = () => {
    setAuthData(null);
  };

  const [roastName, setRoastName] = useState(null);
  const [generatingRoast, setGeneratingRoast] = useState(false);

  const generateRoastName = async (firstName, lastName) => {
    setGeneratingRoast(true);
    try {
      const prompt = `Create a funny, playful roast nickname for an athlete named ${firstName} ${lastName}. Make it witty but not mean-spirited. Return ONLY the nickname, nothing else.`

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

      const data = await response.json();
      const nickname = data.content[0].text.trim();
      setRoastName(nickname);
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
        const result = localStorage.getItem('auth_data', false);
        if (result) {
          const authData = JSON.parse(result);
          await login(authData);
        }
      } catch (error) {
        console.log('No saved auth data');
      }
    };
    
    checkSavedAuth();
  }, []);

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