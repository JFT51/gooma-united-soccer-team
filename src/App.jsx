import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import Navigation from './components/Navigation.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Calendar from './pages/Calendar.jsx';
import Players from './pages/Players.jsx';
import News from './pages/News.jsx';
import History from './pages/History.jsx';
import Admin from './pages/Admin.jsx';
import PlayerProfile from './pages/PlayerProfile.jsx';
import Privacy from './pages/Privacy.jsx';
import Terms from './pages/Terms.jsx';
import Contact from './pages/Contact.jsx';
import './App.css';

// Scroll to top component
const ScrollToTop = () => {
  const location = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <ScrollToTop />
          <Navigation />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/players" element={<Players />} />
              <Route path="/news" element={<News />} />
              <Route path="/history" element={<History />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/player-profile" element={<PlayerProfile />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
