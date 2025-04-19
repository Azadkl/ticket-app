"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { ticketService } from "../services/api"
import "./AddTicket.css" // Aynı stil dosyasını kullanıyoruz

const EditTicket = () => {
  const { id } = useParams()
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
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!currentUser) {
      navigate("/login")
      return
    }
    fetchTicket()
  }, [id, currentUser, navigate])

  const fetchTicket = async () => {
    try {
      setLoading(true)
      setError("")

      // Bilet bilgilerini getir
      const data = await ticketService.getTicketById(id)

      console.log("Bilet bilgileri:", data) // Debug için
      console.log("Mevcut kullanıcı:", currentUser) // Debug için

      // Kullanıcı kontrolü - sadece bilet sahibi düzenleyebilir
      if (currentUser && data.userId !== currentUser.id) {
        console.log("Kullanıcı ID'leri eşleşmiyor:", data.userId, currentUser.id) // Debug için
        setError("Bu bileti düzenleme yetkiniz yok.")
        return
      }

      // Tarih formatını input için uygun hale getir
      const eventDate = new Date(data.eventDate)
      const formattedDate = eventDate.toISOString().slice(0, 16) // YYYY-MM-DDThh:mm formatı

      setTicketData({
        ...data,
        eventDate: formattedDate,
      })
    } catch (err) {
      console.error("Bilet bilgileri yüklenirken hata oluştu:", err)
      setError(err.message || "Bilet bilgileri yüklenirken bir hata oluştu.")
    } finally {
      setLoading(false)
    }
  }

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
      setSubmitting(true)
      setError("")

      // Bilet verilerini hazırla
      const updatedTicket = {
        ...ticketData,
        price: Number.parseFloat(ticketData.price),
        userId: currentUser.id, // Kullanıcı ID'sini doğru şekilde atadığımızdan emin olalım
      }

      console.log("Güncellenen bilet bilgileri:", updatedTicket) // Debug için

      // Bilet güncelleme API çağrısı
      await ticketService.updateTicket(id, updatedTicket)

      setSuccess(true)

      // 2 saniye sonra bilet detay sayfasına yönlendir
      setTimeout(() => {
        navigate(`/event/${id}`)
      }, 2000)
    } catch (err) {
      console.error("Bilet güncellenirken hata oluştu:", err)
      setError(err.message || "Bilet güncellenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
    } finally {
      setSubmitting(false)
    }
  }

  // Minimum tarih olarak bugünü ayarla
  const today = new Date().toISOString().split("T")[0]

  if (loading) {
    return <div className="loading">Bilet bilgileri yükleniyor...</div>
  }

  if (error && !ticketData.name) {
    return <div className="error-message">{error}</div>
  }

  return (
    <div className="add-ticket-container">
      <div className="add-ticket-header">
        <h1>Bilet Düzenle</h1>
        <p>Etkinlik bilgilerini güncellemek için aşağıdaki formu düzenleyin.</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Bilet başarıyla güncellendi! Yönlendiriliyorsunuz...</div>}

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
              value={ticketData.seatNumber || ""}
              onChange={handleChange}
              placeholder="Örn: A12 (Opsiyonel)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Açıklama</label>
            <textarea
              id="description"
              name="description"
              value={ticketData.description || ""}
              onChange={handleChange}
              placeholder="Etkinlik hakkında detaylı bilgi (Opsiyonel)"
              rows="4"
            />
          </div>

          <div className="form-buttons">
            <button type="button" className="cancel-button" onClick={() => navigate(`/event/${id}`)}>
              İptal
            </button>
            <button type="submit" className="add-ticket-button" disabled={submitting}>
              {submitting ? "Güncelleniyor..." : "Bileti Güncelle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditTicket
