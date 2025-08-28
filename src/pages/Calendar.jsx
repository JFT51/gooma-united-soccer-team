import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, Filter, Trophy, Home, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getMatches, getTeams } from '../services/database';
import { useTranslation } from 'react-i18next';

const Calendar = () => {
  const { t, i18n } = useTranslation();
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, completed, home, away

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchData, teamData] = await Promise.all([getMatches(), getTeams()]);
        setMatches(matchData);
        setTeams(teamData);
        setFilteredMatches(matchData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = matches.map(match => {
      const homeTeamName = match.isHome ? "Gooma United" : match.opponent;
      const awayTeamName = match.isHome ? match.opponent : "Gooma United";
      const homeTeam = teams.find(team => team.name === homeTeamName);
      const awayTeam = teams.find(team => team.name === awayTeamName);
      return {
        ...match,
        venue: homeTeam ? homeTeam.home_address : match.venue,
        homeTeam,
        awayTeam,
      };
    });

    // Apply status filter
    if (filter === 'upcoming') {
      filtered = filtered.filter(match => match.status === 'upcoming');
    } else if (filter === 'completed') {
      filtered = filtered.filter(match => match.status === 'completed');
    } else if (filter === 'home') {
      filtered = filtered.filter(match => match.isHome === true);
    } else if (filter === 'away') {
      filtered = filtered.filter(match => match.isHome === false);
    }

    setFilteredMatches(filtered);
  }, [matches, filter, teams]);

  const getSquareStyle = (color) => {
    const style = {
      backgroundColor: color,
      width: '12px',
      height: '12px',
      marginRight: '4px',
    };
    if (color && color.toLowerCase() === '#ffffff') {
      style.border = '1px solid black';
    }
    return style;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleDateString(i18n.language, {
      weekday: 'long', 
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleTimeString(i18n.language, {
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const getMatchStatus = (match) => {
    if (match.status === 'completed') {
      if (match.result) {
        const { home, away } = match.result;
        return `Final: ${home} - ${away}`;
      }
      return 'Completed';
    }
    return 'Upcoming';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading matches...</p>
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
            {t('calendar.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('calendar.subtitle')}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                {t('calendar.filters.all')}
              </Button>
              <Button
                variant={filter === 'upcoming' ? 'default' : 'outline'}
                onClick={() => setFilter('upcoming')}
                className={filter === 'upcoming' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                {t('calendar.filters.upcoming')}
              </Button>
              <Button
                variant={filter === 'completed' ? 'default' : 'outline'}
                onClick={() => setFilter('completed')}
                className={filter === 'completed' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                {t('calendar.filters.completed')}
              </Button>
              <Button
                variant={filter === 'home' ? 'default' : 'outline'}
                onClick={() => setFilter('home')}
                className={filter === 'home' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                <Home size={16} className="mr-1" />
                {t('calendar.filters.home')}
              </Button>
              <Button
                variant={filter === 'away' ? 'default' : 'outline'}
                onClick={() => setFilter('away')}
                className={filter === 'away' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                <Plane size={16} className="mr-1" />
                {t('calendar.filters.away')}
              </Button>
            </div>

          </div>
        </div>

        {/* Matches List */}
        <div className="space-y-6">
          {filteredMatches.length > 0 ? (
            filteredMatches.map((match, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy size={16} className="text-red-600" />
                        <span className="text-sm font-medium text-red-600">
                          {match.competition}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(match.status)}`}>
                          {t(`calendar.status.${match.status}`)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="text-right flex-1">
                          <div className="text-lg font-bold text-gray-900 flex items-center justify-end">
                            {match.homeTeam && (
                              <>
                                <div style={getSquareStyle(match.homeTeam.club_color1)}></div>
                                <div style={getSquareStyle(match.homeTeam.club_color2)}></div>
                              </>
                            )}
                            {match.isHome ? "Gooma United" : match.opponent}
                          </div>
                          {match.status === 'completed' && match.result && (
                            <div className="text-2xl font-bold text-red-600">
                              {match.isHome ? match.result.home : match.result.away}
                            </div>
                          )}
                        </div>
                        <div className="text-center px-2">
                          <div className="text-sm text-gray-500">VS</div>
                        </div>
                        <div className="text-left flex-1">
                          <div className="text-lg font-bold text-gray-900 flex items-center">
                            {match.awayTeam && (
                              <>
                                <div style={getSquareStyle(match.awayTeam.club_color1)}></div>
                                <div style={getSquareStyle(match.awayTeam.club_color2)}></div>
                              </>
                            )}
                            {match.isHome ? match.opponent : "Gooma United"}
                          </div>
                          {match.status === 'completed' && match.result && (
                            <div className="text-2xl font-bold text-gray-600">
                              {match.isHome ? match.result.away : match.result.home}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <CalendarIcon size={16} />
                          <span>{formatDate(match.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>{formatTime(match.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          <a
                            href={`https://waze.com/ul?q=${encodeURIComponent(match.venue)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-red-600 transition-colors"
                          >
                            {match.venue}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 lg:mt-0 lg:ml-6">
                      <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${
                        match.isHome 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {match.isHome ? (
                          <>
                            <Home size={16} className="mr-1" />
                            Home
                          </>
                        ) : (
                          <>
                            <Plane size={16} className="mr-1" />
                            Away
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <CalendarIcon size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('calendar.noMatches.title')}
              </h3>
              <p className="text-gray-600">
                {t('calendar.noMatches.subtitle')}
              </p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('calendar.legend.title')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
              <span>{t('calendar.legend.home')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
              <span>{t('calendar.legend.away')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
              <span>{t('calendar.legend.upcoming')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
              <span>{t('calendar.legend.completed')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;

