import { createContext } from "react";

const StravaLoginStatusContext = createContext({
  authData: null,
  setAuthData: () => {}
});

export default StravaLoginStatusContext;