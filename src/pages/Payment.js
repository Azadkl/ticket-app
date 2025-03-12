"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import "./Payment.css"

const Payment = () => {
  const { eventId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser } = useContext(AuthContext)

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")

  // URL'den tarih ve bilet sayısı parametrelerini al
  const queryParams = new URLSearchParams(location.search)
  const selectedDate = queryParams.get("date") || ""
  const ticketCount = Number.parseInt(queryParams.get("count") || "1")

  useEffect(() => {
    // Gerçek uygulamada burada API çağrısı yapılır
    // Şimdilik mock veri kullanıyoruz
    const fetchEvent = () => {
      setLoading(true)

      // Mock etkinlik verisi
      const mockEvent = {
        id: Number.parseInt(eventId),
        title: "Rock Konseri",
        date: selectedDate || "2023-12-15",
        time: "20:00",
        location: "İstanbul Arena",
        price: 250,
        image: "/placeholder.svg?height=200&width=300",
      }

      setEvent(mockEvent)
      setLoading(false)
    }

    fetchEvent()
  }, [eventId, selectedDate])

  const handleSubmit = (e) => {
    e.preventDefault()

    // Form doğrulama
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      setError("Lütfen tüm alanları doldurun")
      return
    }

    if (cardNumber.length < 16) {
      setError("Geçerli bir kart numarası girin")
      return
    }

    if (cvv.length < 3) {
      setError("Geçerli bir CVV kodu girin")
      return
    }

    // Ödeme işlemi simülasyonu
    setError("")
    setIsProcessing(true)

    setTimeout(() => {
      setIsProcessing(false)
      // Başarılı ödeme sonrası ana sayfaya yönlendirme
      alert("Ödeme başarıyla tamamlandı! Biletleriniz e-posta adresinize gönderilecektir.")
      navigate("/")
    }, 2000)
  }

  if (loading) {
    return <div className="loading">Ödeme bilgileri yükleniyor...</div>
  }

  if (!event) {
    return <div className="error">Etkinlik bulunamadı.</div>
  }

  const totalAmount = event.price * ticketCount

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h1>Ödeme</h1>
        <p>Biletlerinizi satın almak için ödeme bilgilerinizi girin.</p>
      </div>

      <div className="payment-content">
        <div className="order-summary">
          <h2>Sipariş Özeti</h2>
          <div className="event-summary">
            <img src={event.image || "/placeholder.svg"} alt={event.title} className="event-thumbnail" />
            <div className="event-summary-details">
              <h3>{event.title}</h3>
              <p>
                {event.date} - {event.time}
              </p>
              <p>{event.location}</p>
            </div>
          </div>

          <div className="ticket-summary">
            <div className="summary-row">
              <span>Bilet Fiyatı:</span>
              <span>{event.price} TL</span>
            </div>
            <div className="summary-row">
              <span>Bilet Adedi:</span>
              <span>{ticketCount}</span>
            </div>
            <div className="summary-row total">
              <span>Toplam Tutar:</span>
              <span>{totalAmount} TL</span>
            </div>
          </div>
        </div>

        <div className="payment-form-container">
          <h2>Ödeme Bilgileri</h2>

          <div className="payment-methods">
            <div
              className={`payment-method ${paymentMethod === "credit-card" ? "active" : ""}`}
              onClick={() => setPaymentMethod("credit-card")}
            >
              <div className="method-icon">💳</div>
              <span>Kredi Kartı</span>
            </div>
            <div
              className={`payment-method ${paymentMethod === "bank-transfer" ? "active" : ""}`}
              onClick={() => setPaymentMethod("bank-transfer")}
            >
              <div className="method-icon">🏦</div>
              <span>Banka Transferi</span>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          {paymentMethod === "credit-card" && (
            <form onSubmit={handleSubmit} className="payment-form">
              <div className="form-group">
                <label htmlFor="cardName">Kart Üzerindeki İsim</label>
                <input
                  type="text"
                  id="cardName"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Ad Soyad"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cardNumber">Kart Numarası</label>
                <input
                  type="text"
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiryDate">Son Kullanma Tarihi</label>
                  <input
                    type="text"
                    id="expiryDate"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    placeholder="MM/YY"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                    placeholder="123"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="pay-button" disabled={isProcessing}>
                {isProcessing ? "İşleniyor..." : `${totalAmount} TL Öde`}
              </button>
            </form>
          )}

          {paymentMethod === "bank-transfer" && (
            <div className="bank-transfer-info">
              <p>Banka havalesi ile ödeme yapmak için aşağıdaki hesap bilgilerini kullanabilirsiniz:</p>
              <div className="bank-details">
                <p>
                  <strong>Banka:</strong> Örnek Banka
                </p>
                <p>
                  <strong>Hesap Sahibi:</strong> BiletAl A.Ş.
                </p>
                <p>
                  <strong>IBAN:</strong> TR12 3456 7890 1234 5678 9012 34
                </p>
                <p>
                  <strong>Açıklama:</strong> {currentUser.name} - {event.title} - {event.date}
                </p>
              </div>
              <p className="note">
                Not: Havale yaptıktan sonra dekontunuzu <strong>destek@biletAl.com</strong> adresine göndermeniz
                gerekmektedir.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Payment

