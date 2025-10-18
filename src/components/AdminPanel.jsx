import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { participantsAPI } from '../api';
import './AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [manualId, setManualId] = useState('');

  const handleSetAllCheckIn = async (value) => {
    if (!window.confirm(`Bạn có chắc muốn đặt tất cả check-in = ${value}?`)) {
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      
      const endpoint = value ? '/participants/checkin/all/true' : '/participants/checkin/all/false';
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(`✅ ${data.message}`);
      } else {
        setMessage(`❌ Lỗi: ${data.message}`);
      }
    } catch (err) {
      console.error('Error:', err);
      setMessage('❌ Lỗi khi thực hiện thao tác');
    } finally {
      setLoading(false);
    }
  };

  const handleManualCheckIn = async () => {
    if (!manualId.trim()) {
      setMessage('❌ Vui lòng nhập ID');
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      
      const response = await participantsAPI.checkIn(manualId.trim());
      setMessage(`✅ Check-in thành công: ${response.participant.name} (${response.participant.organization})`);
      setManualId('');
    } catch (err) {
      console.error('Error:', err);
      setMessage(`❌ Lỗi: ${err.response?.data?.message || 'Không tìm thấy đại biểu hoặc đã check-in'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <button onClick={() => navigate('/home')} className="back-button">
          ← Quay lại
        </button>
        <h1>🔐 Quản Lý Bí Mật</h1>
      </div>

      <div className="admin-content">
        {/* Reset tất cả check-in */}
        <div className="admin-section">
          <h2>Reset Check-in Hàng Loạt</h2>
          <div className="admin-buttons">
            <button
              onClick={() => handleSetAllCheckIn(true)}
              disabled={loading}
              className="admin-btn btn-success"
            >
              ✓ Đặt tất cả = TRUE
            </button>
            <button
              onClick={() => handleSetAllCheckIn(false)}
              disabled={loading}
              className="admin-btn btn-danger"
            >
              ✗ Đặt tất cả = FALSE
            </button>
          </div>
        </div>

        {/* Check-in thủ công */}
        <div className="admin-section">
          <h2>Check-in Thủ Công</h2>
          <div className="manual-checkin">
            <input
              type="text"
              placeholder="Nhập ID đại biểu..."
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleManualCheckIn()}
              disabled={loading}
              className="manual-input"
            />
            <button
              onClick={handleManualCheckIn}
              disabled={loading}
              className="admin-btn btn-primary"
            >
              Check-in
            </button>
          </div>
        </div>

        {/* Thông báo */}
        {message && (
          <div className={`admin-message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="admin-loading">
            <div className="loading-spinner"></div>
            <p>Đang xử lý...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

