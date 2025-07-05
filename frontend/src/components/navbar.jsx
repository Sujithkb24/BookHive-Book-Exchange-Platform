// import { ArrowLeft } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// export default function NavBar() {
//   const navigate = useNavigate();

//   return (
//     <header className="backdrop-blur-lg z-50 bg-white/10 border border-white/20 rounded-xl shadow-md mx-4 mt-4 px-6 py-3">
//       <div className="flex items-center justify-between">
//         {/* Logo and App Name */}
//         <div className="flex items-center space-x-3">
//           <img
//             src="/favicon.png"
//             alt="Logo"
//             className="w-8 h-8 rounded-full shadow"
//           />
//           <span className="text-white text-xl font-semibold tracking-wide">
//             BookHive
//           </span>
//         </div>

//         {/* Back Button */}
//         <button
//           onClick={() => navigate('/dashboard')}
//           className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow transition-all"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           <span>Back to Dashboard</span>
//         </button>
//       </div>
//     </header>
//   );
// }
import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Bell,
  Settings,
  LogOut,
  Plus,
  Package,
  TrendingUp,
  Heart,
  MessageCircle,
  DollarSign,
  ChevronDown,
  Home,
  Grid3X3,
  FileText,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const NavBar = ({ currentPath = '/dashboard', onNavigate = () => {} }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
 const navigate = useNavigate();
  // Navigation helper
  const navigateto = (path) => {
    onNavigate(path);
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
    setIsNotificationOpen(false);
    navigate(path)
  };

  // Mock user data - replace with actual user fetch
  useEffect(() => {
    fetchUserData();
    fetchCartCount();
    fetchNotifications();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:3000/api/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.profile);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:3000/api/auth/getallcartitems', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCartCount(data.books?.length || 0);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const fetchNotifications = () => {
    // Mock notifications - replace with actual API call
    setNotifications([
      { id: 1, type: 'order', message: 'Your book "Atomic Habits" has been delivered!', time: '2 min ago', read: false },
      { id: 2, type: 'message', message: 'New message from book seller', time: '1 hour ago', read: false },
      { id: 3, type: 'token', message: 'You earned 5 tokens from selling a book!', time: '3 hours ago', read: true },
    ]);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const isActiveRoute = (path) => {
    return currentPath === path;
  };

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Browse Books', path: '/browse', icon: Grid3X3 },
    { name: 'My Orders', path: '/myorders', icon: Package },
    { name: 'Orders to Me', path: '/orders-to-me', icon: FileText },
    { name: 'Sell Book', path: '/addsell', icon: Plus },
    { name: 'Earnings', path: '/YourEarnings', icon: TrendingUp },
  ];

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="border-b border-gray-200/50 sticky top-0 z-50 shadow-sm" style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'linear-gradient(to right, #713125, #8B4513, #22150d)',
        backgroundSize: '300% 300%',
        animation: 'moveBg 10s ease infinite'
      }}>
         <style>
        {`
          @keyframes moveBg {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="relative">
                <img
                  src="/favicon.png"
                  alt="BookHive"
                  className="w-10 h-10 rounded-xl shadow-sm"
                />
                <div className="absolute inset-0 rounded-xl"></div>
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-bold text-white ">
                  BookHive
                </span>
                <div className="text-xs text-gray-50 -mt-1">Book Exchange Hub</div>
              </div>
            </button>
          </div>

          

          {/* Desktop Navigation */}
          <div className="hidden mx-8 lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigateto(item.path)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActiveRoute(item.path)
                    ? 'bg-purple-100 text-amber-600 shadow-sm'
                    : 'text-gray-50 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden xl:block">{item.name}</span>
              </button>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-3">
            {/* Cart */}
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2 text-gray-50 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2 text-gray-50 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <Bell className="h-5 w-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-l-4 ${
                            notification.read ? 'border-transparent' : 'border-blue-500 bg-blue-50/30'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-1 rounded-full ${
                              notification.type === 'order' ? 'bg-green-100 text-green-600' :
                              notification.type === 'message' ? 'bg-blue-100 text-blue-600' :
                              'bg-yellow-100 text-yellow-600'
                            }`}>
                              {notification.type === 'order' ? <Package className="h-3 w-3" /> :
                               notification.type === 'message' ? <MessageCircle className="h-3 w-3" /> :
                               <DollarSign className="h-3 w-3" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-900">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center text-gray-500">
                        <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No notifications yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 p-1 hover:bg-gray-100   rounded-lg transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-400  to-orange-700  rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user.nickname?.charAt(0)?.toUpperCase() || user.username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="hidden  sm:block text-left">
                    <div className="text-sm font-medium text-gray-50 hover:text-black   ">{user.nickname || user.username}</div>
                    <div className="text-xs text-yellow-400 flex items-center">
                      <img
                  src="/fire.png"
                  alt="BookHive"
                  className="w-5 h-5 rounded-xl shadow-sm"
                />
                      {user.token || 0} tokens
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">{user.nickname || user.username}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    
                    <button
                      onClick={() => { navigate('/profile'); setIsProfileDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </button>
                    
                    <button
                      onClick={() => { navigate('/settings'); setIsProfileDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                    
                    <hr className="my-2" />
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
              placeholder="Search books, authors..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setIsMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200 ${
                  isActiveRoute(item.path)
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(isProfileDropdownOpen || isNotificationOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsProfileDropdownOpen(false);
            setIsNotificationOpen(false);
          }}
        />
      )}
    </nav>
  );
};

export default NavBar;