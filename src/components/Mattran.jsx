import { useState, useEffect } from 'react';
import backgroundImage from '../assets/backgroundMT.png';
import HomeButton from './HomeButton';
import { useSocket } from '../context/SocketContext';
import './Mattran.css';

const Mattran = () => {
  const socket = useSocket();
  const [participant, setParticipant] = useState(null);

  useEffect(() => {
    if (!socket) return;

    // Room Mặt trận luôn join tất cả các room để hiển thị mọi check-in
    const roomsToJoin = ['mattran', 'congdoan', 'cuuchienbinh', 'doantn', 'phunu'];

    // Join vào tất cả các room
    roomsToJoin.forEach(room => {
      socket.emit('join-room', room);
      console.log(`Joined room: ${room}`);
    });

    // Lắng nghe event welcome
    const handleWelcome = (data) => {
      console.log('Welcome event received:', data);
      // Hiển thị ngay lập tức
      setParticipant(data);
    };

    socket.on('welcome', handleWelcome);

    return () => {
      socket.off('welcome', handleWelcome);
      // Leave tất cả các room
      roomsToJoin.forEach(room => {
        socket.emit('leave-room', room);
      });
    };
  }, [socket]);

  return (
    <div className="mattran-page">
      <img src={backgroundImage} alt="Background" className="mattran-background" />
      <HomeButton />

      <div className="mattran-text-container">
        <div className="text-line mattran-welcome-text">CHÀO MỪNG</div>
        <div className="text-line mattran-title-text">Đại biểu</div>
        <div className="text-line mattran-name-text">
          {participant ? participant.name : 'Đang chờ...'}
        </div>
        <div className="text-line mattran-position-text">
          {participant ? participant.organization : ''}
        </div>
        <div className="text-line mattran-attend-text">tham dự</div>
        <div className="text-line mattran-event-text">ĐẠI HỘI ĐẠI BIỂU</div>
        <div className="text-line mattran-organization-text">MẶT TRẬN TỔ QUỐC VIỆT NAM PHƯỜNG AN NHƠN</div>
        <div className="text-line mattran-period-text">LẦN THỨ I, NHIỆM KỲ 2025 - 2030</div>
      </div>
    </div>
  );
};

export default Mattran;

