import { createContext, useContext, useState } from "react";

const StravaLoginStatusContext = createContext(null);

export function useStravaAuth() {
  const ctx = useContext(StravaLoginStatusContext);

  if (!ctx) {
    throw new Error("useStravaAuth must be used inside StravaLoginStatusProvider");
  }
  
  return ctx;
}

export function StravaLoginStatusProvider({ children }) {
  const [authData, setAuthData] = useState(null);

  const login = (data) => {
    setAuthData(data);
  };

  const logout = () => {
    setAuthData(null);
  };

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

export default StravaLoginStatusContext;