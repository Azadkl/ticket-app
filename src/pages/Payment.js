"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { orderService, paymentService, ticketService } from "../services/api"
import "./Payment.css"
import eventDefaultImage from "../assets/images/eventimage.jpg" // Import resim dosyasını

const Payment = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useContext(AuthContext)

  const [order, setOrder] = useState(null)
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchOrderDetails()
  }, [orderId])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      setError("")

      // Sipariş bilgilerini getir
      const orderData = await orderService.getOrderById(orderId)
      setOrder(orderData)

      // Bilet bilgilerini getir
      if (orderData && orderData.ticketId) {
        const ticketData = await ticketService.getTicketById(orderData.ticketId)
        setTicket(ticketData)
      }
    } catch (err) {
      console.error("Sipariş bilgileri yüklenirken hata oluştu:", err)
      setError("Sipariş bilgileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
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

    try {
      setError("")
      setIsProcessing(true)

      // Ödeme işlemi
      const paymentData = {
        orderId: orderId,
        userId: currentUser.id,
        isPaid: true,
        createdAt: new Date().toISOString(),
      }

      await paymentService.createPayment(paymentData)

      // Sipariş durumunu güncelle
      await orderService.updateOrderStatus(orderId, "Completed")

      // Başarılı ödeme sonrası ana sayfaya yönlendirme
      alert("Ödeme başarıyla tamamlandı! Biletleriniz e-posta adresinize gönderilecektir.")
      navigate("/")
    } catch (err) {
      setError(err.message || "Ödeme işlemi sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return <div className="loading">Ödeme bilgileri yükleniyor...</div>
  }

  if (error && !ticket) {
    return <div className="error">{error}</div>
  }

  if (!ticket || !order) {
    return <div className="error">Sipariş bilgileri bulunamadı.</div>
  }

  const handleImageError = (e) => {
    e.target.src = eventDefaultImage // Hata durumunda default resmi kullan
  }

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
            <img
              src={eventDefaultImage || "/placeholder.svg"} // Import edilen resmi kullan
              alt={ticket.name}
              className="event-thumbnail"
              onError={handleImageError} // Resim yüklenemezse hata yönetimi
            />
            <div className="event-summary-details">
              <h3>{ticket.name}</h3>
              <p>
                {new Date(ticket.eventDate).toLocaleDateString("tr-TR")} -{" "}
                {new Date(ticket.eventDate).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
              </p>
              <p>{ticket.location}</p>
              <p>Koltuk: {ticket.seatNumber || "Numarasız"}</p>
            </div>
          </div>

          <div className="ticket-summary">
            <div className="summary-row">
              <span>Bilet Fiyatı:</span>
              <span>{ticket.price} TL</span>
            </div>
            <div className="summary-row total">
              <span>Toplam Tutar:</span>
              <span>{ticket.price} TL</span>
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
                {isProcessing ? "İşleniyor..." : `${ticket.price} TL Öde`}
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
                  <strong>Açıklama:</strong> {currentUser.name} - {ticket.name} - Sipariş No: {orderId}
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
