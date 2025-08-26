import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, Filter, Trophy, Home, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getMatches } from '../services/database';

const Calendar = () => {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, completed, home, away
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const matchData = await getMatches();
        setMatches(matchData);
        setFilteredMatches(matchData);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  useEffect(() => {
    let filtered = matches;

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

    // Apply month/year filter
    filtered = filtered.filter(match => {
      const matchDate = match.date.seconds ? new Date(match.date.seconds * 1000) : new Date(match.date);
      return matchDate.getMonth() === selectedMonth && matchDate.getFullYear() === selectedYear;
    });

    setFilteredMatches(filtered);
  }, [matches, filter, selectedMonth, selectedYear]);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
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

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = [2024, 2025, 2026];

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
            Match Calendar
          </h1>
          <p className="text-xl text-gray-600">
            Follow Gooma United's journey through the season
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
                All Matches
              </Button>
              <Button
                variant={filter === 'upcoming' ? 'default' : 'outline'}
                onClick={() => setFilter('upcoming')}
                className={filter === 'upcoming' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                Upcoming
              </Button>
              <Button
                variant={filter === 'completed' ? 'default' : 'outline'}
                onClick={() => setFilter('completed')}
                className={filter === 'completed' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                Completed
              </Button>
              <Button
                variant={filter === 'home' ? 'default' : 'outline'}
                onClick={() => setFilter('home')}
                className={filter === 'home' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                <Home size={16} className="mr-1" />
                Home
              </Button>
              <Button
                variant={filter === 'away' ? 'default' : 'outline'}
                onClick={() => setFilter('away')}
                className={filter === 'away' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                <Plane size={16} className="mr-1" />
                Away
              </Button>
            </div>

            <div className="flex gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {years.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
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
                          {match.status === 'completed' ? 'Completed' : 'Upcoming'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">Gooma United</div>
                          {match.status === 'completed' && match.result && (
                            <div className="text-2xl font-bold text-red-600">
                              {match.result.home}
                            </div>
                          )}
                        </div>
                        
                        <div className="text-center px-4">
                          <div className="text-sm text-gray-500">VS</div>
                          {match.status === 'completed' && match.result && (
                            <div className="text-lg font-bold text-gray-600">-</div>
                          )}
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">{match.opponent}</div>
                          {match.status === 'completed' && match.result && (
                            <div className="text-2xl font-bold text-gray-600">
                              {match.result.away}
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
                          <span>{match.venue}</span>
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
                No matches found
              </h3>
              <p className="text-gray-600">
                No matches scheduled for the selected period and filters.
              </p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
              <span>Home Match</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
              <span>Away Match</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
              <span>Upcoming</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
              <span>Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;

