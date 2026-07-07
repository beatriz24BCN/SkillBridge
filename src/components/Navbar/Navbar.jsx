import React, { useState, useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './Navbar.css'

export default function Navbar(){
  const [open,setOpen] = useState(false)
  const navRef = useRef(null)
  const buttonId = 'sb-hamburger'
  const navId = 'sb-main-nav'

  useEffect(()=>{
    if(!open) return
    function onKey(e){
      if(e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return ()=> window.removeEventListener('keydown', onKey)
  },[open])
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-left sb-left">
          <Link to="/" className="sb-logo">
            <span className="logo-skill">Skill</span>
            <span className="logo-bridge">Bridge</span>
          </Link>
        </div>

        <nav
          id={navId}
          ref={navRef}
          className={`sb-nav ${open? 'open':''} navbar-center`}
          aria-label="Main navigation"
        >
          <NavLink onClick={()=>setOpen(false)} to="/jobs" className={({isActive})=> `sb-nav-link${isActive? ' active':''}`}>Jobs</NavLink>
          <NavLink onClick={()=>setOpen(false)} to="/companies" className={({isActive})=> `sb-nav-link${isActive? ' active':''}`}>Companies</NavLink>
          <NavLink onClick={()=>setOpen(false)} to="/employers" className={({isActive})=> `sb-nav-link${isActive? ' active':''}`}>For Employers</NavLink>
          <NavLink onClick={()=>setOpen(false)} to="/about" className={({isActive})=> `sb-nav-link${isActive? ' active':''}`}>About</NavLink>

          {/* Mobile-only auth links inside the menu */}
          <Link onClick={()=>setOpen(false)} to="/login" className="sb-nav-link sb-mobile-auth">Login</Link>
          <Link onClick={()=>setOpen(false)} to="/signup" className="sb-nav-link sb-mobile-cta">Sign Up</Link>
        </nav>

        <div className="navbar-right sb-right">
          <Link to="/login" className="sb-login">Login</Link>
          <Link to="/signup" className="sb-cta">Sign Up</Link>
          <button id={buttonId} className="sb-hamburger" aria-label="Toggle menu" aria-controls={navId} onClick={()=>setOpen(!open)} aria-expanded={open}>
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </button>
        </div>
      </div>

      {open && (
        <div className="sb-mobile-backdrop" onClick={()=>setOpen(false)} />
      )}
    </header>
  )
}
