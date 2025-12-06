import './App.css'
import { HashRouter, Routes, Route } from 'react-router'
import { useContext } from 'react'

import StravaLoginStatusContext from './features/strava/context/StravaLoginStatusContext'

import AboutMe from './features/pages/AboutMe'
import Home from './features/pages/Home'
import StravaActivitiesPage from './features/strava/pages/StravaActivitiesPage'
import RoastCoach from './features/roastCoach/pages/RoastCoach'
import Profile from './features/profile/pages/Profile'
import WeekInRoasts from './features/weekInRoasts/pages/WeekInRoasts'

export default function App() {
  const { authData } = useContext(StravaLoginStatusContext)

  return (
    <HashRouter>
      <Routes>
          <Route path='/' element={<RoastCoach/>}>
          <Route index element={authData ? <StravaActivitiesPage /> : <Home />} />
          <Route path='about' element={<AboutMe/>} />
          <Route path='profile' element={<Profile/>} />
          <Route path='week-review' element={<WeekInRoasts/>} />
        </Route>
      </Routes>
    </HashRouter>
  )
}