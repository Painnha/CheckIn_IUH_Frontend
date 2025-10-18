import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import mattranIcon from '../assets/mattran.png';
import congdoanIcon from '../assets/congdoan.png';
import cuuchienbinhIcon from '../assets/cuuchienbinh.png';
import doantnIcon from '../assets/doantn.png';
import phunuIcon from '../assets/phunu.png';
import './Home.css';

const Home = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuOptions = [
    {
      id: 1,
      title: 'Quét Mã QR',
      icon: '📱',
      isEmoji: true,
      route: '/scan-qr',
      color: '#667eea',
    },
    {
      id: 7,
      title: 'Thống Kê',
      icon: '📊',
      isEmoji: true,
      route: '/statistics',
      color: '#764ba2',
    },
    {
      id: 2,
      title: 'Mặt Trận Tổ Quốc',
      icon: mattranIcon,
      isEmoji: false,
      route: '/mattran',
      color: '#f093fb',
    },
    {
      id: 3,
      title: 'Công Đoàn',
      icon: congdoanIcon,
      isEmoji: false,
      route: '/congdoan',
      color: '#4facfe',
    },
    {
      id: 4,
      title: 'Cựu Chiến Binh',
      icon: cuuchienbinhIcon,
      isEmoji: false,
      route: '/cuuchienbinh',
      color: '#43e97b',
    },
    {
      id: 5,
      title: 'Đoàn TN',
      icon: doantnIcon,
      isEmoji: false,
      route: '/doantn',
      color: '#fa709a',
    },
    {
      id: 6,
      title: 'Phụ Nữ',
      icon: phunuIcon,
      isEmoji: false,
      route: '/phunu',
      color: '#feca57',
    },
  ];

  const handleOptionClick = (route) => {
    navigate(route);
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Hệ Thống Check-in</h1>
        <button onClick={handleLogout} className="logout-button">
          Đăng Xuất
        </button>
      </div>

      <div className="home-content">
        <div className="welcome-card">
          <h2>Chào mừng bạn!</h2>
          <p>Vui lòng chọn một trong các tùy chọn bên dưới</p>
        </div>

        <div className="options-grid">
          {menuOptions.map((option) => (
            <div
              key={option.id}
              className="option-card"
              onClick={() => handleOptionClick(option.route)}
              style={{ '--card-color': option.color }}
            >
              <div className="option-icon-wrapper">
                {option.isEmoji ? (
                  <span className="option-icon-emoji">{option.icon}</span>
                ) : (
                  <img src={option.icon} alt={option.title} className="option-icon-image" />
                )}
              </div>
              <h3 className="option-title">{option.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

