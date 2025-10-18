import { useNavigate } from 'react-router-dom';
import './HomeButton.css';

const HomeButton = () => {
  const navigate = useNavigate();

  return (
    <div className="home-icon-wrapper" onClick={() => navigate('/home')}>
      <div className="home-icon">⌂</div>
    </div>
  );
};

export default HomeButton;

