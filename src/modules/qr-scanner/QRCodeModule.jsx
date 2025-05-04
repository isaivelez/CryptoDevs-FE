import QRScanner from './QRScanner';

const QRCodeModule = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">QR Code Access Control</h1>
      
      {/* Content */}
             <QRScanner />
    </div>
  );
};

export default QRCodeModule;
