"use client"

import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import "./Navbar.css"

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          BiletAl
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">
              Ana Sayfa
            </Link>
          </li>
          {currentUser ? (
            <>
              <li className="nav-item">
                <Link to="/add-ticket" className="nav-links">
                  <i className="nav-icon">+</i> Bilet Ekle
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/my-tickets" className="nav-links">
                  Biletlerim
                </Link>
              </li>
              <li className="nav-item">
                <span className="nav-links user-name">Merhaba, {currentUser.name}</span>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-links logout-btn">
                  Çıkış Yap
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-links">
                  Giriş Yap
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-links">
                  Kayıt Ol
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
