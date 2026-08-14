import React from 'react'
import { NavLink } from 'react-router-dom'
import './UserSidebar.css'

export default function UserSidebar(){
  return (
    <aside className="user-sidebar">
      <nav className="user-nav">
        <NavLink to="/dashboard" className={({isActive})=> isActive? 'active':''}>Dashboard</NavLink>
        <NavLink to="/profile" className={({isActive})=> isActive? 'active':''}>My Profile</NavLink>
        <NavLink to="/applications" className={({isActive})=> isActive? 'active':''}>My Applications</NavLink>
        <NavLink to="/saved-jobs" className={({isActive})=> isActive? 'active':''}>Saved Jobs</NavLink>
        <NavLink to="/messages" className={({isActive})=> isActive? 'active':''}>Messages</NavLink>
        <NavLink to="/settings" className={({isActive})=> isActive? 'active':''}>Settings</NavLink>
      </nav>
    </aside>
  )
}
