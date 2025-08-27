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
  addTeam,
  getTeams,
  updateTeam,
} from '../services/database';

const Admin = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [news, setNews] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  const playerImages = [
    'player1.jpg',
    'player2.jpg',
    'player3.jpg',
    'player4.jpg',
    'player5.jpg',
  ];

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
    surname: '',
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
      const [matchesData, playersData, newsData, teamsData] = await Promise.all([
        getMatches(),
        getPlayers(),
        getNewsPosts(),
        getTeams()
      ]);
      setMatches(matchesData);
      setPlayers(playersData);
      setNews(newsData);
      setTeams(teamsData);
    } catch (error) {
      console.error('Error fetching data:', error);
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
      surname: '',
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
                            setLoading(true);
                            try {
                              console.log('Attempting to delete match:', match.id, match.opponent);
                              await deleteMatch(match.id);
                              console.log('Match deleted successfully from database');

                              // Force refresh data immediately
                              const [matchesData, playersData, newsData, teamsData] = await Promise.all([
                                getMatches(),
                                getPlayers(),
                                getNewsPosts(),
                                getTeams()
                              ]);
                              setMatches(matchesData);
                              setPlayers(playersData);
                              setNews(newsData);
                              setTeams(teamsData);

                              console.log('UI updated with fresh data');
                              alert('Match deleted successfully!');
                            } catch (error) {
                              console.error('Error deleting match:', error);
                              alert(`Error deleting match: ${error.message || 'Unknown error'}`);

                              // Still refresh data even if delete failed
                              try {
                                const [matchesData, playersData, newsData, teamsData] = await Promise.all([
                                  getMatches(),
                                  getPlayers(),
                                  getNewsPosts(),
                                  getTeams()
                                ]);
                                setMatches(matchesData);
                                setPlayers(playersData);
                                setNews(newsData);
                                setTeams(teamsData);
                              } catch (refreshError) {
                                console.error('Error refreshing data:', refreshError);
                              }
                            } finally {
                              setLoading(false);
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
              <div className="flex items-center mb-4">
                <img 
                  src={player.profilePicture || `https://ui-avatars.com/api/?name=${player.name}&background=random`} 
                  alt={player.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-bold">{player.name}</h3>
                  <p className="text-sm text-gray-600">{player.surname}</p>
                </div>
              </div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm text-gray-600">{player.position}</p>
                  <p className="text-sm text-gray-600">#{player.jerseyNumber}</p>
                  <p className="text-sm text-gray-600">{player.nationality}</p>
                </div>
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

  const renderTeams = () => {
    const handlePopulateTeams = async () => {
      setLoading(true);
      try {
        const allMatches = await getMatches();
        const uniqueTeams = new Set();
        uniqueTeams.add('Gooma United'); // Add the home team

        allMatches.forEach(match => {
          uniqueTeams.add(match.opponent);
        });

        for (const teamName of Array.from(uniqueTeams)) {
          // Check if team already exists to prevent duplicates
          const existingTeams = await getTeams();
          const teamExists = existingTeams.some(team => team.name === teamName);

          if (!teamExists) {
            await addTeam({
              name: teamName,
              homeAddress: '',
              clubColor1: '',
              clubColor2: '',
            });
          }
        }
        await fetchData(); // Refresh data after populating
        alert('Teams populated successfully!');
      } catch (error) {
        console.error('Error populating teams:', error);
        alert('Error populating teams.');
      } finally {
        setLoading(false);
      }
    };

    const handleUpdateTeamDetails = async (teamId, field, value) => {
      setLoading(true);
      try {
        await updateTeam(teamId, { [field]: value });
        await fetchData(); // Refresh data after update
        alert('Team updated successfully!');
      } catch (error) {
        console.error('Error updating team:', error);
        alert('Error updating team.');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Manage Teams</h2>
            <Button onClick={handlePopulateTeams} className="bg-blue-600 hover:bg-blue-700">
              Populate Teams (One-time)
            </Button>
          </div>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Team Name</th>
                  <th className="text-left py-2">Home Address</th>
                  <th className="text-left py-2">Club Color 1</th>
                  <th className="text-left py-2">Club Color 2</th>
                  <th className="text-left py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => (
                  <tr key={team.id} className="border-b">
                    <td className="py-2">{team.name}</td>
                    <td className="py-2">
                      <input
                        type="text"
                        value={team.homeAddress}
                        onChange={(e) => handleUpdateTeamDetails(team.id, 'homeAddress', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                      />
                    </td>
                    <td className="py-2">
                      <input
                        type="color"
                        value={team.clubColor1}
                        onChange={(e) => handleUpdateTeamDetails(team.id, 'clubColor1', e.target.value)}
                        className="w-10 h-10 cursor-pointer"
                      />
                    </td>
                    <td className="py-2">
                      <input
                        type="color"
                        value={team.clubColor2}
                        onChange={(e) => handleUpdateTeamDetails(team.id, 'clubColor2', e.target.value)}
                        className="w-10 h-10 cursor-pointer"
                      />
                    </td>
                    <td className="py-2">
                      {/* No specific delete for teams, as they are derived from matches */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              { id: 'news', label: 'News', icon: FileText },
              { id: 'teams', label: 'Teams', icon: Users }
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
            {activeTab === 'teams' && renderTeams()}
          </>
        )}
      </div>

      {renderModal()}
    </div>
  );
};

export default Admin;
