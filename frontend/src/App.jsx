import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Prepare from './pages/Prepare'
import Recovery from './pages/Recovery'
import Report from './pages/Report'
import RequestAid from './pages/RequestAid'
import Volunteer from './pages/Volunteer'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/prepare" element={<Prepare />} />
        <Route path="/recovery" element={<Recovery />} />
        <Route path="/report" element={<Report />} />
        <Route path="/request-aid" element={<RequestAid />} />
        <Route path="/volunteer" element={<Volunteer />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App