import React from 'react';
import { Trophy, Calendar, Users, Star, Award, Target } from 'lucide-react';
import teamCelebration from '../assets/team-celebration.jpg';

const History = () => {
  const milestones = [
    {
      year: 2010,
      title: 'Club Foundation',
      description: 'Gooma United was founded by a group of passionate football enthusiasts in Brussels, Belgium.',
      icon: <Users className="text-red-600" size={24} />,
      type: 'foundation'
    },
    {
      year: 2012,
      title: 'First League Promotion',
      description: 'After two successful seasons, the club earned promotion to the Belgian Second Division.',
      icon: <Target className="text-blue-600" size={24} />,
      type: 'promotion'
    },
    {
      year: 2015,
      title: 'First Major Trophy',
      description: 'Gooma United won their first major trophy, the Belgian Cup, defeating rivals 2-1 in the final.',
      icon: <Trophy className="text-yellow-600" size={24} />,
      type: 'trophy'
    },
    {
      year: 2018,
      title: 'Premier League Promotion',
      description: 'The club achieved their dream of reaching the Belgian Premier League after a thrilling playoff victory.',
      icon: <Star className="text-purple-600" size={24} />,
      type: 'promotion'
    },
    {
      year: 2020,
      title: 'First League Title',
      description: 'In a historic season, Gooma United claimed their first league championship title.',
      icon: <Award className="text-green-600" size={24} />,
      type: 'championship'
    },
    {
      year: 2022,
      title: 'European Competition Debut',
      description: 'The club made their European debut in the UEFA Europa League, reaching the round of 16.',
      icon: <Star className="text-blue-600" size={24} />,
      type: 'european'
    },
    {
      year: 2023,
      title: 'Second League Title',
      description: 'Gooma United successfully defended their title, winning their second consecutive championship.',
      icon: <Trophy className="text-red-600" size={24} />,
      type: 'championship'
    },
    {
      year: 2025,
      title: 'Third League Title',
      description: 'The club completed a remarkable hat-trick of league titles with a dramatic final day victory.',
      icon: <Trophy className="text-gold-600" size={24} />,
      type: 'championship'
    }
  ];

  const achievements = [
    {
      title: 'League Championships',
      count: 3,
      years: ['2020', '2023', '2025'],
      icon: <Trophy className="text-yellow-500" size={32} />
    },
    {
      title: 'Belgian Cup',
      count: 1,
      years: ['2015'],
      icon: <Award className="text-blue-500" size={32} />
    },
    {
      title: 'European Appearances',
      count: 3,
      years: ['2022', '2024', '2025'],
      icon: <Star className="text-purple-500" size={32} />
    },
    {
      title: 'Total Matches Played',
      count: 450,
      description: 'Since foundation',
      icon: <Target className="text-green-500" size={32} />
    }
  ];

  const legends = [
    {
      name: 'Captain Jean Dupont',
      position: 'Goalkeeper',
      years: '2010-Present',
      description: 'Club legend and founding member, Jean has been the backbone of Gooma United since day one.',
      achievements: ['3x League Champion', 'Club Captain', '200+ Appearances']
    },
    {
      name: 'Marc "The Wall" Janssen',
      position: 'Defender',
      years: '2012-2024',
      description: 'Legendary defender known for his incredible defensive skills and leadership on the pitch.',
      achievements: ['2x League Champion', 'Defensive Player of the Year', '180+ Appearances']
    },
    {
      name: 'Pierre "Magic" Leroy',
      position: 'Midfielder',
      years: '2015-Present',
      description: 'Creative genius in midfield, Pierre has been instrumental in the club\'s recent success.',
      achievements: ['3x League Champion', 'Player of the Season 2023', '150+ Appearances']
    }
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case 'foundation':
        return 'bg-red-100 border-red-300';
      case 'promotion':
        return 'bg-blue-100 border-blue-300';
      case 'trophy':
        return 'bg-yellow-100 border-yellow-300';
      case 'championship':
        return 'bg-green-100 border-green-300';
      case 'european':
        return 'bg-purple-100 border-purple-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our History
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From humble beginnings to championship glory, discover the remarkable journey of Gooma United
          </p>
        </div>

        {/* Hero Section */}
        <div className="relative mb-16 rounded-lg overflow-hidden">
          <div 
            className="h-64 md:h-96 bg-cover bg-center"
            style={{ backgroundImage: `url(${teamCelebration})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">15 Years of Excellence</h2>
                <p className="text-xl">Building legends, creating memories, achieving greatness</p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-200">
                <div className="flex justify-center mb-4">
                  {achievement.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{achievement.title}</h3>
                <div className="text-3xl font-bold text-red-600 mb-2">{achievement.count}</div>
                {achievement.years && (
                  <div className="text-sm text-gray-600">
                    {achievement.years.join(', ')}
                  </div>
                )}
                {achievement.description && (
                  <div className="text-sm text-gray-600">{achievement.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Club Timeline</h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-red-600 h-full"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className={`bg-white rounded-lg shadow-lg p-6 border-l-4 ${getTypeColor(milestone.type)}`}>
                      <div className="flex items-center gap-3 mb-3">
                        {index % 2 === 0 ? (
                          <>
                            <h3 className="text-xl font-bold text-gray-900">{milestone.title}</h3>
                            {milestone.icon}
                          </>
                        ) : (
                          <>
                            {milestone.icon}
                            <h3 className="text-xl font-bold text-gray-900">{milestone.title}</h3>
                          </>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">{milestone.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-red-600 rounded-full border-4 border-white shadow-lg">
                    <span className="text-white font-bold text-sm">{milestone.year}</span>
                  </div>
                  
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Club Legends */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Club Legends</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {legends.map((legend, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-200">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{legend.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                      {legend.position}
                    </span>
                    <span className="text-gray-600 text-sm">{legend.years}</span>
                  </div>
                  <p className="text-gray-600 mb-4">{legend.description}</p>
                  <div className="space-y-1">
                    {legend.achievements.map((achievement, achIndex) => (
                      <div key={achIndex} className="flex items-center gap-2 text-sm">
                        <Trophy size={14} className="text-yellow-500" />
                        <span className="text-gray-700">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Club Values */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Trophy className="text-red-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-600">We strive for excellence in everything we do, both on and off the pitch.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Unity</h3>
              <p className="text-gray-600">Together we are stronger. Unity and teamwork are at the heart of our success.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Passion</h3>
              <p className="text-gray-600">Our passion for football drives us to achieve greatness and inspire others.</p>
            </div>
          </div>
        </div>

        {/* Future Vision */}
        <div className="text-center bg-gradient-to-r from-red-600 to-black text-white rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-4">Looking Forward</h2>
          <p className="text-xl mb-6 max-w-3xl mx-auto">
            As we continue our journey, Gooma United remains committed to excellence, community engagement, 
            and developing the next generation of football talent. Our story is far from over.
          </p>
          <div className="flex justify-center gap-8 text-center">
            <div>
              <div className="text-2xl font-bold">Next Goal</div>
              <div className="text-red-200">European Trophy</div>
            </div>
            <div>
              <div className="text-2xl font-bold">Vision 2030</div>
              <div className="text-red-200">Youth Academy</div>
            </div>
            <div>
              <div className="text-2xl font-bold">Legacy</div>
              <div className="text-red-200">Community Impact</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;

