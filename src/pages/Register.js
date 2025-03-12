"use client"

import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import "./Auth.css"

const Register = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { register } = useContext(AuthContext)
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

      // Gerçek uygulamada burada API çağrısı yapılır
      // Şimdilik mock veri kullanıyoruz
      const success = register({
        id: 1,
        name: name,
        email: email,
      })

      if (success) {
        navigate("/")
      }
    } catch (err) {
      setError("Kayıt oluşturulamadı. Lütfen tekrar deneyin.")
      console.error(err)
    }

    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Kayıt Ol</h2>
        {error && <div className="error-message">{error}</div>}
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

