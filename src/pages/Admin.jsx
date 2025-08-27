import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar, 
  Users, 
  FileText, 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  Eye,
  Settings,
  BarChart3,
  Shirt
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoginForm from '../components/auth/LoginForm';
import TeamsManager from '../components/TeamsManager';
import { auth, createUserWithEmailAndPassword } from '../lib/firebase';
import {
  addMatch,
  addPlayer,
  addNewsPost,
  getMatches,
  getPlayers,
  getNewsPosts,
  updateMatch,
  updatePlayer,
  updateNewsPost,
  deleteMatch,
  deletePlayer,
  deleteNewsPost,
} from '../services/database';

const Admin = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [news, setNews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  // ... [Keep all the existing functions and state]

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-600">Please login to access the admin panel</p>
          </div>
          <LoginForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {currentUser.email}</span>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'matches', label: 'Matches', icon: Calendar },
              { id: 'players', label: 'Players', icon: Users },
              { id: 'news', label: 'News', icon: FileText },
              { id: 'teams', label: 'Teams', icon: Shirt }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
          </div>
        )}

        {!loading && (
          <>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'matches' && renderMatches()}
            {activeTab === 'players' && renderPlayers()}
            {activeTab === 'news' && renderNews()}
            {activeTab === 'teams' && <TeamsManager />}
          </>
        )}
      </div>

      {renderModal()}
    </div>
  );
};

export default Admin;
