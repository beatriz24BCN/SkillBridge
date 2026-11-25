import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home'
import Jobs from './pages/Jobs'
import JobDetail from './pages/JobDetail'
import JobForm from './pages/JobForm'
import Companies from './pages/Companies'
import CompanyDetail from './pages/CompanyDetail'
import CompanyForm from './pages/CompanyForm'
import Employers from './pages/Employers'
import About from './pages/About'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import ProfileEdit from './pages/ProfileEdit'
import Applications from './pages/Applications'
import SavedJobs from './pages/SavedJobs'
import Messages from './pages/Messages'
import Settings from './pages/Settings'
import Credentials from './pages/Credentials'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <div className="app-root">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/new" element={<ProtectedRoute><JobForm /></ProtectedRoute>} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/jobs/:id/edit" element={<ProtectedRoute><JobForm /></ProtectedRoute>} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/new" element={<ProtectedRoute><CompanyForm /></ProtectedRoute>} />
          <Route path="/companies/:id" element={<CompanyDetail />} />
          <Route path="/companies/:id/edit" element={<ProtectedRoute><CompanyForm /></ProtectedRoute>} />
          <Route path="/employers" element={<Employers />} />
          <Route path="/about" element={<About />} />
          <Route path="/credentials" element={<Credentials />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/profile/edit" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
          <Route path="/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
          <Route path="/saved-jobs" element={<ProtectedRoute><SavedJobs /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  )
}
