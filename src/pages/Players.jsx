import React, { useState, useEffect } from 'react';
import { User, MapPin, Calendar, Trophy, Target, Users, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPlayers } from '../services/database.js';
import { useTranslation } from 'react-i18next';

// Function to calculate age from birth date
const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  
  // Convert Firestore Timestamp to JavaScript Date if necessary
  const birthDate = dateOfBirth.toDate ? dateOfBirth.toDate() : new Date(dateOfBirth);
  
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  
  // Check if birthday hasn't occurred this year
  const birthMonth = birthDate.getMonth();
  const currentMonth = today.getMonth();
  const birthDay = birthDate.getDate();
  const currentDay = today.getDate();
  
  if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
    age--;
  }
  
  return age;
};

const Players = () => {
  const { t } = useTranslation();
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [positionFilter, setPositionFilter] = useState('all');
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      const playerData = await getPlayers();
      const playersWithImagesAndAge = playerData.map((player) => ({
        ...player,
        image: player.profilePicture || `https://ui-avatars.com/api/?name=${player.name}&background=random`,
        age: calculateAge(player.dateOfBirth) // Calculate age
      }));
      setPlayers(playersWithImagesAndAge);
      setFilteredPlayers(playersWithImagesAndAge);
      setLoading(false);
    };

    fetchPlayers();
  }, []);

  useEffect(() => {
    if (positionFilter === 'all') {
      setFilteredPlayers(players);
    } else {
      setFilteredPlayers(players.filter(player => 
        player.position.toLowerCase() === positionFilter.toLowerCase()
      ));
    }
  }, [players, positionFilter]);

  const getPositionColor = (position) => {
    switch (position.toLowerCase()) {
      case 'goalkeeper':
        return 'bg-yellow-100 text-yellow-800';
      case 'defender':
        return 'bg-blue-100 text-blue-800';
      case 'midfielder':
        return 'bg-green-100 text-green-800';
      case 'forward':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const positions = ['All', 'Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">{t('players.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('players.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('players.subtitle')}
          </p>
        </div>

        {/* Position Filter */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {positions.map((position) => (
              <Button
                key={position}
                variant={positionFilter === (position === 'All' ? 'all' : position.toLowerCase()) ? 'default' : 'outline'}
                onClick={() => setPositionFilter(position === 'All' ? 'all' : position.toLowerCase())}
                className={positionFilter === (position === 'All' ? 'all' : position.toLowerCase()) ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                {t(`players.positions.${position.toLowerCase()}`)}
              </Button>
            ))}
          </div>
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredPlayers.map((player) => (
            <div
              key={player.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-200 hover:shadow-xl cursor-pointer"
              onClick={() => setSelectedPlayer(player)}
            >
              {/* Player Image */}
              <div className="relative h-64 bg-gray-200">
                <img
                  src={player.image}
                  alt={player.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                  {player.jerseyNumber}
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPositionColor(player.position)}`}>
                    {t(`players.positions.${player.position.toLowerCase()}`)}
                  </span>
                </div>
              </div>

              {/* Player Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{player.name}</h3>
                <p className="text-md text-gray-600 mb-2">{player.surname}</p>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{player.age ? `${player.age} ${t('players.years')}` : t('players.ageNotAvailable')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{player.nationality}</span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="bg-gray-50 rounded p-2">
                    <div className="font-bold text-red-600">{player.stats?.matches || 0}</div>
                    <div className="text-gray-600">{t('players.matches')}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <div className="font-bold text-red-600">
                      {player.stats?.goals || player.stats?.cleanSheets || 0}
                    </div>
                    <div className="text-gray-600">
                      {player.position === 'Goalkeeper' ? t('players.cleanSheets') : t('players.goals')}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <div className="font-bold text-red-600">
                      {player.stats?.assists || player.stats?.saves || 0}
                    </div>
                    <div className="text-gray-600">
                      {player.position === 'Goalkeeper' ? t('players.saves') : t('players.assists')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPlayers.length === 0 && (
          <div className="text-center py-12">
            <Users size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('players.noPlayers')}
            </h3>
            <p className="text-gray-600">
              {t('players.noPlayersFilter')}
            </p>
          </div>
        )}

        {/* Player Detail Modal */}
        {selectedPlayer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedPlayer(null)}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 z-10"
                >
                  ✕
                </button>

                {/* Player Header */}
                <div className="relative h-64 bg-gray-200">
                  <img
                    src={selectedPlayer.image}
                    alt={selectedPlayer.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                    <div className="text-white">
                      <h2 className="text-3xl font-bold mb-2">{selectedPlayer.name}</h2>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPositionColor(selectedPlayer.position)}`}>
                          {t(`players.positions.${selectedPlayer.position.toLowerCase()}`)}
                        </span>
                        <span className="bg-red-600 text-white rounded-full px-3 py-1 text-sm font-bold">
                          #{selectedPlayer.jerseyNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Player Details */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('players.playerInfo')}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('players.age')}:</span>
                          <span className="font-medium">{selectedPlayer.age ? `${selectedPlayer.age} ${t('players.years')}` : t('players.ageNotAvailable')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('players.nationality')}:</span>
                          <span className="font-medium">{selectedPlayer.nationality}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('players.position')}:</span>
                          <span className="font-medium">{t(`players.positions.${selectedPlayer.position.toLowerCase()}`)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('players.jerseyNumber')}:</span>
                          <span className="font-medium">#{selectedPlayer.jerseyNumber}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('players.seasonStats')}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('players.matchesPlayed')}:</span>
                          <span className="font-medium">{selectedPlayer.stats?.matches || 0}</span>
                        </div>
                        {selectedPlayer.position === 'Goalkeeper' ? (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600">{t('players.cleanSheets')}:</span>
                              <span className="font-medium">{selectedPlayer.stats?.cleanSheets || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">{t('players.saves')}:</span>
                              <span className="font-medium">{selectedPlayer.stats?.saves || 0}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600">{t('players.goals')}:</span>
                              <span className="font-medium">{selectedPlayer.stats?.goals || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">{t('players.assists')}:</span>
                              <span className="font-medium">{selectedPlayer.stats?.assists || 0}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Player Surname */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('players.surname')}</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedPlayer.surname}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Players;
