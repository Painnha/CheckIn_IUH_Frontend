import { useState, useEffect } from 'react';
import backgroundImage from '../assets/backgroundDTN.png';
import HomeButton from './HomeButton';
import { useSocket } from '../context/SocketContext';
import './DoanTN.css';

const DoanTN = () => {
  const socket = useSocket();
  const [participant, setParticipant] = useState(null);

  useEffect(() => {
    if (!socket) return;

    // Join vào room doantn
    socket.emit('join-room', 'doantn');
    console.log('Joined room: doantn');

    // Lắng nghe event welcome
    const handleWelcome = (data) => {
      console.log('Welcome event received:', data);
      // Hiển thị ngay lập tức
      setParticipant(data);
    };

    socket.on('welcome', handleWelcome);

    return () => {
      socket.off('welcome', handleWelcome);
      socket.emit('leave-room', 'doantn');
    };
  }, [socket]);

  return (
    <div className="doantn-page">
      <img src={backgroundImage} alt="Background" className="doantn-background" />
      <HomeButton />

      <div className="doantn-text-container">
        <div className="text-line doantn-welcome-text">Chào mừng</div>
        <div className="text-line doantn-title-text">Đại biểu</div>
        <div className="text-line doantn-name-text">
          {participant ? participant.name : 'Đang chờ...'}
        </div>
        <div className="text-line doantn-position-text">
          {participant ? participant.organization : ''}
        </div>
        <div className="text-line doantn-attend-text">tham dự</div>
        <div className="text-line doantn-event-text">ĐẠI HỘI ĐẠI BIỂU</div>
        <div className="text-line doantn-organization-text">ĐOÀN TNCS HỒ CHÍ MINH PHƯỜNG AN NHƠN </div>
        <div className="text-line doantn-period-text">LẦN THỨ I, NHIỆM KỲ 2025 - 2030</div>
      </div>
    </div>
  );
};

export default DoanTN;

