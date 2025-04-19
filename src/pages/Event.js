"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { ticketService, orderService } from "../services/api"
import "./Event.css"
import eventDefaultImage from "../assets/images/eventimage.jpg"
import eventImage from "../assets/images/eventimage.jpg"

const Event = () => {
  const { id } = useParams()
  const [ticket, setTicket] = useState(null)
  const [relatedTickets, setRelatedTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [ticketCount, setTicketCount] = useState(1)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { currentUser } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    fetchTicket()
  }, [id])

  const fetchTicket = async () => {
    try {
      setLoading(true)
      setError("")

      // Bilet bilgilerini getir
      const data = await ticketService.getTicketById(id)
      setTicket(data)

      // İlgili biletleri getir (aynı isimli etkinliğe ait diğer biletler)
      if (data) {
        const allTickets = await ticketService.getAllTickets()
        const related = allTickets.filter((t) => t.name === data.name && t.ticketId !== data.ticketId && !t.isSold)
        setRelatedTickets(related)
      }
    } catch (err) {
      console.error("Bilet bilgileri yüklenirken hata oluştu:", err)
      setError("Bilet bilgileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
    } finally {
      setLoading(false)
    }
  }

  const handleBuyTicket = async () => {
    if (!currentUser) {
      navigate("/login")
      return
    }

    try {
      // Sipariş oluştur
      const orderData = {
        userId: currentUser.id,
        ticketId: Number(id),
        status: "Pending",
        orderDate: new Date().toISOString(),
      }

      const order = await orderService.createOrder(orderData)

      // Ödeme sayfasına yönlendir
      navigate(`/payment/${order.orderId}`)
    } catch (err) {
      console.error("Sipariş oluşturulurken hata oluştu:", err)
      setError("Sipariş oluşturulurken bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
    }
  }

  const handleTicketCountChange = (e) => {
    const count = Number.parseInt(e.target.value)
    if (count >= 1 && count <= 10) {
      setTicketCount(count)
    }
  }

  // Bilet silme işlemi
  const handleDeleteTicket = async () => {
    try {
      setDeleting(true)
      await ticketService.deleteTicket(id)
      setShowDeleteModal(false)
      alert("Bilet başarıyla silindi!")
      navigate("/")
    } catch (err) {
      console.error("Bilet silinirken hata oluştu:", err)
      setError(err.message || "Bilet silinirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
      setDeleting(false)
    }
  }

  // Bilet düzenleme sayfasına yönlendirme
  const handleEditTicket = () => {
    navigate(`/edit-ticket/${id}`)
  }

  // Resim hata yönetimi için
  const handleImageError = (e) => {
    e.target.src = eventDefaultImage
  }

  // Kullanıcının bilet sahibi olup olmadığını kontrol et
  // Burada console.log ekleyerek debug edelim
  const isTicketOwner = currentUser && ticket && currentUser.id === ticket.userId
  
  // Debug için console.log ekleyelim
  useEffect(() => {
    if (currentUser && ticket) {
      console.log("Current User ID:", currentUser.id)
      console.log("Ticket User ID:", ticket.userId)
      console.log("Is Owner:", currentUser.id === ticket.userId)
    }
  }, [currentUser, ticket])

  if (loading) {
    return <div className="loading">Etkinlik bilgileri yükleniyor...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  if (!ticket) {
    return <div className="error">Bilet bulunamadı.</div>
  }

  return (
    <div className="event-detail-container">
      {/* Silme onay modalı */}
      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h3>Bileti Sil</h3>
            <p>Bu bileti silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
            <div className="modal-buttons">
              <button className="cancel-button" onClick={() => setShowDeleteModal(false)} disabled={deleting}>
                İptal
              </button>
              <button className="delete-button" onClick={handleDeleteTicket} disabled={deleting}>
                {deleting ? "Siliniyor..." : "Evet, Sil"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="event-header">
        <img src={eventImage || "/placeholder.svg"} alt={ticket.name} className="event-banner" />
        <div className="event-header-overlay">
          <h1>{ticket.name}</h1>
          <p className="event-category">{ticket.organizer}</p>
        </div>
      </div>

      <div className="event-content">
        <div className="event-info">
          {/* Bilet sahibi için düzenleme ve silme butonları */}
          {isTicketOwner && (
            <div className="owner-actions">
              <button onClick={handleEditTicket} className="edit-button">
                Düzenle
              </button>
              <button onClick={() => setShowDeleteModal(true)} className="delete-button">
                Sil
              </button>
            </div>
          )}

          <h2>Etkinlik Bilgileri</h2>
          <p className="event-description">
            {ticket.description ||
              `${ticket.name} etkinliği ${ticket.location} konumunda ${new Date(ticket.eventDate).toLocaleDateString("tr-TR")} tarihinde gerçekleşecektir.`}
          </p>

          <div className="event-details-grid">
            <div className="detail-item">
              <h3>Tarih ve Saat</h3>
              <p>
                {new Date(ticket.eventDate).toLocaleDateString("tr-TR")} -{" "}
                {new Date(ticket.eventDate).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <div className="detail-item">
              <h3>Konum</h3>
              <p>{ticket.location}</p>
            </div>
            <div className="detail-item">
              <h3>Organizatör</h3>
              <p>{ticket.organizer}</p>
            </div>
            <div className="detail-item">
              <h3>Koltuk Numarası</h3>
              <p>{ticket.seatNumber || "Numarasız"}</p>
            </div>
            <div className="detail-item">
              <h3>Bilet Fiyatı</h3>
              <p className="event-price">{ticket.price} TL</p>
            </div>
          </div>

          {relatedTickets.length > 0 && (
            <div className="related-tickets">
              <h3>Diğer Biletler</h3>
              <div className="related-tickets-grid">
                {relatedTickets.map((relTicket) => (
                  <div key={relTicket.ticketId} className="related-ticket-card">
                    <p className="seat-number">Koltuk: {relTicket.seatNumber || "Numarasız"}</p>
                    <p className="ticket-price">{relTicket.price} TL</p>
                    <button onClick={() => navigate(`/event/${relTicket.ticketId}`)} className="select-ticket-button">
                      Bu Bileti Seç
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="ticket-purchase-section">
          <h2>Bilet Al</h2>
          <div className="ticket-options">
            <div className="option-group">
              <label htmlFor="count">Bilet Adedi</label>
              <div className="ticket-count-control">
                <button onClick={() => ticketCount > 1 && setTicketCount(ticketCount - 1)} className="count-button">
                  -
                </button>
                <input
                  type="number"
                  id="count"
                  min="1"
                  max="10"
                  value={ticketCount}
                  onChange={handleTicketCountChange}
                />
                <button onClick={() => ticketCount < 10 && setTicketCount(ticketCount + 1)} className="count-button">
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="total-section">
            <div className="total-label">Toplam Tutar:</div>
            <div className="total-price">{ticket.price * ticketCount} TL</div>
          </div>

          <button onClick={handleBuyTicket} className="buy-ticket-button">
            {currentUser ? "Bilet Satın Al" : "Giriş Yap ve Bilet Al"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Event
