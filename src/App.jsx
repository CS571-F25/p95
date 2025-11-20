import './App.css'
import { HashRouter, Routes, Route } from 'react-router'
import AboutMe from './components/nav/pages/AboutMe'
import Home from './components/nav/pages/Home'
import RoastCoach from './components/nav/pages/RoastCoach'
import Profile from './components/nav/pages/Profile'
import WeekInRoasts from './components/nav/pages/WeekInRoasts'

export default function App() {
  return <HashRouter>
    <Routes>
      <Route path='/' element={<RoastCoach/>}>
          <Route index element={<Home/>}></Route>
          <Route path='/about' element={<AboutMe/>}></Route>
          <Route path='/profile' element={<Profile/>}></Route>
          <Route path='/week-review' element={<WeekInRoasts/>}></Route>
      </Route>
    </Routes>
  </HashRouter>
}