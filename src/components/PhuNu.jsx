import { useState, useEffect } from 'react';
import backgroundImage from '../assets/backgroundPN.png';
import HomeButton from './HomeButton';
import { useSocket } from '../context/SocketContext';
import './PhuNu.css';

const PhuNu = () => {
  const socket = useSocket();
  const [participant, setParticipant] = useState(null);

  useEffect(() => {
    if (!socket) return;

    // Join vào room phunu
    socket.emit('join-room', 'phunu');
    console.log('Joined room: phunu');

    // Lắng nghe event welcome
    const handleWelcome = (data) => {
      console.log('Welcome event received:', data);
      // Hiển thị ngay lập tức
      setParticipant(data);
    };

    socket.on('welcome', handleWelcome);

    return () => {
      socket.off('welcome', handleWelcome);
      socket.emit('leave-room', 'phunu');
    };
  }, [socket]);

  return (
    <div className="phunu-page">
      <img src={backgroundImage} alt="Background" className="phunu-background" />
      <HomeButton />

      <div className="phunu-text-container">
        <div className="text-line phunu-welcome-text">Chào mừng</div>
        <div className="text-line phunu-title-text">Đại biểu</div>
        <div className="text-line phunu-name-text">
          {participant ? participant.name : 'Đang chờ...'}
        </div>
        <div className="text-line phunu-position-text">
          {participant ? participant.organization : ''}
        </div>
        <div className="text-line phunu-attend-text">tham dự</div>
        <div className="text-line phunu-event-text">ĐẠI HỘI ĐẠI BIỂU</div>
        <div className="text-line phunu-organization-text">PHỤ NỮ PHƯỜNG AN NHƠN</div>
        <div className="text-line phunu-period-text">LẦN THỨ I, NHIỆM KỲ 2025 - 2030</div>
      </div>
    </div>
  );
};

export default PhuNu;

