import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { toast } from 'react-toastify';
import { qrCodeService } from './qrCodeService';
import { HiOutlineDownload, HiOutlineArrowLeft } from 'react-icons/hi';

const QRGenerator = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        setLoading(true);
        let response;
        
        if (type === 'employee') {
          response = await qrCodeService.generateQRCodeForUser(id);
        } else if (type === 'empleado') {
          response = await qrCodeService.generateQRCodeForUser(id);
        } else if (type === 'visitor') {
          response = await qrCodeService.generateQRCodeForVisitor(id);
        } else if (type === 'visitante') {
          response = await qrCodeService.generateQRCodeForVisitor(id);
        } else {
          throw new Error('Invalid type specified');
        }
        
        setQrData(response);
      } catch (err) {
        console.error('Error generating QR code:', err);
        setError('Failed to generate QR code. Please try again.');
        toast.error('Error generating QR code');
      } finally {
        setLoading(false);
      }
    };

    generateQRCode();
  }, [type, id]);

  const handleDownload = () => {
    const svg = document.getElementById('qr-code');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      // Download the PNG file
      const downloadLink = document.createElement('a');
      downloadLink.download = `qr-code-${type}-${id}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-dark-300">Generating QR Code...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <button 
          onClick={handleBack}
          className="mt-4 px-4 py-2 bg-dark-700 text-white rounded-md hover:bg-dark-600 flex items-center space-x-2 transition-colors"
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
          <span>Go Back</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-dark-800 rounded-xl shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-white">
        QR Code for {type === 'employee' || type === 'empleado' ? 'Employee' : 'Visitor'}
      </h2>
      
      {qrData && (
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <QRCode
            id="qr-code"
            value={qrData.code}
            size={256}
            level="H"
            bgColor="#FFFFFF"
            fgColor="#000000"
          />
        </div>
      )}
      
      <div className="mt-6 text-dark-300 w-full space-y-2">
        <div className="bg-dark-700 rounded-lg p-3">
          <p><span className="text-primary font-medium">ID:</span> {qrData?.id}</p>
        </div>
        <div className="bg-dark-700 rounded-lg p-3">
          <p><span className="text-primary font-medium">Created:</span> {new Date(qrData?.created_at).toLocaleString()}</p>
        </div>
        <div className="bg-dark-700 rounded-lg p-3">
          <p><span className="text-primary font-medium">Expires:</span> {qrData?.expires_at ? new Date(qrData.expires_at).toLocaleString() : 'Never'}</p>
        </div>
      </div>
      
      <div className="mt-8 flex space-x-4 w-full">
        <button
          onClick={handleDownload}
          className="flex-1 px-4 py-3 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2"
        >
          <HiOutlineDownload className="w-5 h-5" />
          <span>Download QR</span>
        </button>
        <button
          onClick={handleBack}
          className="flex-1 px-4 py-3 bg-dark-700 text-white rounded-md hover:bg-dark-600 transition-colors flex items-center justify-center space-x-2"
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
          <span>Go Back</span>
        </button>
      </div>
    </div>
  );
};

export default QRGenerator;
