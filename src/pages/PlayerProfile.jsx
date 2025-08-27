import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Edit, 
  Save, 
  Camera, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Trophy,
  Target,
  Activity,
  Award,
  Star,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoginForm from '../components/auth/LoginForm';
import { getPlayerByEmail, updatePlayer } from '../services/database';

const PlayerProfile = () => {
  const { currentUser, logout } = useAuth();
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (currentUser) {
      fetchPlayerData();
    }
  }, [currentUser]);

  const fetchPlayerData = async () => {
    setLoading(true);
    try {
      const player = await getPlayerByEmail(currentUser.email);
      if (player) {
        setPlayerData(player);
        setFormData(player);
      } else {
        // Create default player profile if not found
        const defaultPlayer = {
          name: currentUser.displayName || 'Player Name',
          email: currentUser.email,
          position: '',
          birthDate: '', // Changed from age to birthDate
          nationality: '',
          jerseyNumber: '',
          surname: '',
          phone: '',
          address: '',
          emergencyContact: '',
          medicalInfo: '',
          goals: 0,
          assists: 0,
          matches: 0,
          yellowCards: 0,
          redCards: 0,
          achievements: [],
          socialMedia: {
            instagram: '',
            twitter: '',
            facebook: ''
          },
          profilePicture: '' // Added for profile picture URL
        };
        setPlayerData(defaultPlayer);
        setFormData(defaultPlayer);
      }
    } catch (error) {
      console.error('Error fetching player data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await updatePlayer(playerData.id, formData);
      setPlayerData(formData);
      setEditing(false);
    } catch (error) {
      console.error('Error updating player:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(playerData);
    setEditing(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialMediaChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Player Login</h1>
            <p className="text-gray-600">Please login to access your player profile</p>
          </div>
          <LoginForm />
        </div>
      </div>
    );
  }

  if (loading && !playerData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading your profile...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Player Profile</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {playerData?.name}</span>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-red-600 to-black p-6 text-white text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <User size={48} className="text-gray-400" />
                  </div>
                  {editing && (
                    <button className="absolute bottom-0 right-0 bg-red-600 rounded-full p-2 hover:bg-red-700">
                      <Camera size={16} className="text-white" />
                    </button>
                  )}
                </div>
                <h2 className="text-xl font-bold">{playerData?.name}</h2>
                <p className="text-red-200">{playerData?.position}</p>
                {playerData?.jerseyNumber && (
                  <div className="text-3xl font-bold mt-2">#{playerData.jerseyNumber}</div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{playerData?.goals || 0}</div>
                    <div className="text-sm text-gray-600">Goals</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{playerData?.assists || 0}</div>
                    <div className="text-sm text-gray-600">Assists</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{playerData?.matches || 0}</div>
                    <div className="text-sm text-gray-600">Matches</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {((playerData?.goals || 0) + (playerData?.assists || 0))}
                    </div>
                    <div className="text-sm text-gray-600">G+A</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {!editing ? (
                    <Button 
                      onClick={() => setEditing(true)} 
                      className="w-full bg-red-600 hover:bg-red-700"
                    >
                      <Edit size={16} className="mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button 
                        onClick={handleSave} 
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <Save size={16} className="mr-2" />
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button 
                        onClick={handleCancel} 
                        variant="outline"
                        className="w-full"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User size={20} />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  ) : (
                    <p className="text-gray-900">{playerData?.name || 'Not specified'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  {editing ? (
                    <select
                      value={formData.position || ''}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="">Select Position</option>
                      <option value="Goalkeeper">Goalkeeper</option>
                      <option value="Defender">Defender</option>
                      <option value="Midfielder">Midfielder</option>
                      <option value="Forward">Forward</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{playerData?.position || 'Not specified'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                  {editing ? (
                    <input
                      type="date"
                      value={formData.birthDate || ''}
                      onChange={(e) => handleInputChange('birthDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  ) : (
                    <p className="text-gray-900">{playerData?.birthDate ? new Date(playerData.birthDate).toLocaleDateString() : 'Not specified'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.nationality || ''}
                      onChange={(e) => handleInputChange('nationality', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  ) : (
                    <p className="text-gray-900">{playerData?.nationality || 'Not specified'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jersey Number</label>
                  {editing ? (
                    <input
                      type="number"
                      value={formData.jerseyNumber || ''}
                      onChange={(e) => handleInputChange('jerseyNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  ) : (
                    <p className="text-gray-900">{playerData?.jerseyNumber || 'Not assigned'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  {editing ? (
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  ) : (
                    <p className="text-gray-900">{playerData?.phone || 'Not specified'}</p>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Surname</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.surname || ''}
                    onChange={(e) => handleInputChange('surname', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                ) : (
                  <p className="text-gray-900">{playerData?.surname || 'Not specified'}</p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Mail size={20} />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{playerData?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.emergencyContact || ''}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  ) : (
                    <p className="text-gray-900">{playerData?.emergencyContact || 'Not specified'}</p>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                {editing ? (
                  <textarea
                    value={formData.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                ) : (
                  <p className="text-gray-900">{playerData?.address || 'Not specified'}</p>
                )}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star size={20} />
                Social Media
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                  {editing ? (
                    <input
                      type="text"
                      placeholder="@username"
                      value={formData.socialMedia?.instagram || ''}
                      onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  ) : (
                    <p className="text-gray-900">{playerData?.socialMedia?.instagram || 'Not specified'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                  {editing ? (
                    <input
                      type="text"
                      placeholder="@username"
                      value={formData.socialMedia?.twitter || ''}
                      onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  ) : (
                    <p className="text-gray-900">{playerData?.socialMedia?.twitter || 'Not specified'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                  {editing ? (
                    <input
                      type="text"
                      placeholder="Profile URL"
                      value={formData.socialMedia?.facebook || ''}
                      onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  ) : (
                    <p className="text-gray-900">{playerData?.socialMedia?.facebook || 'Not specified'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity size={20} />
                Season Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{playerData?.goals || 0}</div>
                  <div className="text-sm text-gray-600">Goals</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{playerData?.assists || 0}</div>
                  <div className="text-sm text-gray-600">Assists</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{playerData?.matches || 0}</div>
                  <div className="text-sm text-gray-600">Matches</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{playerData?.yellowCards || 0}</div>
                  <div className="text-sm text-gray-600">Yellow Cards</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{playerData?.redCards || 0}</div>
                  <div className="text-sm text-gray-600">Red Cards</div>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            {editing && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award size={20} />
                  Medical Information
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medical Notes</label>
                  <textarea
                    value={formData.medicalInfo || ''}
                    onChange={(e) => handleInputChange('medicalInfo', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Any medical conditions, allergies, or notes..."
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;