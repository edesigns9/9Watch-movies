import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { IMAGE_BASE_URL } from '../constants';
import { ClockIcon } from '../components/icons';
import { useAuth } from '../context/AuthContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback } from '../components/ui/avatar';

interface WatchHistoryItem {
  _id: string;
  media: {
    _id: string;
    title: string;
    posterImageUrl: string;
    type: 'movie' | 'tv-show';
  };
  seasonNumber?: number;
  episodeNumber?: number;
  progressPercent: number;
  lastWatchedAt: string;
}

const ProfilePage: React.FC = () => {
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchWatchHistory = async () => {
      setLoading(true);
      
      // Simulate API call to fetch watch history
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock watch history data
      const mockHistory: WatchHistoryItem[] = [
        {
          _id: 'hist1',
          media: {
            _id: '1',
            title: 'The Final Frontier',
            posterImageUrl: '/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg',
            type: 'movie'
          },
          progressPercent: 75,
          lastWatchedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
        },
        {
          _id: 'hist2',
          media: {
            _id: '2',
            title: 'Cyber City Stories',
            posterImageUrl: '/y28ckLdL2s1J2i1a5H9p7k3n8b4.jpg',
            type: 'tv-show'
          },
          seasonNumber: 1,
          episodeNumber: 3,
          progressPercent: 100,
          lastWatchedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
        },
        {
          _id: 'hist3',
          media: {
            _id: '4',
            title: 'Kings of the Air',
            posterImageUrl: '/dCqcr5d8zH5A9p7k3n8b4y28ckLd1.jpg',
            type: 'tv-show'
          },
          seasonNumber: 2,
          episodeNumber: 1,
          progressPercent: 45,
          lastWatchedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
        }
      ];
      
      setWatchHistory(mockHistory);
      setLoading(false);
    };
    
    fetchWatchHistory();
  }, []);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const clearWatchHistory = async () => {
    if (confirm('Are you sure you want to clear your watch history?')) {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setWatchHistory([]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-brand-surface rounded-lg p-6 mb-6">
            <div className="flex flex-col items-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarFallback className="bg-brand-surface-2 text-brand-text-dim text-xl">
                  {user?.username?.substring(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{user?.username}</h2>
              <p className="text-brand-text-dim text-sm">{user?.email}</p>
              <p className="text-brand-text-dim text-xs mt-2">
                Member since {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-grow">
          <Tabs defaultValue="history" className="w-full">
            <TabsList className="bg-brand-surface-2 mb-6">
              <TabsTrigger value="history" className="data-[state=active]:bg-brand-primary data-[state=active]:text-white">
                Watch History
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-brand-primary data-[state=active]:text-white">
                Account Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="history">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Watch History</h1>
                {watchHistory.length > 0 && (
                  <Button 
                    onClick={clearWatchHistory}
                    variant="ghost"
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  >
                    Clear History
                  </Button>
                )}
              </div>
              
              {loading ? (
                <div className="text-center py-20 text-brand-text-dim">Loading history...</div>
              ) : watchHistory.length === 0 ? (
                <div className="bg-brand-surface rounded-lg p-8 text-center">
                  <ClockIcon className="w-16 h-16 mx-auto mb-4 text-brand-text-dim opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No watch history yet</h3>
                  <p className="text-brand-text-dim mb-6">Start watching movies and shows to build your history</p>
                  <Button asChild>
                    <Link to="/">Browse Content</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {watchHistory.map(item => (
                    <Link 
                      key={item._id} 
                      to={`/media/${item.media._id}`}
                      className="flex bg-brand-surface rounded-lg overflow-hidden hover:bg-brand-surface-2 transition-colors"
                    >
                      <div className="w-24 h-36 flex-shrink-0">
                        <img 
                          src={`${IMAGE_BASE_URL}/w200${item.media.posterImageUrl}`}
                          alt={item.media.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 flex-grow">
                        <h3 className="font-bold text-lg">{item.media.title}</h3>
                        <div className="text-brand-text-dim text-sm mb-2">
                          {item.media.type === 'tv-show' && item.seasonNumber && item.episodeNumber ? (
                            <span>Season {item.seasonNumber}, Episode {item.episodeNumber}</span>
                          ) : (
                            <span>Movie</span>
                          )}
                        </div>
                        <div className="h-1.5 bg-brand-surface-2 rounded-full overflow-hidden mt-2">
                          <div 
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${item.progressPercent}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-xs text-brand-text-dim">
                          <span>{item.progressPercent}% completed</span>
                          <span>Watched on {formatDate(item.lastWatchedAt)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="settings">
              <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
              <div className="bg-brand-surface rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-brand-text-dim mb-1">
                      Username
                    </label>
                    <Input
                      type="text"
                      id="username"
                      defaultValue={user?.username}
                      className="bg-brand-surface-2 border-none text-brand-text"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-brand-text-dim mb-1">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      id="email"
                      defaultValue={user?.email}
                      className="bg-brand-surface-2 border-none text-brand-text"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button
                      type="button"
                      variant="brand"
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
                
                <div className="mt-8 pt-8 border-t border-brand-surface-2">
                  <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-brand-text-dim mb-1">
                        Current Password
                      </label>
                      <Input
                        type="password"
                        id="currentPassword"
                        className="bg-brand-surface-2 border-none text-brand-text"
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-brand-text-dim mb-1">
                        New Password
                      </label>
                      <Input
                        type="password"
                        id="newPassword"
                        className="bg-brand-surface-2 border-none text-brand-text"
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-brand-text-dim mb-1">
                        Confirm New Password
                      </label>
                      <Input
                        type="password"
                        id="confirmPassword"
                        className="bg-brand-surface-2 border-none text-brand-text"
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button
                        type="button"
                        variant="brand"
                      >
                        Update Password
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 