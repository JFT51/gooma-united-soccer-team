import React, { useState, useEffect } from 'react';
import { Calendar, User, Clock, ArrowRight, Search, Filter, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getNewsPosts } from '../services/database';

const News = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const newsData = await getNewsPosts();
      setPosts(newsData);
      setFilteredPosts(newsData);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    let filtered = posts;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(post => post.category === categoryFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aDate = a.createdAt.seconds ? a.createdAt.seconds : a.createdAt;
      const bDate = b.createdAt.seconds ? b.createdAt.seconds : b.createdAt;
      
      if (sortBy === 'newest') {
        return bDate - aDate;
      } else {
        return aDate - bDate;
      }
    });

    setFilteredPosts(filtered);
  }, [posts, searchTerm, categoryFilter, sortBy]);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Match Results':
        return 'bg-green-100 text-green-800';
      case 'Transfers':
        return 'bg-blue-100 text-blue-800';
      case 'Training':
        return 'bg-yellow-100 text-yellow-800';
      case 'Community':
        return 'bg-purple-100 text-purple-800';
      case 'Tickets':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const categories = ['All', 'Match Results', 'Transfers', 'Training', 'Community', 'Tickets'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading news...</p>
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
            News & Updates
          </h1>
          <p className="text-xl text-gray-600">
            Stay updated with the latest from Gooma United
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={categoryFilter === (category === 'All' ? 'all' : category) ? 'default' : 'outline'}
                  onClick={() => setCategoryFilter(category === 'All' ? 'all' : category)}
                  className={categoryFilter === (category === 'All' ? 'all' : category) ? 'bg-red-600 hover:bg-red-700' : ''}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Featured Post */}
        {filteredPosts.length > 0 && filteredPosts[0].featured && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Story</h2>
            <div 
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform hover:scale-[1.02] transition-all duration-200"
              onClick={() => setSelectedPost(filteredPosts[0])}
            >
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(filteredPosts[0].category)}`}>
                    {filteredPosts[0].category}
                  </span>
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Featured
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">{filteredPosts[0].title}</h3>
                <p className="text-gray-600 text-lg mb-6 line-clamp-3">{filteredPosts[0].content}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User size={16} />
                      <span>{filteredPosts[0].author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{formatDate(filteredPosts[0].createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{getTimeAgo(filteredPosts[0].createdAt)}</span>
                    </div>
                  </div>
                  <Button variant="ghost" className="text-red-600 hover:text-red-700">
                    Read More
                    <ArrowRight className="ml-1" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.filter(post => !post.featured).map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-200 hover:shadow-xl"
              onClick={() => setSelectedPost(post)}
            >
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-500">{getTimeAgo(post.createdAt)}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.content}
                </p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        <Tag size={12} />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User size={14} />
                    <span>{post.author}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    Read More
                    <ArrowRight className="ml-1" size={14} />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <Search size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No articles found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters.
            </p>
          </div>
        )}

        {/* Article Detail Modal */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 z-10"
                >
                  ✕
                </button>

                {/* Article Header */}
                <div className="p-8 border-b">
                  <div className="flex items-center gap-4 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedPost.category)}`}>
                      {selectedPost.category}
                    </span>
                    {selectedPost.featured && (
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">{selectedPost.title}</h1>
                  
                  <div className="flex items-center gap-6 text-gray-600">
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>{selectedPost.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{formatDate(selectedPost.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{getTimeAgo(selectedPost.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-8">
                  <div className="prose max-w-none">
                    <p className="text-lg leading-relaxed text-gray-700">
                      {selectedPost.content}
                    </p>
                  </div>

                  {/* Tags */}
                  {selectedPost.tags && selectedPost.tags.length > 0 && (
                    <div className="mt-8 pt-6 border-t">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedPost.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                            <Tag size={14} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;