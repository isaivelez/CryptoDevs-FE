import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import UserSearch from './components/UserSearch';
import './styles/main.scss';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-dark-900 text-white">
          <Header />
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<UserSearch />} />
              <Route path="/dashboard/*" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
