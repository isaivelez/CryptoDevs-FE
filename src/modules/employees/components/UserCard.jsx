import { useNavigate } from 'react-router-dom';
import { HiOutlineQrcode } from 'react-icons/hi';

const UserCard = ({ user, onBack }) => {
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-md bg-dark-800 rounded-xl shadow-lg overflow-hidden">
      <div className="px-6 py-4">
        
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">User Information</h3>
          <button
            onClick={onBack}
            className="text-primary hover:text-primary-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-dark-400 text-sm">Full Name</label>
            <p className="text-white">{user.first_name} {user.last_name}</p>
          </div>
          
          <div>
            <label className="block text-dark-400 text-sm">Email</label>
            <p className="text-white">{user.email}</p>
          </div>
          
          <div>
            <label className="block text-dark-400 text-sm">Document Number</label>
            <p className="text-white">{user.document_number}</p>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4 bg-dark-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${user.active ? 'bg-primary' : 'bg-red-500'}`} />
            <span className="text-dark-300">
              {user.active ? 'Active User' : 'Inactive User'}
            </span>
          </div>
          
          <button
            onClick={() => navigate(`/dashboard/qr-generator/empleado/${user.id}`)}
            className="flex items-center space-x-2 px-3 py-1 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            <HiOutlineQrcode className="w-5 h-5" />
            <span>Generate QR</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
