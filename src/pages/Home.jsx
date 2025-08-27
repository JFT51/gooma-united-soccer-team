import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Trophy, ArrowRight, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import teamCelebration from '../assets/team-celebration.jpg';
import { getMatches, getNewsPosts } from '../services/database';

const Home = () => {
  const { t } = useTranslation();
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matches, news] = await Promise.all([
          getMatches(),
          getNewsPosts(3)
        ]);
        
        // Filter upcoming matches
        const upcoming = matches.filter(match => 
          match.status === 'upcoming' && new Date(match.date.seconds * 1000) > new Date()
        ).slice(0, 3);
        
        setUpcomingMatches(upcoming);
        setLatestNews(news);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Hero Image Background - Make it more prominent */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage: `url('/hero.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
        </div>

        {/* Text Content Overlay */}
        <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4">
          {/* Text content without background */}
          <div className="rounded-3xl p-8 shadow-2xl">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in" style={{textShadow: '3px 3px 6px rgba(0,0,0,0.9)'}}>
              GOOMA
              <span className="block text-red-400" style={{textShadow: '3px 3px 6px rgba(0,0,0,0.9)'}}>UNITED</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-2xl mx-auto font-gochi" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-xl"
                style={{boxShadow: '0 6px 12px rgba(0,0,0,0.4)'}}
              >
                <Link to="/calendar">
                  <Calendar className="mr-2" size={20} />
                  {t('home.hero.viewMatches')}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-xl"
                style={{boxShadow: '0 6px 12px rgba(0,0,0,0.4)'}}
              >
                <Link to="/players">
                  <Users className="mr-2" size={20} />
                  {t('home.hero.meetTeam')}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Club Statistics</h2>
            <p className="text-2xl font-dancing">When Gooma is United, they will never be divided</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 hover:bg-opacity-20">
              <div className="text-4xl md:text-5xl font-bold mb-3 text-black">15</div>
              <div className="text-red-800 font-medium">{t('home.stats.yearsExcellence')}</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 hover:bg-opacity-20">
              <div className="text-4xl md:text-5xl font-bold mb-3 text-black">3</div>
              <div className="text-red-800 font-medium">{t('home.stats.leagueTitles')}</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 hover:bg-opacity-20">
              <div className="text-4xl md:text-5xl font-bold mb-3 text-black">25</div>
              <div className="text-red-800 font-medium">{t('home.stats.squadPlayers')}</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 hover:bg-opacity-20">
              <div className="text-4xl md:text-5xl font-bold mb-3 text-black">10K</div>
              <div className="text-red-800 font-medium">{t('home.stats.loyalFans')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Matches */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{t('home.upcomingMatches.title')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('home.upcomingMatches.subtitle')}</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">{t('home.upcomingMatches.loading')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {upcomingMatches.length > 0 ? upcomingMatches.map((match, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-gray-100">
                  <div className="text-center">
                    <div className="inline-block bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                      {match.competition}
                    </div>
                    <div className="text-xl font-bold text-gray-900 mb-4">
                      Gooma United <span className="text-red-600">vs</span> {match.opponent}
                    </div>
                    <div className="text-2xl font-bold text-red-600 mb-4 bg-red-50 rounded-lg py-3">
                      {formatDate(match.date)}
                    </div>
                    <div className="text-gray-600 mb-6 flex items-center justify-center">
                      <span className="text-lg">📍</span>
                      <span className="ml-2">{match.venue}</span>
                    </div>
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                      match.isHome
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${match.isHome ? 'bg-green-400' : 'bg-blue-400'}`}></span>
                      {match.isHome ? t('home.upcomingMatches.home') : t('home.upcomingMatches.away')}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-3 text-center py-12">
                  <div className="text-6xl mb-4">📅</div>
                  <p className="text-gray-500 text-lg">{t('home.upcomingMatches.noMatches')}</p>
                </div>
              )}
            </div>
          )}

          <div className="text-center">
            <Button asChild className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <Link to="/calendar">
                {t('home.upcomingMatches.viewFullCalendar')}
                <ArrowRight className="ml-2" size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('home.latestNews.title')}</h2>
            <p className="text-xl text-gray-600">{t('home.latestNews.subtitle')}</p>
          </div>

          {loading ? (
            <div className="text-center">{t('home.latestNews.loading')}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestNews.length > 0 ? latestNews.map((post, index) => (
                <article key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-200 hover:shadow-xl">
                  <div className="p-6">
                    <div className="text-sm text-red-600 font-medium mb-2">
                      {formatDate(post.createdAt)}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{t('home.latestNews.by')} {post.author}</span>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        {t('home.latestNews.readMore')}
                        <ArrowRight className="ml-1" size={14} />
                      </Button>
                    </div>
                  </div>
                </article>
              )) : (
                <div className="col-span-3 text-center text-gray-500">
                  {t('home.latestNews.noNews')}
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-8">
            <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
              <Link to="/news">
                View All News
                <ArrowRight className="ml-2" size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Team Spirit Section */}
      <section className="py-16 bg-black text-white relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${teamCelebration})` }}
        ></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t('home.teamSpirit.title')}
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            {t('home.teamSpirit.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold"
            >
              <Link to="/history">
                <Trophy className="mr-2" size={20} />
                {t('home.teamSpirit.ourHistory')}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold"
            >
              <Link to="/players">
                <Play className="mr-2" size={20} />
                {t('home.teamSpirit.watchHighlights')}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
