import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home'
import Jobs from './pages/Jobs'
import Companies from './pages/Companies'
import Employers from './pages/Employers'
import About from './pages/About'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import Credentials from './pages/Credentials'

export default function App() {
  return (
    <div className="app-root">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/employers" element={<Employers />} />
          <Route path="/about" element={<About />} />
          <Route path="/credentials" element={<Credentials />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
    </div>
  )
}
