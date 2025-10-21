import { useState, useEffect } from 'react';
import backgroundImage from '../assets/backgroundCCB.png';
import HomeButton from './HomeButton';
import { useSocket } from '../context/SocketContext';
import './CuuChienBinh.css';

const CuuChienBinh = () => {
  const socket = useSocket();
  const [participant, setParticipant] = useState(null);

  useEffect(() => {
    if (!socket) return;

    // Join vào room cuuchienbinh
    socket.emit('join-room', 'cuuchienbinh');
    console.log('Joined room: cuuchienbinh');

    // Lắng nghe event welcome
    const handleWelcome = (data) => {
      console.log('Welcome event received:', data);
      // Hiển thị ngay lập tức
      setParticipant(data);
    };

    socket.on('welcome', handleWelcome);

    return () => {
      socket.off('welcome', handleWelcome);
      socket.emit('leave-room', 'cuuchienbinh');
    };
  }, [socket]);

  return (
    <div className="cuuchienbinh-page">
      <img src={backgroundImage} alt="Background" className="cuuchienbinh-background" />
      <HomeButton />

      <div className="cuuchienbinh-text-container">
        <div className="text-line cuuchienbinh-welcome-text">Chào mừng</div>
        <div className="text-line cuuchienbinh-title-text">Đại biểu</div>
        <div className="text-line cuuchienbinh-name-text">
          {participant ? participant.name : 'Đang chờ...'}
        </div>
        <div className="text-line cuuchienbinh-position-text">
          {participant ? participant.organization : ''}
        </div>
        <div className="text-line cuuchienbinh-attend-text">tham dự</div>
        <div className="text-line cuuchienbinh-event-text">ĐẠI HỘI ĐẠI BIỂU</div>
        <div className="text-line cuuchienbinh-organization-text">HỘI CỰU CHIẾN BINH PHƯỜNG AN NHƠN</div>
        <div className="text-line cuuchienbinh-period-text">LẦN THỨ I, NHIỆM KỲ 2025 - 2030</div>
      </div>
    </div>
  );
};

export default CuuChienBinh;

