import { useState, useEffect, useRef } from 'react';
import backgroundImage from '../assets/backgroundCCB.png';
import HomeButton from './HomeButton';
import { useSocket } from '../context/SocketContext';
import './CuuChienBinh.css';

const CuuChienBinh = () => {
  const socket = useSocket();
  const [participant, setParticipant] = useState(null);
  const queueRef = useRef([]);
  const timeoutRef = useRef(null);
  const isDisplayingRef = useRef(false);

  useEffect(() => {
    if (!socket) return;

    // Join vào room cuuchienbinh
    socket.emit('join-room', 'cuuchienbinh');
    console.log('Joined room: cuuchienbinh');

    // Hàm hiển thị participant tiếp theo
    const showNextParticipant = () => {
      if (queueRef.current.length === 0) {
        isDisplayingRef.current = false;
        return;
      }

      const nextParticipant = queueRef.current.shift();
      setParticipant(nextParticipant);
      isDisplayingRef.current = true;

      // Sau 10 giây, chuyển sang người tiếp theo
      timeoutRef.current = setTimeout(() => {
        showNextParticipant();
      }, 10000);
    };

    // Lắng nghe event welcome
    const handleWelcome = (data) => {
      console.log('Welcome event received:', data);
      
      // Thêm vào hàng đợi
      queueRef.current.push(data);
      
      // Nếu không có người nào đang hiển thị, hiển thị ngay
      if (!isDisplayingRef.current) {
        showNextParticipant();
      }
    };

    socket.on('welcome', handleWelcome);

    return () => {
      socket.off('welcome', handleWelcome);
      socket.emit('leave-room', 'cuuchienbinh');
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [socket]);

  return (
    <div className="cuuchienbinh-page">
      <img src={backgroundImage} alt="Background" className="cuuchienbinh-background" />
      <HomeButton />

      <div className="cuuchienbinh-text-container">
        <div className="text-line cuuchienbinh-welcome-text">Chào mừng</div>
        <div className="text-line cuuchienbinh-title-text">Đồng chí</div>
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

