import axios from "axios"

// Mikroservis API URL'leri
const API_URLS = {
  user: "http://localhost:5003/api",
  ticket: "http://localhost:5001/api",
  order: "http://localhost:5002/api",
  payment: "http://localhost:5005/api",
}

// Her bir servis için ayrı axios instance oluşturma
const createApiInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  })

  // İstek gönderilmeden önce token ekleme
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    },
  )

  // Hata işleme
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("API Hatası:", error.response?.data || error.message) // Debug için
      const message = error.response?.data?.message || "Bir hata oluştu"
      const statusCode = error.response?.status || 500
      return Promise.reject({ message, statusCode })
    },
  )

  return instance
}

// Her bir servis için API instance'ları
const userApi = createApiInstance(API_URLS.user)
const ticketApi = createApiInstance(API_URLS.ticket)
const orderApi = createApiInstance(API_URLS.order)
const paymentApi = createApiInstance(API_URLS.payment)

// Auth servisleri (user servisi üzerinden)
export const authService = {
  login: async (email, password) => {
    try {
      const response = await userApi.post("/users/login", { email, password })
      return response.data
    } catch (error) {
      throw error
    }
  },
  register: async (userData) => {
    try {
      const response = await userApi.post("/users/register", userData)
      return response.data
    } catch (error) {
      throw error
    }
  },
  getCurrentUser: async () => {
    try {
      const response = await userApi.get("/users/me")
      return response.data
    } catch (error) {
      throw error
    }
  },
}

// Kullanıcı servisleri
export const userService = {
  getUserById: async (id) => {
    try {
      const response = await userApi.get(`/users/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },
  updateUser: async (id, userData) => {
    try {
      const response = await userApi.put(`/users/${id}`, userData)
      return response.data
    } catch (error) {
      throw error
    }
  },
}

// Bilet servisleri - Endpoint'leri düzeltildi
export const ticketService = {
  getAllTickets: async () => {
    try {
      const response = await ticketApi.get("/Tickets")
      return response.data
    } catch (error) {
      throw error
    }
  },
  getTicketById: async (id) => {
    try {
      const response = await ticketApi.get(`/Tickets/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },
  createTicket: async (ticketData) => {
    try {
      console.log("API'ye gönderilen bilet verileri:", ticketData) // Debug için
      const response = await ticketApi.post("/Tickets", ticketData)
      return response.data
    } catch (error) {
      console.error("Bilet oluşturma hatası:", error) // Debug için
      throw error
    }
  },
  updateTicket: async (id, ticketData) => {
    try {
      console.log("API'ye gönderilen güncelleme verileri:", ticketData) // Debug için
      const response = await ticketApi.put(`/Tickets/${id}`, ticketData)
      return response.data
    } catch (error) {
      console.error("Bilet güncelleme hatası:", error) // Debug için
      throw error
    }
  },
  deleteTicket: async (id) => {
    try {
      console.log("Silinen bilet ID:", id) // Debug için
      const response = await ticketApi.delete(`/Tickets/${id}`)
      return response.data
    } catch (error) {
      console.error("Bilet silme hatası:", error) // Debug için
      throw error
    }
  },
}

// Sipariş servisleri
export const orderService = {
  getAllOrders: async () => {
    try {
      const response = await orderApi.get("/orders")
      return response.data
    } catch (error) {
      throw error
    }
  },
  getOrderById: async (id) => {
    try {
      const response = await orderApi.get(`/orders/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },
  getUserOrders: async (userId) => {
    try {
      const response = await orderApi.get(`/orders/user/${userId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },
  createOrder: async (orderData) => {
    try {
      const response = await orderApi.post("/orders", orderData)
      return response.data
    } catch (error) {
      throw error
    }
  },
  updateOrderStatus: async (id, status) => {
    try {
      const response = await orderApi.put(`/orders/${id}/status`, { status })
      return response.data
    } catch (error) {
      throw error
    }
  },
  cancelOrder: async (id) => {
    try {
      const response = await orderApi.put(`/orders/${id}/cancel`)
      return response.data
    } catch (error) {
      throw error
    }
  },
}

// Ödeme servisleri
export const paymentService = {
  createPayment: async (paymentData) => {
    try {
      const response = await paymentApi.post("/payments", paymentData)
      return response.data
    } catch (error) {
      throw error
    }
  },
  getPaymentById: async (id) => {
    try {
      const response = await paymentApi.get(`/payments/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },
  getPaymentsByOrderId: async (orderId) => {
    try {
      const response = await paymentApi.get(`/payments/order/${orderId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },
}

// Tüm API'leri tek bir nesne olarak dışa aktar
export default {
  user: userApi,
  ticket: ticketApi,
  order: orderApi,
  payment: paymentApi,
}
