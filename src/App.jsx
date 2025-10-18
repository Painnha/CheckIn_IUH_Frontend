import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Login from './components/Login';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import ScanQR from './components/ScanQR';
import Statistics from './components/Statistics';
import Mattran from './components/Mattran';
import CongDoan from './components/CongDoan';
import CuuChienBinh from './components/CuuChienBinh';
import DoanTN from './components/DoanTN';
import PhuNu from './components/PhuNu';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scan-qr"
            element={
              <ProtectedRoute>
                <ScanQR />
              </ProtectedRoute>
            }
          />
          <Route
            path="/statistics"
            element={
              <ProtectedRoute>
                <Statistics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mattran"
            element={
              <ProtectedRoute>
                <Mattran />
              </ProtectedRoute>
            }
          />
          <Route
            path="/congdoan"
            element={
              <ProtectedRoute>
                <CongDoan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cuuchienbinh"
            element={
              <ProtectedRoute>
                <CuuChienBinh />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doantn"
            element={
              <ProtectedRoute>
                <DoanTN />
              </ProtectedRoute>
            }
          />
          <Route
            path="/phunu"
            element={
              <ProtectedRoute>
                <PhuNu />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
