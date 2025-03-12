"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import "./Event.css"

const Event = () => {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState("")
  const [ticketCount, setTicketCount] = useState(1)
  const { currentUser } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    // Gerçek uygulamada burada API çağrısı yapılır
    // Şimdilik mock veri kullanıyoruz
    const fetchEvent = () => {
      setLoading(true)

      // Mock etkinlik verisi
      const mockEvent = {
        id: Number.parseInt(id),
        title: "Rock Konseri",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.",
        dates: ["2023-12-15", "2023-12-16", "2023-12-17"],
        time: "20:00",
        location: "İstanbul Arena",
        address: "Kadıköy, İstanbul",
        category: "music",
        price: 250,
        image: "/placeholder.svg?height=400&width=800",
      }

      setEvent(mockEvent)
      setSelectedDate(mockEvent.dates[0])
      setLoading(false)
    }

    fetchEvent()
  }, [id])

  const handleBuyTicket = () => {
    if (!currentUser) {
      navigate("/login")
      return
    }

    navigate(`/payment/${id}?date=${selectedDate}&count=${ticketCount}`)
  }

  const handleTicketCountChange = (e) => {
    const count = Number.parseInt(e.target.value)
    if (count >= 1 && count <= 10) {
      setTicketCount(count)
    }
  }

  if (loading) {
    return <div className="loading">Etkinlik bilgileri yükleniyor...</div>
  }

  if (!event) {
    return <div className="error">Etkinlik bulunamadı.</div>
  }

  return (
    <div className="event-detail-container">
      <div className="event-header">
        <img src={event.image || "/placeholder.svg"} alt={event.title} className="event-banner" />
        <div className="event-header-overlay">
          <h1>{event.title}</h1>
          <p className="event-category">{event.category}</p>
        </div>
      </div>

      <div className="event-content">
        <div className="event-info">
          <h2>Etkinlik Bilgileri</h2>
          <p className="event-description">{event.description}</p>

          <div className="event-details-grid">
            <div className="detail-item">
              <h3>Tarih ve Saat</h3>
              <p>
                {selectedDate} - {event.time}
              </p>
            </div>
            <div className="detail-item">
              <h3>Konum</h3>
              <p>{event.location}</p>
              <p>{event.address}</p>
            </div>
            <div className="detail-item">
              <h3>Bilet Fiyatı</h3>
              <p className="event-price">{event.price} TL</p>
            </div>
          </div>
        </div>

        <div className="ticket-purchase-section">
          <h2>Bilet Al</h2>
          <div className="ticket-options">
            <div className="option-group">
              <label htmlFor="date">Tarih Seçin</label>
              <select id="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
                {event.dates.map((date) => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
              </select>
            </div>

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
            <div className="total-price">{event.price * ticketCount} TL</div>
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

