import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, Trophy, Home, Plane } from 'lucide-react';
import { getMatches, getTeams } from '../services/database';
import { useTranslation } from 'react-i18next';

const Calendar = () => {
  const { t, i18n } = useTranslation();
  const [matchesByMonth, setMatchesByMonth] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchData, teamsData] = await Promise.all([
          getMatches(),
          getTeams()
        ]);

        const teamsMap = new Map(teamsData.map(team => [team.name, team]));
        const goomaUnitedData = { name: 'Gooma United', tenueicon: '/assets/gu.svg' };

        const enrichedMatches = matchData.map(match => {
          const opponentTeamData = teamsMap.get(match.opponent) || { name: match.opponent };
          const homeTeam = match.isHome ? goomaUnitedData : opponentTeamData;
          const awayTeam = match.isHome ? opponentTeamData : goomaUnitedData;
          return { ...match, homeTeam, awayTeam };
        });

        const sortedMatches = enrichedMatches.sort((a, b) => new Date(a.date) - new Date(b.date));

        const grouped = sortedMatches.reduce((acc, match) => {
          const date = match.date.seconds ? new Date(match.date.seconds * 1000) : new Date(match.date);
          const monthYear = date.toLocaleString(i18n.language, { month: 'long', year: 'numeric' });

          if (!acc[monthYear]) {
            acc[monthYear] = [];
          }
          acc[monthYear].push(match);
          return acc;
        }, {});

        setMatchesByMonth(grouped);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [i18n.language]);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleDateString(i18n.language, { day: '2-digit' });
  };

  const formatDayOfWeek = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleDateString(i18n.language, { weekday: 'short' });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const MatchCard = ({ match }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex items-center p-4 space-x-4">
      <div className="flex flex-col items-center justify-center w-16 text-center">
        <div className="text-sm font-medium text-red-600">{formatDayOfWeek(match.date)}</div>
        <div className="text-3xl font-bold text-gray-800">{formatDate(match.date)}</div>
      </div>

      <div className="flex-grow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 flex items-center">
            <Trophy size={14} className="mr-1.5" /> {match.competition}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            match.isHome ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {match.isHome ? t('calendar.matchType.home') : t('calendar.matchType.away')}
          </span>
        </div>

        <div className="flex items-center my-2">
          <div className="flex-1 text-right font-bold text-lg pr-4 flex justify-end items-center">
            <span>{match.homeTeam.name}</span>
            {match.homeTeam.tenueicon && <img src={match.homeTeam.tenueicon} alt={match.homeTeam.name} className="w-8 h-8 ml-2" />}
          </div>
          <div className="text-center px-2">
            {match.status === 'completed' && match.result ? (
              <span className="text-xl font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-md">{match.result.home} - {match.result.away}</span>
            ) : (
              <span className="text-lg font-semibold text-gray-400">VS</span>
            )}
          </div>
          <div className="flex-1 font-bold text-lg pl-4 flex items-center">
            {match.awayTeam.tenueicon && <img src={match.awayTeam.tenueicon} alt={match.awayTeam.name} className="w-8 h-8 mr-2" />}
            <span>{match.awayTeam.name}</span>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-500 border-t border-gray-100 pt-2 mt-2">
          <div className="flex items-center mr-4">
            <Clock size={14} className="mr-1.5" /> {formatTime(match.date)}
          </div>
          <div className="flex items-center">
            <MapPin size={14} className="mr-1.5" /> {match.venue}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('calendar.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('calendar.subtitle')}
          </p>
        </div>

        <div className="space-y-12">
          {Object.keys(matchesByMonth).length > 0 ? (
            Object.entries(matchesByMonth).map(([month, matches]) => (
              <div key={month}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 sticky top-0 bg-gray-50 py-2 z-10">
                  {month}
                </h2>
                <div className="space-y-4">
                  {matches.map(match => <MatchCard key={match.id} match={match} />)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
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
      </div>
    </div>
  );
};

export default Calendar;
