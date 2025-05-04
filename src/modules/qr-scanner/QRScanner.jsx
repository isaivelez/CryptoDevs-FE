import { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { toast } from 'react-toastify';
import { qrCodeService } from './qrCodeService';
import { HiOutlineCamera, HiOutlineQrcode, HiOutlineStop } from 'react-icons/hi';

const QRScanner = () => {
  const webcamRef = useRef(null);
  const [captureEnabled, setCaptureEnabled] = useState(false);
  const [accessType, setAccessType] = useState('entry');
  const [processing, setProcessing] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  const handleCameraError = useCallback((error) => {
    console.error('Camera error:', error);
    setCameraError('Failed to access camera. Please check permissions and try again.');
  }, []);

  const enableCapture = () => {
    setCaptureEnabled(true);
    setScanResult(null);
  };

  const disableCapture = () => {
    setCaptureEnabled(false);
  };

  const captureImage = useCallback(async () => {
    if (!webcamRef.current || !captureEnabled || processing) return;

    try {
      setProcessing(true);
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        console.error('Failed to capture image');
        return;
      }

      // Convert base64 to blob
      const byteString = atob(imageSrc.split(',')[1]);
      const mimeString = imageSrc.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], 'qr-scan.jpg', { type: 'image/jpeg' });

      // Send to backend for processing
      const result = await qrCodeService.scanQRCodeImage(file, accessType);
      
      setScanResult({
        success: true,
        message: result.message,
        timestamp: new Date().toLocaleString()
      });
      
      toast.success('QR code scanned successfully');
      disableCapture();
    } catch (error) {
      console.error('Error scanning QR code:', error);
      setScanResult({
        success: false,
        message: error.response?.data?.detail || 'Failed to scan QR code',
        timestamp: new Date().toLocaleString()
      });
      toast.error('Error scanning QR code');
    } finally {
      setProcessing(false);
    }
  }, [webcamRef, captureEnabled, processing, accessType]);

  // Automatic scanning interval
  useEffect(() => {
    let scanInterval;
    
    if (captureEnabled && !processing) {
      // Start automatic scanning every 2 seconds
      scanInterval = setInterval(() => {
        captureImage();
      }, 2000);
    }
    
    return () => {
      // Clean up interval on component unmount or when scanning is disabled
      if (scanInterval) {
        clearInterval(scanInterval);
      }
    };
  }, [captureEnabled, processing, captureImage]);

  const handleManualEntry = async (event) => {
    event.preventDefault();
    const code = event.target.elements.qrCode.value.trim();
    
    if (!code) {
      toast.error('Please enter a QR code');
      return;
    }
    
    try {
      setProcessing(true);
      const result = await qrCodeService.scanQRCode(code, accessType);
      
      setScanResult({
        success: true,
        message: result.message,
        timestamp: new Date().toLocaleString()
      });
      
      toast.success('QR code processed successfully');
      event.target.reset();
    } catch (error) {
      console.error('Error processing QR code:', error);
      setScanResult({
        success: false,
        message: error.response?.data?.detail || 'Failed to process QR code',
        timestamp: new Date().toLocaleString()
      });
      toast.error('Error processing QR code');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col space-y-8 p-6 bg-dark-800 rounded-xl shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white flex items-center">
        <HiOutlineQrcode className="w-7 h-7 mr-2 text-primary" />
        QR Code Scanner
      </h2>
      
      {/* Access Type Selection */}
      <div className="flex space-x-4 bg-dark-700 p-4 rounded-lg">
        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio text-primary"
            name="accessType"
            value="entry"
            checked={accessType === 'entry'}
            onChange={() => setAccessType('entry')}
          />
          <span className="ml-2 text-white">Entry</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio text-primary"
            name="accessType"
            value="exit"
            checked={accessType === 'exit'}
            onChange={() => setAccessType('exit')}
          />
          <span className="ml-2 text-white">Exit</span>
        </label>
      </div>
      
      {/* Camera Section */}
      <div className="border border-dark-600 rounded-xl p-5 bg-dark-700">
        <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
          <HiOutlineCamera className="w-5 h-5 mr-2 text-primary" />
          Scan with Camera
        </h3>
        
        {captureEnabled ? (
          <div className="flex flex-col items-center">
            {cameraError ? (
              <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg relative">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {cameraError}</span>
              </div>
            ) : (
              <>
                <div className="relative border-2 border-primary/30 rounded-lg overflow-hidden">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                      facingMode: 'environment',
                      width: 640,
                      height: 480
                    }}
                    onUserMediaError={handleCameraError}
                    className="w-full h-full"
                  />
                  {processing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 flex space-x-4 w-full">
                  <div className="flex-1 px-4 py-2 bg-dark-600 text-primary rounded-md flex items-center justify-center">
                    {processing ? 'Processing...' : 'Scanning automatically...'}
                  </div>
                  <button
                    onClick={disableCapture}
                    className="flex-1 px-4 py-2 bg-dark-600 text-white rounded-md hover:bg-dark-500 transition-colors flex items-center justify-center space-x-2"
                  >
                    <HiOutlineStop className="w-5 h-5" />
                    <span>Stop Scanning</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={enableCapture}
              className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors flex items-center space-x-2"
            >
              <HiOutlineCamera className="w-5 h-5" />
              <span>Enable Camera</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Manual Entry Section */}
      <div className="border border-dark-600 rounded-xl p-5 bg-dark-700">
        <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
          <HiOutlineQrcode className="w-5 h-5 mr-2 text-primary" />
          Manual Entry
        </h3>
        <form onSubmit={handleManualEntry}>
          <div className="mb-4">
            <label htmlFor="qrCode" className="block text-sm font-medium text-dark-300">
              QR Code
            </label>
            <input
              type="text"
              id="qrCode"
              name="qrCode"
              className="mt-1 block w-full rounded-md bg-dark-600 border-dark-500 text-white shadow-sm focus:border-primary focus:ring-primary"
              placeholder="Enter QR code value"
              required
            />
          </div>
          <button
            type="submit"
            disabled={processing}
            className="w-full px-4 py-3 bg-primary text-white rounded-md hover:bg-primary-600 disabled:bg-primary/50 transition-colors flex items-center justify-center space-x-2"
          >
            <HiOutlineQrcode className="w-5 h-5" />
            <span>{processing ? 'Processing...' : 'Process QR Code'}</span>
          </button>
        </form>
      </div>
      
      {/* Results Section */}
      {scanResult && (
        <div className={`border rounded-xl p-5 ${scanResult.success ? 'bg-green-900/20 border-green-700' : 'bg-red-900/20 border-red-700'}`}>
          <h3 className="text-lg font-semibold mb-3 text-white">Scan Result</h3>
          <div className="space-y-2">
            <div className="bg-dark-700 rounded-lg p-3">
              <p className="text-dark-300"><span className="text-primary font-medium">Status:</span> {scanResult.success ? 'Success' : 'Failed'}</p>
            </div>
            <div className="bg-dark-700 rounded-lg p-3">
              <p className="text-dark-300"><span className="text-primary font-medium">Message:</span> {scanResult.message}</p>
            </div>
            <div className="bg-dark-700 rounded-lg p-3">
              <p className="text-dark-300"><span className="text-primary font-medium">Time:</span> {scanResult.timestamp}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
