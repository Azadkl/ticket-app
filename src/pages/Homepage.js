"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { ticketService } from "../services/api"
import { AuthContext } from "../context/AuthContext"
import "./Homepage.css"
import eventImage from "../assets/images/eventimage.jpg"

const Homepage = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [error, setError] = useState("")
  const [locations, setLocations] = useState([])
  const { currentUser } = useContext(AuthContext)

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

  return (
    <div className="homepage-container">
      <div className="hero-section">
        <h1>BiletAl ile Etkinlikleri Keşfedin</h1>
        <p>Konserler, tiyatrolar, spor etkinlikleri ve daha fazlası...</p>

        {/* Bilet Ekle butonu - sadece giriş yapmış kullanıcılar için */}
        {currentUser && (
          <div className="hero-buttons">
            <Link to="/add-ticket" className="add-ticket-hero-button">
              <i className="add-icon">+</i> Yeni Bilet Ekle
            </Link>
            <Link to="/my-tickets" className="my-tickets-hero-button">
              Biletlerim
            </Link>
          </div>
        )}
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
                <img src={eventImage || "/placeholder.svg"} alt={event.name} className="event-image" />
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
