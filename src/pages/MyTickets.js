"use client"

import { useState, useEffect, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { ticketService } from "../services/api"
import "./MyTickets.css"
import eventDefaultImage from "../assets/images/eventimage.jpg"

const MyTickets = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { currentUser } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!currentUser) {
      navigate("/login")
      return
    }
    fetchUserTickets()
  }, [currentUser, navigate])

  const fetchUserTickets = async () => {
    try {
      setLoading(true)
      setError("")

      // Tüm biletleri getir ve kullanıcıya ait olanları filtrele
      const allTickets = await ticketService.getAllTickets()
      const userTickets = allTickets.filter((ticket) => ticket.userId === currentUser.id)

      // Tarihe göre sırala (en yeni en üstte)
      userTickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      setTickets(userTickets)
    } catch (err) {
      console.error("Biletler yüklenirken hata oluştu:", err)
      setError("Biletleriniz yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTicket = async (ticketId) => {
    if (window.confirm("Bu bileti silmek istediğinizden emin misiniz?")) {
      try {
        await ticketService.deleteTicket(ticketId)
        // Bileti listeden kaldır
        setTickets(tickets.filter((ticket) => ticket.ticketId !== ticketId))
        alert("Bilet başarıyla silindi!")
      } catch (err) {
        console.error("Bilet silinirken hata oluştu:", err)
        alert("Bilet silinirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
      }
    }
  }

  // Resim hata yönetimi için
  const handleImageError = (e) => {
    e.target.src = eventDefaultImage
  }

  return (
    <div className="my-tickets-container">
      <div className="my-tickets-header">
        <h1>Biletlerim</h1>
        <p>Eklediğiniz ve satın aldığınız biletleri burada görebilirsiniz.</p>
        <Link to="/add-ticket" className="add-ticket-button">
          <i className="add-icon">+</i> Yeni Bilet Ekle
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Biletleriniz yükleniyor...</div>
      ) : tickets.length > 0 ? (
        <div className="tickets-grid">
          {tickets.map((ticket) => (
            <div key={ticket.ticketId} className="ticket-card">
              <img
                src={eventDefaultImage || "/placeholder.svg"}
                alt={ticket.name}
                className="ticket-image"
                onError={handleImageError}
              />
              <div className="ticket-details">
                <h3>{ticket.name}</h3>
                <p className="ticket-date">
                  {new Date(ticket.eventDate).toLocaleDateString("tr-TR")} -{" "}
                  {new Date(ticket.eventDate).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                </p>
                <p className="ticket-location">{ticket.location}</p>
                <p className="ticket-price">{ticket.price} TL</p>
                <p className="ticket-status">
                  Durum:{" "}
                  <span className={ticket.isSold ? "sold" : "available"}>{ticket.isSold ? "Satıldı" : "Satışta"}</span>
                </p>
                <div className="ticket-actions">
                  <Link to={`/event/${ticket.ticketId}`} className="view-button">
                    Görüntüle
                  </Link>
                  <Link to={`/edit-ticket/${ticket.ticketId}`} className="edit-button">
                    Düzenle
                  </Link>
                  <button
                    onClick={() => handleDeleteTicket(ticket.ticketId)}
                    className="delete-button"
                    disabled={ticket.isSold}
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-tickets">
          <p>Henüz bilet eklememişsiniz.</p>
          <Link to="/add-ticket" className="add-ticket-button">
            İlk Biletinizi Ekleyin
          </Link>
        </div>
      )}
    </div>
  )
}

export default MyTickets
