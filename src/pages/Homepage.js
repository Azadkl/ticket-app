"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "./Homepage.css"

const Homepage = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    // Gerçek uygulamada burada API çağrısı yapılır
    // Şimdilik mock veri kullanıyoruz
    const fetchEvents = () => {
      setLoading(true)

      // Mock etkinlik verileri
      const mockEvents = [
        {
          id: 1,
          title: "Rock Konseri",
          date: "2023-12-15",
          time: "20:00",
          location: "İstanbul Arena",
          category: "music",
          price: 250,
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          id: 2,
          title: "Tiyatro Gösterisi",
          date: "2023-12-20",
          time: "19:30",
          location: "Ankara Devlet Tiyatrosu",
          category: "theater",
          price: 150,
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          id: 3,
          title: "Futbol Maçı",
          date: "2023-12-18",
          time: "21:00",
          location: "İzmir Stadyumu",
          category: "sports",
          price: 200,
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          id: 4,
          title: "Stand-up Gösterisi",
          date: "2023-12-25",
          time: "21:30",
          location: "Antalya Kültür Merkezi",
          category: "comedy",
          price: 180,
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          id: 5,
          title: "Klasik Müzik Konseri",
          date: "2023-12-30",
          time: "19:00",
          location: "İstanbul Konser Salonu",
          category: "music",
          price: 300,
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          id: 6,
          title: "Basketbol Turnuvası",
          date: "2024-01-05",
          time: "18:00",
          location: "Bursa Spor Salonu",
          category: "sports",
          price: 120,
          image: "/placeholder.svg?height=200&width=300",
        },
      ]

      setEvents(mockEvents)
      setLoading(false)
    }

    fetchEvents()
  }, [])

  const filteredEvents = filter === "all" ? events : events.filter((event) => event.category === filter)

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
        <button className={`filter-button ${filter === "music" ? "active" : ""}`} onClick={() => setFilter("music")}>
          Müzik
        </button>
        <button
          className={`filter-button ${filter === "theater" ? "active" : ""}`}
          onClick={() => setFilter("theater")}
        >
          Tiyatro
        </button>
        <button className={`filter-button ${filter === "sports" ? "active" : ""}`} onClick={() => setFilter("sports")}>
          Spor
        </button>
        <button className={`filter-button ${filter === "comedy" ? "active" : ""}`} onClick={() => setFilter("comedy")}>
          Komedi
        </button>
      </div>

      {loading ? (
        <div className="loading">Etkinlikler yükleniyor...</div>
      ) : (
        <div className="events-grid">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div key={event.id} className="event-card">
                <img src={event.image || "/placeholder.svg"} alt={event.title} className="event-image" />
                <div className="event-details">
                  <h3>{event.title}</h3>
                  <p className="event-date">
                    {event.date} - {event.time}
                  </p>
                  <p className="event-location">{event.location}</p>
                  <p className="event-price">{event.price} TL</p>
                  <Link to={`/event/${event.id}`} className="view-details-button">
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

