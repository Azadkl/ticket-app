"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ticketService } from "../services/api"
import "./Homepage.css"
import eventDefaultImage from "../assets/images/eventimage.jpg" // Import resim dosyasını

const Homepage = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [error, setError] = useState("")
  const [locations, setLocations] = useState([])

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      setError("")

      // Tüm biletleri getir
      const data = await ticketService.getAllTickets()
      setTickets(data)

      // Lokasyonları çıkar
      const uniqueLocations = [...new Set(data.map((ticket) => ticket.location))].filter(Boolean)
      setLocations(uniqueLocations)
    } catch (err) {
      console.error("Biletler yüklenirken hata oluştu:", err)
      setError("Biletler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
    } finally {
      setLoading(false)
    }
  }

  // Filtreleme işlemi
  const filteredTickets = filter === "all" ? tickets : tickets.filter((ticket) => ticket.location === filter)

  // Biletleri etkinlik adına göre grupla
  const groupedTickets = filteredTickets.reduce((acc, ticket) => {
    if (!acc[ticket.name]) {
      acc[ticket.name] = {
        name: ticket.name,
        organizer: ticket.organizer,
        location: ticket.location,
        eventDate: ticket.eventDate,
        price: ticket.price,
        tickets: [],
      }
    }
    acc[ticket.name].tickets.push(ticket)
    return acc
  }, {})

  const events = Object.values(groupedTickets)

  // Resim hata yönetimi için
  const handleImageError = (e) => {
    e.target.src = eventDefaultImage // Hata durumunda default resmi kullan
  }

  return (
    <div className="homepage-container">
      <div className="hero-section">
        <h1>BiletAl ile Etkinlikleri Keşfedin</h1>
        <p>Konserler, tiyatrolar, spor etkinlikleri ve daha fazlası...</p>
      </div>

      <div className="filter-section">
        <button className={`filter-button ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
          Tümü
        </button>
        {locations.map((location) => (
          <button
            key={location}
            className={`filter-button ${filter === location ? "active" : ""}`}
            onClick={() => setFilter(location)}
          >
            {location}
          </button>
        ))}
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Etkinlikler yükleniyor...</div>
      ) : (
        <div className="events-grid">
          {events.length > 0 ? (
            events.map((event) => (
              <div key={event.name} className="event-card">
                <img
                  src="assets/images/eventimage.jpg" // public klasöründeki resim
                  alt={event.name}
                  className="event-image"
                  onError={(e) => {
                    e.target.onerror = null // Sonsuz döngüyü önlemek için
                    e.target.src = "/images/default.jpg" // Alternatif default resim
                  }}
                />
                <div className="event-details">
                  <h3>{event.name}</h3>
                  <p className="event-date">
                    {new Date(event.eventDate).toLocaleDateString("tr-TR")} -{" "}
                    {new Date(event.eventDate).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <p className="event-location">{event.location}</p>
                  <p className="event-organizer">Organizatör: {event.organizer}</p>
                  <p className="event-price">{event.price} TL</p>
                  <p className="event-availability">{event.tickets.length} adet bilet mevcut</p>
                  <Link to={`/event/${event.tickets[0].ticketId}`} className="view-details-button">
                    Detayları Gör
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="no-events">Bu kategoride etkinlik bulunamadı.</div>
          )}
        </div>
      )}
    </div>
  )
}

export default Homepage
