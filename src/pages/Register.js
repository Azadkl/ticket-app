"use client"

import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import "./Auth.css"

const Register = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { register, error: contextError } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || !email || !password || !confirmPassword) {
      setError("Lütfen tüm alanları doldurun")
      return
    }

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor")
      return
    }

    try {
      setError("")
      setLoading(true)

      // User servisi üzerinden register işlemi
      await register({
        name,
        email,
        phone,
        password,
      })

      navigate("/")
    } catch (err) {
      setError(err.message || "Kayıt oluşturulamadı. Lütfen tekrar deneyin.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Kayıt Ol</h2>
        {(error || contextError) && <div className="error-message">{error || contextError}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Ad Soyad</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-posta</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Telefon (İsteğe Bağlı)</label>
            <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Şifre Tekrar</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
          </button>
        </form>
        <p className="auth-redirect">
          Zaten hesabınız var mı? <Link to="/login">Giriş Yap</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
