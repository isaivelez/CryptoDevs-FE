import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Configuración global de Axios para CORS
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

export const qrCodeService = {
  // Generar código QR para un empleado
  generateQRCodeForUser: async (userId) => {
    try {
      const response = await axios.post(`${API_URL}/qr-codes/generate/user/${userId}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error generating QR code for user:', error);
      throw error;
    }
  },

  // Generar código QR para un visitante
  generateQRCodeForVisitor: async (visitorId) => {
    try {
      const response = await axios.post(`${API_URL}/qr-codes/generate/visitor/${visitorId}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error generating QR code for visitor:', error);
      throw error;
    }
  },

  // Obtener imagen de código QR
  getQRCodeImage: (qrCodeId) => {
    return `${API_URL}/qr-codes/image/${qrCodeId}`;
  },

  // Escanear código QR
  scanQRCode: async (code, accessType) => {
    try {
      const response = await axios.post(`${API_URL}/qr-codes/scan`, {
        code,
        access_type: accessType
      });
      return response.data;
    } catch (error) {
      console.error('Error scanning QR code:', error);
      throw error;
    }
  },

  // Escanear código QR desde una imagen
  scanQRCodeImage: async (imageFile, accessType) => {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      
      const response = await axios.post(
        `${API_URL}/qr-codes/scan-image?access_type=${accessType}`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error scanning QR code image:', error);
      throw error;
    }
  }
};
