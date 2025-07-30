import React, { useState } from 'react';
import {
  FiEye,
  FiFileText,
  FiTrendingUp,
  FiUsers,
  FiCalendar,
  FiClock,
  FiBarChart2, // ✅ fixed here
  FiActivity,
  FiArrowUp,
  FiArrowDown,
  FiMoreHorizontal
} from 'react-icons/fi';


import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Skeleton Components
  const StatCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-16 mb-3"></div>
          <div className="flex items-center">
            <div className="h-3 bg-gray-200 rounded w-4 mr-1"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );

  const ChartSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 bg-gray-200 rounded w-40"></div>
        <div className="w-5 h-5 bg-gray-200 rounded"></div>
      </div>
      <div className="h-72 bg-gray-100 rounded-lg flex items-end justify-between px-4 pb-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 rounded-t"
            style={{
              height: `${Math.random() * 60 + 20}%`,
              width: '12%'
            }}
          ></div>
        ))}
      </div>
    </div>
  );

  const PieChartSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 bg-gray-200 rounded w-32"></div>
        <div className="w-5 h-5 bg-gray-200 rounded"></div>
      </div>
      <div className="flex items-center justify-center h-72">
        <div className="w-48 h-48 bg-gray-100 rounded-full relative">
          <div className="absolute inset-6 bg-white rounded-full"></div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mt-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center">
            <div className="w-3 h-3 bg-gray-200 rounded-full mr-2"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const ListItemSkeleton = () => (
    <div className="flex items-start space-x-3 p-3 rounded-lg animate-pulse">
      <div className="flex-1 min-w-0">
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="flex items-center space-x-2 mb-2">
          <div className="h-3 bg-gray-200 rounded w-16"></div>
          <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-200 rounded mr-1"></div>
          <div className="h-3 bg-gray-200 rounded w-12 mr-2"></div>
          <div className="h-5 bg-gray-200 rounded-full w-16"></div>
        </div>
      </div>
    </div>
  );

  const TopNewsItemSkeleton = () => (
    <div className="flex items-start space-x-3 animate-pulse">
      <div className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full"></div>
      <div className="flex-1 min-w-0">
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 bg-gray-200 rounded mr-1"></div>
          <div className="h-3 bg-gray-200 rounded w-12 mr-2"></div>
          <div className="w-3 h-3 bg-gray-200 rounded"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  );

  const ActivityItemSkeleton = () => (
    <div className="flex items-start space-x-3 animate-pulse">
      <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full"></div>
      <div className="flex-1 min-w-0">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );

  const QuickActionSkeleton = () => (
    <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg animate-pulse">
      <div className="w-5 h-5 bg-gray-200 rounded mr-2"></div>
      <div className="h-4 bg-gray-200 rounded w-20"></div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-5 bg-gray-200 rounded w-96"></div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <StatCardSkeleton key={index} />
            ))}
          </div>

          {/* Charts Row Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartSkeleton />
            <PieChartSkeleton />
          </div>

          {/* Content Row Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent News Skeleton */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-32"></div>
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <ListItemSkeleton key={index} />
                ))}
              </div>
            </div>

            {/* Top News Today Skeleton */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-36"></div>
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <TopNewsItemSkeleton key={index} />
                ))}
              </div>
            </div>

            {/* Recent Activities Skeleton */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-40"></div>
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <ActivityItemSkeleton key={index} />
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <QuickActionSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sample data
  const statsData = {
    totalNews: 1247,
    totalViews: 89432,
    todayNews: 12,
    todayViews: 3421,
    totalUsers: 5678,
    activeUsers: 234
  };

  const newsViewsData = [
    { name: 'Mon', views: 2400, news: 8 },
    { name: 'Tue', views: 1398, news: 12 },
    { name: 'Wed', views: 9800, news: 15 },
    { name: 'Thu', views: 3908, news: 10 },
    { name: 'Fri', views: 4800, news: 18 },
    { name: 'Sat', views: 3800, news: 14 },
    { name: 'Sun', views: 4300, news: 16 }
  ];

  const categoryData = [
    { name: 'Politics', value: 35, color: '#6366f1' },
    { name: 'Sports', value: 25, color: '#10b981' },
    { name: 'Technology', value: 20, color: '#f59e0b' },
    { name: 'Entertainment', value: 12, color: '#ef4444' },
    { name: 'Business', value: 8, color: '#8b5cf6' }
  ];

  const recentNews = [
    {
      id: 1,
      title: "Breaking: Major Economic Policy Changes Announced",
      views: 1234,
      publishedAt: "2 hours ago",
      status: "published",
      category: "Politics"
    },
    {
      id: 2,
      title: "Tech Giants Report Record Quarterly Earnings",
      views: 987,
      publishedAt: "4 hours ago",
      status: "published",
      category: "Technology"
    },
    {
      id: 3,
      title: "Championship Finals Draw Record Viewership",
      views: 2156,
      publishedAt: "6 hours ago",
      status: "published",
      category: "Sports"
    },
    {
      id: 4,
      title: "New Environmental Regulations Take Effect",
      views: 543,
      publishedAt: "8 hours ago",
      status: "draft",
      category: "Politics"
    }
  ];

  const topNewsToday = [
    {
      id: 1,
      title: "Breaking: Major Economic Policy Changes Announced",
      views: 15420,
      category: "Politics",
      trend: "up"
    },
    {
      id: 2,
      title: "Championship Finals Draw Record Viewership",
      views: 12340,
      category: "Sports",
      trend: "up"
    },
    {
      id: 3,
      title: "Tech Giants Report Record Quarterly Earnings",
      views: 9876,
      category: "Technology",
      trend: "down"
    },
    {
      id: 4,
      title: "Celebrity Wedding Breaks Internet",
      views: 8765,
      category: "Entertainment",
      trend: "up"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: "Published new article",
      title: "Breaking: Major Economic Policy Changes",
      time: "2 minutes ago",
      type: "publish"
    },
    {
      id: 2,
      action: "Updated article",
      title: "Tech Giants Report Record Earnings",
      time: "15 minutes ago",
      type: "update"
    },
    {
      id: 3,
      action: "New user registered",
      title: "john.doe@example.com",
      time: "1 hour ago",
      type: "user"
    },
    {
      id: 4,
      action: "Article reached 10K views",
      title: "Championship Finals Draw Record...",
      time: "2 hours ago",
      type: "milestone"
    },
    {
      id: 5,
      action: "Comment moderated",
      title: "Environmental Regulations Article",
      time: "3 hours ago",
      type: "moderate"
    }
  ];

  const StatCard = ({ title, value, change, changeType, icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${changeType === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
              {changeType === 'up' ? <FiArrowUp className="mr-1" /> : <FiArrowDown className="mr-1" />}
              {change}% from yesterday
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your news portal today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total News"
            value={statsData.totalNews}
            change={12}
            changeType="up"
            icon={FiFileText}
            color="bg-blue-500"
          />
          <StatCard
            title="Total Views"
            value={statsData.totalViews}
            change={8}
            changeType="up"
            icon={FiEye}
            color="bg-green-500"
          />
          <StatCard
            title="Today's News"
            value={statsData.todayNews}
            change={25}
            changeType="up"
            icon={FiCalendar}
            color="bg-purple-500"
          />
          <StatCard
            title="Active Users"
            value={statsData.activeUsers}
            change={3}
            changeType="down"
            icon={FiUsers}
            color="bg-orange-500"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* News Views Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">News Views This Week</h3>
              <FiBarChart2 className="text-gray-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={newsViewsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* News by Category */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">News by Category</h3>
              <FiActivity className="text-gray-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-4 mt-4">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent News */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent News</h3>
              <FiClock className="text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentNews.map((news) => (
                <div key={news.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{news.title}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <span>{news.category}</span>
                      <span className="mx-1">•</span>
                      <span>{news.publishedAt}</span>
                    </div>
                    <div className="flex items-center mt-2">
                      <FiEye className="w-3 h-3 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-500">{news.views} views</span>
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${news.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {news.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top News Today */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top News Today</h3>
              <FiTrendingUp className="text-gray-400" />
            </div>
            <div className="space-y-4">
              {topNewsToday.map((news, index) => (
                <div key={news.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-indigo-600">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{news.title}</p>
                    <div className="flex items-center mt-1">
                      <FiEye className="w-3 h-3 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-500 mr-2">{news.views.toLocaleString()}</span>
                      {news.trend === 'up' ? (
                        <FiArrowUp className="w-3 h-3 text-green-500" />
                      ) : (
                        <FiArrowDown className="w-3 h-3 text-red-500" />
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{news.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
              <FiActivity className="text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${activity.type === 'publish' ? 'bg-green-100' :
                      activity.type === 'update' ? 'bg-blue-100' :
                        activity.type === 'user' ? 'bg-purple-100' :
                          activity.type === 'milestone' ? 'bg-yellow-100' :
                            'bg-gray-100'
                    }`}>
                    {activity.type === 'publish' && <FiFileText className="w-4 h-4 text-green-600" />}
                    {activity.type === 'update' && <FiFileText className="w-4 h-4 text-blue-600" />}
                    {activity.type === 'user' && <FiUsers className="w-4 h-4 text-purple-600" />}
                    {activity.type === 'milestone' && <FiTrendingUp className="w-4 h-4 text-yellow-600" />}
                    {activity.type === 'moderate' && <FiMoreHorizontal className="w-4 h-4 text-gray-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600 truncate">{activity.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex items-center justify-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
              <FiFileText className="w-5 h-5 text-indigo-600 mr-2" />
              <span className="text-sm font-medium text-indigo-600">Add News</span>
            </button>
            <button className="flex items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <FiUsers className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-green-600">Manage Users</span>
            </button>
            <button className="flex items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <FiBarChart2 className="w-5 h-5 text-purple-600 mr-2" />
              <span className="text-sm font-medium text-purple-600">Analytics</span>
            </button>
            <button className="flex items-center justify-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              <FiActivity className="w-5 h-5 text-orange-600 mr-2" />
              <span className="text-sm font-medium text-orange-600">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
