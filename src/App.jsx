import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { HashRouter, Routes, Route } from 'react-router'
import Home from './components/Home'
import AboutMe from './components/AboutMe'

function App() {
  return <HashRouter>
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/about' element={<AboutMe/>}></Route>
    </Routes>
  </HashRouter>
}

export default App
