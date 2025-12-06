import { useEffect, useState } from "react";
import StravaLoginStatusContext from "./StravaLoginStatusContext";

export default function StravaLoginStatusProvider({ children }) {
  const [authData, setAuthData] = useState(null);

  const login = (data) => {
    setAuthData(data);
  };

  const logout = () => {
    setAuthData(null);
  };

  useEffect(() => {
    const checkSavedAuth = async () => {
      try {
        const result = localStorage.getItem('auth_data', false);
        if (result) {
          const authData = JSON.parse(result);
          login(authData);
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
        isAuthenticated: !!authData 
      }}
    >
      {children}
    </StravaLoginStatusContext.Provider>
  );
}