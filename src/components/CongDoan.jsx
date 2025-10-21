import { useState, useEffect } from 'react';
import backgroundImage from '../assets/backgroundCD.png';
import HomeButton from './HomeButton';
import { useSocket } from '../context/SocketContext';
import './CongDoan.css';

const CongDoan = () => {
  const socket = useSocket();
  const [participant, setParticipant] = useState(null);

  useEffect(() => {
    if (!socket) return;

    // Join vào room congdoan
    socket.emit('join-room', 'congdoan');
    console.log('Joined room: congdoan');

    // Lắng nghe event welcome
    const handleWelcome = (data) => {
      console.log('Welcome event received:', data);
      // Hiển thị ngay lập tức
      setParticipant(data);
    };

    socket.on('welcome', handleWelcome);

    return () => {
      socket.off('welcome', handleWelcome);
      socket.emit('leave-room', 'congdoan');
    };
  }, [socket]);

  return (
    <div className="congdoan-page">
      <img src={backgroundImage} alt="Background" className="congdoan-background" />
      <HomeButton />

      <div className="congdoan-text-container">
        <div className="text-line congdoan-welcome-text">CHÀO MỪNG</div>
        <div className="text-line congdoan-title-text">Đại biểu</div>
        <div className="text-line congdoan-name-text">
          {participant ? participant.name : 'Đang chờ...'}
        </div>
        <div className="text-line congdoan-position-text">
          {participant ? participant.organization : ''}
        </div>
        <div className="text-line congdoan-attend-text">tham dự</div>
        <div className="text-line congdoan-event-text">ĐẠI HỘI ĐẠI BIỂU</div>
        <div className="text-line congdoan-organization-text">CÔNG ĐOÀN PHƯỜNG AN NHƠN</div>
        <div className="text-line congdoan-period-text">LẦN THỨ I, NHIỆM KỲ 2025 - 2030</div>
      </div>
    </div>
  );
};

export default CongDoan;

