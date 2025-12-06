import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import StravaLoginStatusProvider from './features/Strava/context/StravaLoginStatusProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StravaLoginStatusProvider>
      <App />
  </StravaLoginStatusProvider>
)
