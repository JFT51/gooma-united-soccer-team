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
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoginForm from '../components/auth/LoginForm';
import { auth, createUserWithEmailAndPassword } from '../lib/firebase'; // Import Firebase auth
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
  uploadProfilePicture // Import uploadProfilePicture
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

  // Form states
  const [matchForm, setMatchForm] = useState({
    opponent: '',
    date: '',
    time: '',
    venue: '',
    type: 'home',
    competition: 'League'
  });

  const [playerForm, setPlayerForm] = useState({
    name: '',
    email: '',
    password: '',
    position: '',
    birthDate: '', // Changed from age to birthDate
    nationality: '',
    jerseyNumber: '',
    height: '',
    weight: '',
    bio: '',
    profilePicture: '' // Added for profile picture URL
  });

  const [newsForm, setNewsForm] = useState({
    title: '',
    content: '',
    category: 'Match Results',
    tags: '',
    featured: false
  });

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [matchesData, playersData, newsData] = await Promise.all([
        getMatches(),
        getPlayers(),
        getNewsPosts()
      ]);
      setMatches(matchesData);
      setPlayers(playersData);
      setNews(newsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpload = async (file) => {
    if (!file) return;
    setLoading(true);
    try {
      const downloadURL = await uploadProfilePicture(file, editingItem?.userId || currentUser.uid); // Use current user's ID or editing item's ID
      setPlayerForm(prev => ({ ...prev, profilePicture: downloadURL }));
      alert('Profile picture uploaded successfully!');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert(`Error uploading picture: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMatch = async () => {
    try {
      setLoading(true);
      await addMatch({
        ...matchForm,
        createdAt: new Date()
      });
      await fetchData();
      setShowModal(false);
      resetMatchForm();
    } catch (error) {
      console.error('Error adding match:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlayer = async () => {
    try {
      setLoading(true);
      let userCredential;
      if (!editingItem) { // Only create user if adding a new player
        userCredential = await createUserWithEmailAndPassword(auth, playerForm.email, playerForm.password);
      }

      const playerDataToSave = {
        ...playerForm,
        birthDate: playerForm.birthDate, // birthDate is already a string from input
        jerseyNumber: parseInt(playerForm.jerseyNumber) || 0,
        height: playerForm.height,
        weight: playerForm.weight,
        createdAt: editingItem ? editingItem.createdAt : new Date(),
        updatedAt: new Date(),
        profilePicture: playerForm.profilePicture || '', // Ensure profilePicture is saved
      };

      // Remove userId from the data to prevent undefined values
      delete playerDataToSave.userId;

      // Only add userId when creating a new user
      if (!editingItem && userCredential) {
        playerDataToSave.userId = userCredential.user.uid;
      }

      if (editingItem) {
        await updatePlayer(editingItem.id, playerDataToSave);
      } else {
        await addPlayer(playerDataToSave);
      }
      
      await fetchData();
      setShowModal(false);
      resetPlayerForm();
    } catch (error) {
      console.error('Error adding/updating player:', error);
      alert(`Error: ${error.message}`); // Provide user feedback on error
    } finally {
      setLoading(false);
    }
  };

  const handleAddNews = async () => {
    try {
      setLoading(true);
      await addNewsPost({
        ...newsForm,
        author: currentUser.email,
        tags: newsForm.tags.split(',').map(tag => tag.trim()),
        createdAt: new Date()
      });
      await fetchData();
      setShowModal(false);
      resetNewsForm();
    } catch (error) {
      console.error('Error adding news:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetMatchForm = () => {
    setMatchForm({
      opponent: '',
      date: '',
      time: '',
      venue: '',
      type: 'home',
      competition: 'League'
    });
  };

  const resetPlayerForm = () => {
    setPlayerForm({
      name: '',
      email: '',
      password: '',
      position: '',
      birthDate: '',
      nationality: '',
      jerseyNumber: '',
      height: '',
      weight: '',
      bio: '',
      profilePicture: ''
    });
  };

  const resetNewsForm = () => {
    setNewsForm({
      title: '',
      content: '',
      category: 'Match Results',
      tags: '',
      featured: false
    });
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
      if (item) {
        if (type === 'match') {
          const matchDate = item.date ? new Date(item.date) : new Date();
          const formattedDate = matchDate.toISOString().split('T')[0];
          const formattedTime = matchDate.toTimeString().slice(0, 5);
          setMatchForm({
            ...item,
            date: formattedDate,
            time: formattedTime,
          });
        } else if (type === 'player') {
          const playerBirthDate = item.birthDate ? new Date(item.birthDate) : '';
          const formattedBirthDate = playerBirthDate ? playerBirthDate.toISOString().split('T')[0] : '';
          setPlayerForm({
            ...item,
            birthDate: formattedBirthDate,
            password: '', // Never pre-fill password
          });
        } else if (type === 'news') {
          setNewsForm({
            ...item,
            tags: item.tags ? item.tags.join(', ') : ''
          });
        }
      }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    resetMatchForm();
    resetPlayerForm();
    resetNewsForm();
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

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

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Matches</p>
            <p className="text-3xl font-bold text-gray-900">{matches.length}</p>
          </div>
          <Calendar className="text-blue-600" size={32} />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Players</p>
            <p className="text-3xl font-bold text-gray-900">{players.length}</p>
          </div>
          <Users className="text-green-600" size={32} />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">News Articles</p>
            <p className="text-3xl font-bold text-gray-900">{news.length}</p>
          </div>
          <FileText className="text-purple-600" size={32} />
        </div>
      </div>
    </div>
  );

  const renderMatches = () => (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Manage Matches</h2>
          <Button onClick={() => openModal('match')} className="bg-red-600 hover:bg-red-700">
            <Plus size={16} className="mr-2" />
            Add Match
          </Button>
        </div>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Opponent</th>
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Venue</th>
                <th className="text-left py-2">Type</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => (
                <tr key={match.id} className="border-b">
                  <td className="py-2">{match.opponent}</td>
                  <td className="py-2">{formatDate(match.date)}</td>
                  <td className="py-2">{match.venue}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      match.type === 'home' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {match.type}
                    </span>
                  </td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openModal('match', match)}>
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to delete this match?')) {
                            try {
                              await deleteMatch(match.id);
                              await fetchData();
                            } catch (error) {
                              console.error('Error deleting match:', error);
                              alert('Error deleting match');
                            }
                          }
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPlayers = () => (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Manage Players</h2>
          <Button onClick={() => openModal('player')} className="bg-red-600 hover:bg-red-700">
            <Plus size={16} className="mr-2" />
            Add Player
          </Button>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.map((player) => (
            <div key={player.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold">{player.name}</h3>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openModal('player', player)}>
                    <Edit size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to delete this player?')) {
                        try {
                          await deletePlayer(player.id);
                          await fetchData();
                        } catch (error) {
                          console.error('Error deleting player:', error);
                          alert('Error deleting player');
                        }
                      }
                    }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600">{player.position}</p>
              <p className="text-sm text-gray-600">#{player.jerseyNumber}</p>
              <p className="text-sm text-gray-600">{player.nationality}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNews = () => (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Manage News</h2>
          <Button onClick={() => openModal('news')} className="bg-red-600 hover:bg-red-700">
            <Plus size={16} className="mr-2" />
            Add Article
          </Button>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {news.map((article) => (
            <div key={article.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold mb-1">{article.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{article.category}</p>
                  <p className="text-sm text-gray-500 line-clamp-2">{article.content}</p>
                </div>
                <div className="flex gap-1 ml-4">
                  <Button variant="ghost" size="sm" onClick={() => openModal('news', article)}>
                    <Edit size={14} />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">
                {editingItem ? 'Edit' : 'Add'} {modalType === 'match' ? 'Match' : modalType === 'player' ? 'Player' : 'News Article'}
              </h3>
              <Button variant="ghost" onClick={closeModal}>
                <X size={20} />
              </Button>
            </div>
          </div>
          <div className="p-6">
            {modalType === 'match' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Opponent</label>
                  <input
                    type="text"
                    value={matchForm.opponent}
                    onChange={(e) => setMatchForm({...matchForm, opponent: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={matchForm.date}
                      onChange={(e) => setMatchForm({...matchForm, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="time"
                      value={matchForm.time}
                      onChange={(e) => setMatchForm({...matchForm, time: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                  <input
                    type="text"
                    value={matchForm.venue}
                    onChange={(e) => setMatchForm({...matchForm, venue: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={matchForm.type}
                      onChange={(e) => setMatchForm({...matchForm, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="home">Home</option>
                      <option value="away">Away</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Competition</label>
                    <select
                      value={matchForm.competition}
                      onChange={(e) => setMatchForm({...matchForm, competition: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="League">League</option>
                      <option value="Cup">Cup</option>
                      <option value="European">European</option>
                      <option value="Friendly">Friendly</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={closeModal}>Cancel</Button>
                  <Button onClick={handleAddMatch} disabled={loading} className="bg-red-600 hover:bg-red-700">
                    {loading ? 'Saving...' : 'Save Match'}
                  </Button>
                </div>
              </div>
            )}

            {modalType === 'player' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={playerForm.name}
                    onChange={(e) => setPlayerForm({...playerForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <select
                      value={playerForm.position}
                      onChange={(e) => setPlayerForm({...playerForm, position: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="">Select Position</option>
                      <option value="Goalkeeper">Goalkeeper</option>
                      <option value="Defender">Defender</option>
                      <option value="Midfielder">Midfielder</option>
                      <option value="Forward">Forward</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jersey Number</label>
                    <input
                      type="number"
                      value={playerForm.jerseyNumber}
                      onChange={(e) => setPlayerForm({...playerForm, jerseyNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={playerForm.email}
                    onChange={(e) => setPlayerForm({...playerForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    disabled={!!editingItem} // Disable email editing for existing players
                  />
                </div>
                {!editingItem && ( // Only show password field for new players
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      value={playerForm.password}
                      onChange={(e) => setPlayerForm({...playerForm, password: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                )}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                    <input
                      type="date"
                      value={playerForm.birthDate}
                      onChange={(e) => setPlayerForm({...playerForm, birthDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                    <input
                      type="text"
                      placeholder="e.g. 180cm"
                      value={playerForm.height}
                      onChange={(e) => setPlayerForm({...playerForm, height: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                    <input
                      type="text"
                      placeholder="e.g. 75kg"
                      value={playerForm.weight}
                      onChange={(e) => setPlayerForm({...playerForm, weight: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                  <input
                    type="text"
                    value={playerForm.nationality}
                    onChange={(e) => setPlayerForm({...playerForm, nationality: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={playerForm.bio}
                    onChange={(e) => setPlayerForm({...playerForm, bio: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                {/* Profile Picture Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleProfilePictureUpload(e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  {playerForm.profilePicture && (
                    <img src={playerForm.profilePicture} alt="Profile" className="mt-2 h-20 w-20 object-cover rounded-full" />
                  )}
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={closeModal}>Cancel</Button>
                  <Button onClick={handleAddPlayer} disabled={loading} className="bg-red-600 hover:bg-red-700">
                    {loading ? 'Saving...' : 'Save Player'}
                  </Button>
                </div>
              </div>
            )}

            {modalType === 'news' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={newsForm.title}
                    onChange={(e) => setNewsForm({...newsForm, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={newsForm.category}
                      onChange={(e) => setNewsForm({...newsForm, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="Match Results">Match Results</option>
                      <option value="Transfers">Transfers</option>
                      <option value="Training">Training</option>
                      <option value="Community">Community</option>
                      <option value="Tickets">Tickets</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={newsForm.tags}
                      onChange={(e) => setNewsForm({...newsForm, tags: e.target.value})}
                      placeholder="e.g. victory, championship, final"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea
                    value={newsForm.content}
                    onChange={(e) => setNewsForm({...newsForm, content: e.target.value})}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newsForm.featured}
                      onChange={(e) => setNewsForm({...newsForm, featured: e.target.checked})}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Featured Article</span>
                  </label>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={closeModal}>Cancel</Button>
                  <Button onClick={handleAddNews} disabled={loading} className="bg-red-600 hover:bg-red-700">
                    {loading ? 'Saving...' : 'Save Article'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

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
              { id: 'news', label: 'News', icon: FileText }
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
          </>
        )}
      </div>

      {renderModal()}
    </div>
  );
};

export default Admin;
