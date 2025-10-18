import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode, Html5QrcodeScanType } from 'html5-qrcode';
import { participantsAPI } from '../api';
import './ScanQR.css';

const ScanQR = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scannerRef = useRef(null);
  const qrCodeRegionId = 'qr-reader';

  useEffect(() => {
    // Cleanup khi component unmount
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      setError('');
      
      // Detect mobile device
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isSmallScreen = window.innerWidth < 768;
      
      // Optimize config for mobile
      const config = {
        fps: isMobile ? 15 : 10,
        qrbox: function(viewfinderWidth, viewfinderHeight) {
          // Responsive QR box size
          if (isMobile) {
            const size = Math.min(viewfinderWidth, viewfinderHeight) * 0.7;
            return { width: size, height: size };
          }
          return { width: 250, height: 250 };
        },
        aspectRatio: 1.0,
        disableFlip: false,
        rememberLastUsedCamera: true,
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
      };

      const html5QrCode = new Html5Qrcode(qrCodeRegionId);
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        config,
        onScanSuccess,
        onScanFailure
      );
    } catch (err) {
      setError('Không thể khởi động camera. Vui lòng cho phép truy cập camera.');
      console.error(err);
      setIsScanning(false);
    }
  };

  // Start scanning khi isScanning thay đổi thành true
  useEffect(() => {
    if (isScanning) {
      startScanning();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScanning]);

  const stopScanning = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
      }
      setIsScanning(false);
      setError('');
    } catch (err) {
      console.error('Error stopping scanner:', err);
    }
  };

  const onScanSuccess = async (decodedText, decodedResult) => {
    // Dừng scanner
    stopScanning();
    setIsLoading(true);

    try {
      // Gọi API check-in
      const response = await participantsAPI.checkIn(decodedText);
      console.log('Check-in response:', response);
      
      // Hiển thị kết quả
      setScanResult({
        id: decodedText,
        name: response.participant.name,
        organization: response.participant.organization,
        room: response.participant.room
      });

      // Tự động xóa thông báo sau 10 giây
      setTimeout(() => {
        setScanResult(null);
      }, 10000);
    } catch (err) {
      console.error('Check-in error:', err);
      setError(err.response?.data?.message || 'Lỗi khi check-in');
      setTimeout(() => {
        setError('');
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const onScanFailure = (error) => {
    // Không cần xử lý lỗi scan liên tục
  };

  const handleToggleScan = () => {
    if (isScanning) {
      stopScanning();
    } else {
      setIsScanning(true);
    }
  };

  return (
    <div className="scanqr-page">
      <div className="page-header">
        <button onClick={() => navigate('/home')} className="back-button">
          ← Quay lại
        </button>
        <h1>Quét Mã QR</h1>
      </div>

      <div className="scanqr-content">
        <div className="camera-container">
          {isScanning && (
            <div id={qrCodeRegionId} className="qr-reader"></div>
          )}
          {!isScanning && !scanResult && (
            <div className="camera-placeholder">
              <div className="placeholder-icon">📱</div>
              <p>Camera chưa được khởi động</p>
            </div>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {isLoading && (
          <div className="loading-message">
            <div className="loading-spinner"></div>
            <p>Đang xử lý...</p>
          </div>
        )}

        <div className="button-container">
          <button
            onClick={handleToggleScan}
            className={`scan-button ${isScanning ? 'stop' : 'start'}`}
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : isScanning ? 'Dừng quét' : 'Quét mã QR'}
          </button>
        </div>
        {scanResult && (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h3>Check-in thành công!</h3>
            <p className="scan-name">Tên: {scanResult.name}</p>
            <p className="scan-organization">Tổ chức: {scanResult.organization}</p>
            <p className="scan-room">Phòng: {scanResult.room}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanQR;

