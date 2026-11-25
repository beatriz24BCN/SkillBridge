import React from 'react'
import { NavLink } from 'react-router-dom'
import './UserSidebar.css'
import { useAuth } from '../../context/AuthContext'

export default function UserSidebar(){
  const { logout } = useAuth()
  return (
    <aside className="user-sidebar">
      <nav className="user-nav">
        <NavLink to="/dashboard" className={({isActive})=> isActive? 'active':''}>Dashboard</NavLink>
        <NavLink to="/profile" className={({isActive})=> isActive? 'active':''}>My Profile</NavLink>
        <NavLink to="/applications" className={({isActive})=> isActive? 'active':''}>My Applications</NavLink>
        <NavLink to="/saved-jobs" className={({isActive})=> isActive? 'active':''}>Saved Jobs</NavLink>
        <NavLink to="/messages" className={({isActive})=> isActive? 'active':''}>Messages</NavLink>
        <NavLink to="/settings" className={({isActive})=> isActive? 'active':''}>Settings</NavLink>
        <button type="button" className="user-logout" onClick={logout}>Logout</button>
      </nav>
    </aside>
  )
}
