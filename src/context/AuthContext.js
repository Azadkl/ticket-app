"use client"

import { createContext, useState, useEffect } from "react"
import { authService, userService } from "../services/api"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Sayfa yenilendiğinde token kontrolü
    const token = localStorage.getItem("token")
    if (token) {
      fetchCurrentUser(token)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchCurrentUser = async (token) => {
    try {
      setToken(token)
      // User servisi üzerinden mevcut kullanıcı bilgilerini al
      const userData = await authService.getCurrentUser()
      console.log("Kullanıcı bilgileri alındı:", userData) // Debug için
      setCurrentUser(userData)
      setError(null)
    } catch (error) {
      console.error("Kullanıcı bilgileri alınamadı:", error)
      localStorage.removeItem("token")
      setError("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.")
      setCurrentUser(null) // Kullanıcı bilgilerini temizle
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      // User servisi üzerinden login işlemi
      const response = await authService.login(email, password)
      const { token, user } = response

      localStorage.setItem("token", token)
      setToken(token)
      setCurrentUser(user)
      console.log("Giriş yapıldı, kullanıcı:", user) // Debug için
      setError(null)

      return true
    } catch (error) {
      setError(error.message || "Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.")
      throw error
    }
  }

  const register = async (userData) => {
    try {
      // User servisi üzerinden register işlemi
      const response = await authService.register(userData)
      const { token, user } = response

      localStorage.setItem("token", token)
      setToken(token)
      setCurrentUser(user)
      console.log("Kayıt olundu, kullanıcı:", user) // Debug için
      setError(null)

      return true
    } catch (error) {
      setError(error.message || "Kayıt oluşturulamadı. Lütfen tekrar deneyin.")
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setCurrentUser(null)
    setError(null)
    console.log("Çıkış yapıldı") // Debug için
  }

  const updateUserProfile = async (userData) => {
    try {
      if (!currentUser) throw new Error("Kullanıcı girişi yapılmamış")

      // User servisi üzerinden profil güncelleme
      const updatedUser = await userService.updateUser(currentUser.id, userData)
      setCurrentUser(updatedUser)
      setError(null)

      return updatedUser
    } catch (error) {
      setError(error.message || "Profil güncellenemedi. Lütfen tekrar deneyin.")
      throw error
    }
  }

  const value = {
    currentUser,
    token,
    error,
    login,
    register,
    logout,
    updateUserProfile,
    loading,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
