import './App.css'
import { HashRouter, Routes, Route } from 'react-router'
import AboutMe from './components/nav/pages/AboutMe'
import Home from './components/nav/pages/Home'
import RoastCoach from './components/nav/pages/RoastCoach'

export default function App() {
  return <HashRouter>
    <Routes>
      <Route path='/' element={<RoastCoach/>}>
          <Route index element={<Home/>}></Route>
          <Route path='/about' element={<AboutMe/>}></Route>
      </Route>
    </Routes>
  </HashRouter>
}