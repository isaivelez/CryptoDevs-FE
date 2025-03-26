import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import UsersTable from './components/UsersTable'
import UserForm from './components/UserForm'
import UserSearch from './components/UserSearch'
import Button from './components/Button'
import './styles/main.scss'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-900 text-white">
        <nav className="bg-dark-800 shadow-lg mb-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex space-x-8 items-center">
                <Link 
                  to="/" 
                  className="text-white hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Search User
                </Link>
                <Link 
                  to="/users" 
                  className="text-white hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  All Users
                </Link>
                <Link 
                  to="/form" 
                  className="text-white hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Form
                </Link>
              </div>
              <div className="flex items-center">
                <Button variant="primary" size="sm">
                  Download
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <Routes>
              <Route path="/" element={<UserSearch />} />
              <Route path="/users" element={<UsersTable />} />
              <Route path="/form" element={<UserForm />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  )
}

export default App
