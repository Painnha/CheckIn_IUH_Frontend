import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { participantsAPI } from '../api';
import './Statistics.css';

const Statistics = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedRoom, setExpandedRoom] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await participantsAPI.getStats();
      setStats(data);
      setError('');
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Không thể tải thống kê. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const toggleRoom = (room) => {
    setExpandedRoom(expandedRoom === room ? null : room);
  };

  const getRoomColor = (room) => {
    const colors = {
      'Mặt trận': '#f093fb',
      'Công đoàn': '#4facfe',
      'Cựu chiến binh': '#43e97b',
      'Đoàn Thanh niên': '#fa709a',
      'Phụ nữ': '#feca57',
    };
    return colors[room] || '#667eea';
  };

  const getProgressPercentage = (checkedIn, total) => {
    if (total === 0) return 0;
    return Math.round((checkedIn / total) * 100);
  };

  if (loading) {
    return (
      <div className="statistics-page">
        <div className="page-header">
          <button onClick={() => navigate('/home')} className="back-button">
            ← Quay lại
          </button>
          <h1>Thống Kê Check-in</h1>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải thống kê...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="statistics-page">
        <div className="page-header">
          <button onClick={() => navigate('/home')} className="back-button">
            ← Quay lại
          </button>
          <h1>Thống Kê Check-in</h1>
        </div>
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchStats} className="retry-button">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="statistics-page">
      <div className="page-header">
        <button onClick={() => navigate('/home')} className="back-button">
          ← Quay lại
        </button>
        <h1>Thống Kê Check-in</h1>
        <button onClick={fetchStats} className="refresh-button">
          🔄 Làm mới
        </button>
      </div>

      <div className="statistics-content">
        {/* Thống kê theo room */}
        <div className="rooms-section">
          <h2>Thống Kê Theo Phòng</h2>
          <div className="rooms-list">
            {Object.entries(stats.roomStats).map(([room, roomData]) => (
              <div key={room} className="room-card">
                <div
                  className="room-header"
                  onClick={() => toggleRoom(room)}
                  style={{ '--room-color': getRoomColor(room) }}
                >
                  <div className="room-info">
                    <h3>{room}</h3>
                    <div className="room-summary">
                      <span className="room-stat">
                        Đã check-in: <strong>{roomData.checkedIn}/{roomData.total}</strong>
                      </span>
                      <span className="room-percentage">
                        {getProgressPercentage(roomData.checkedIn, roomData.total)}%
                      </span>
                    </div>
                  </div>
                  <div className="room-actions">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${getProgressPercentage(roomData.checkedIn, roomData.total)}%`,
                          backgroundColor: getRoomColor(room),
                        }}
                      ></div>
                    </div>
                    <span className="expand-icon">
                      {expandedRoom === room ? '▼' : '▶'}
                    </span>
                  </div>
                </div>

                {expandedRoom === room && (
                  <div className="room-details">
                    <div className="participants-list">
                      {stats.checkedInParticipants
                        .filter(p => p.room === room)
                        .map((participant) => (
                          <div key={participant.id} className="participant-item checked-in">
                            <span className="participant-id">{participant.id}</span>
                          </div>
                        ))}
                      {roomData.notCheckedInList.map((participant) => (
                        <div key={participant.id} className="participant-item">
                          <span className="participant-id">{participant.id}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;

