import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Homepage from "./pages/Homepage"
import Event from "./pages/Event"
import Payment from "./pages/Payment"
import AddTicket from "./pages/AddTicket"
import EditTicket from "./pages/EditTicket"
import MyTickets from "./pages/MyTickets" // Yeni sayfayı import et
import Navbar from "./components/Navbar"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Homepage />} />
            <Route path="/event/:id" element={<Event />} />
            <Route
              path="/payment/:orderId"
              element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-ticket"
              element={
                <ProtectedRoute>
                  <AddTicket />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-ticket/:id"
              element={
                <ProtectedRoute>
                  <EditTicket />
                </ProtectedRoute>
              }
            />
            {/* Biletlerim sayfası için yeni route */}
            <Route
              path="/my-tickets"
              element={
                <ProtectedRoute>
                  <MyTickets />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
