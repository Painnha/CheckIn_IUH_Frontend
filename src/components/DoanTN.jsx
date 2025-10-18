import { useState, useEffect, useRef } from 'react';
import backgroundImage from '../assets/backgroundDTN.png';
import HomeButton from './HomeButton';
import { useSocket } from '../context/SocketContext';
import './DoanTN.css';

const DoanTN = () => {
  const socket = useSocket();
  const [participant, setParticipant] = useState(null);
  const queueRef = useRef([]);
  const timeoutRef = useRef(null);
  const isDisplayingRef = useRef(false);

  useEffect(() => {
    if (!socket) return;

    // Join vào room doantn
    socket.emit('join-room', 'doantn');
    console.log('Joined room: doantn');

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
      socket.emit('leave-room', 'doantn');
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [socket]);

  return (
    <div className="doantn-page">
      <img src={backgroundImage} alt="Background" className="doantn-background" />
      <HomeButton />

      <div className="doantn-text-container">
        <div className="text-line doantn-welcome-text">Chào mừng</div>
        <div className="text-line doantn-title-text">Đồng chí</div>
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

