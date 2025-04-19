"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { ticketService } from "../services/api"
import "./AddTicket.css"

const AddTicket = () => {
  const { currentUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const [ticketData, setTicketData] = useState({
    name: "",
    organizer: "",
    location: "",
    eventDate: "",
    price: "",
    seatNumber: "",
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Kullanıcı kontrolü
  useEffect(() => {
    if (!currentUser) {
      navigate("/login")
    }
  }, [currentUser, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setTicketData({
      ...ticketData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Form doğrulama
    if (
      !ticketData.name ||
      !ticketData.organizer ||
      !ticketData.location ||
      !ticketData.eventDate ||
      !ticketData.price
    ) {
      setError("Lütfen zorunlu alanları doldurun")
      return
    }

    try {
      setLoading(true)
      setError("")

      if (!currentUser) {
        setError("Bu işlemi gerçekleştirmek için giriş yapmalısınız.")
        return
      }

      // Bilet verilerini hazırla
      const newTicket = {
        ...ticketData,
        price: Number.parseFloat(ticketData.price),
        isSold: false,
        createdAt: new Date().toISOString(),
        userId: currentUser.id, // Kullanıcı ID'sini doğru şekilde atadığımızdan emin olalım
      }

      console.log("Eklenen bilet bilgileri:", newTicket) // Debug için

      // Bilet ekleme API çağrısı
      await ticketService.createTicket(newTicket)

      setSuccess(true)

      // Form alanlarını temizle
      setTicketData({
        name: "",
        organizer: "",
        location: "",
        eventDate: "",
        price: "",
        seatNumber: "",
        description: "",
      })

      // 2 saniye sonra ana sayfaya yönlendir
      setTimeout(() => {
        navigate("/")
      }, 2000)
    } catch (err) {
      console.error("Bilet eklenirken hata oluştu:", err)
      setError(err.message || "Bilet eklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
    } finally {
      setLoading(false)
    }
  }

  // Minimum tarih olarak bugünü ayarla
  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="add-ticket-container">
      <div className="add-ticket-header">
        <h1>Yeni Bilet Ekle</h1>
        <p>Etkinlik için yeni bilet eklemek için aşağıdaki formu doldurun.</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Bilet başarıyla eklendi! Ana sayfaya yönlendiriliyorsunuz...</div>}

      <div className="add-ticket-form-container">
        <form onSubmit={handleSubmit} className="add-ticket-form">
          <div className="form-group">
            <label htmlFor="name">Etkinlik Adı *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={ticketData.name}
              onChange={handleChange}
              placeholder="Örn: Tarkan Konseri"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="organizer">Organizatör *</label>
            <input
              type="text"
              id="organizer"
              name="organizer"
              value={ticketData.organizer}
              onChange={handleChange}
              placeholder="Örn: XYZ Organizasyon"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Konum *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={ticketData.location}
              onChange={handleChange}
              placeholder="Örn: İstanbul Harbiye Açık Hava Tiyatrosu"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="eventDate">Etkinlik Tarihi *</label>
              <input
                type="datetime-local"
                id="eventDate"
                name="eventDate"
                value={ticketData.eventDate}
                onChange={handleChange}
                min={today}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Bilet Fiyatı (TL) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={ticketData.price}
                onChange={handleChange}
                placeholder="Örn: 250"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="seatNumber">Koltuk Numarası</label>
            <input
              type="text"
              id="seatNumber"
              name="seatNumber"
              value={ticketData.seatNumber}
              onChange={handleChange}
              placeholder="Örn: A12 (Opsiyonel)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Açıklama</label>
            <textarea
              id="description"
              name="description"
              value={ticketData.description}
              onChange={handleChange}
              placeholder="Etkinlik hakkında detaylı bilgi (Opsiyonel)"
              rows="4"
            />
          </div>

          <div className="form-buttons">
            <button type="button" className="cancel-button" onClick={() => navigate("/")}>
              İptal
            </button>
            <button type="submit" className="add-ticket-button" disabled={loading}>
              {loading ? "Ekleniyor..." : "Bilet Ekle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddTicket
