"use client"

import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import "./Auth.css"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      setError("Lütfen tüm alanları doldurun")
      return
    }

    try {
      setError("")
      setLoading(true)

      // Gerçek uygulamada burada API çağrısı yapılır
      // Şimdilik mock veri kullanıyoruz
      const success = login({
        id: 1,
        name: "Test Kullanıcı",
        email: email,
      })

      if (success) {
        navigate("/")
      }
    } catch (err) {
      setError("Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.")
      console.error(err)
    }

    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Giriş Yap</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
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
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
        <p className="auth-redirect">
          Hesabınız yok mu? <Link to="/register">Kayıt Ol</Link>
        </p>
      </div>
    </div>
  )
}

export default Login

