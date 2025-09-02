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
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
            style={{
              backgroundImage: `url('/hero-banner.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: 'brightness(0.7)'
            }}
          ></div>
          <div className="relative z-20 text-center text-white max-w-3xl mx-auto px-4">
            <div className="rounded-3xl p-8 shadow-2xl bg-black/40 backdrop-blur-md">
              <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight font-gochi animate-fade-in" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.8)'}}>
                GOOMA <span className="block text-red-400">UNITED</span>
              </h1>
              <p className="text-2xl md:text-3xl mb-8 text-gray-100 max-w-2xl mx-auto font-gochi" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.8)'}}>
                {t('home.hero.subtitle') || 'Belgium’s most passionate soccer team. Join the journey!'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-2">
                <Button asChild variant="primary" size="lg">
                  <Link to="/calendar">View Matches</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/players">Meet the Team</Link>
                </Button>
              </div>
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
