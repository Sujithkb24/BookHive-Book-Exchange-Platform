import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, BookOpen, DollarSign, Users, Eye, EyeOff, Star, Calendar, Filter } from 'lucide-react';
import NavBar from '../components/navbar';
import Footer1 from '../ui/footer';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
const BookstoreEarningsDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [showDetails, setShowDetails] = useState({});
  const [animationKey, setAnimationKey] = useState(0);

  // Sample data - in real app this would come from API
  const earningsData = [
    { month: 'Jan', earnings: 2400, books: 45, customers: 120 },
    { month: 'Feb', earnings: 1398, books: 28, customers: 98 },
    { month: 'Mar', earnings: 9800, books: 156, customers: 340 },
    { month: 'Apr', earnings: 3908, books: 78, customers: 180 },
    { month: 'May', earnings: 4800, books: 95, customers: 220 },
    { month: 'Jun', earnings: 3800, books: 85, customers: 200 },
    { month: 'Jul', earnings: 6200, books: 125, customers: 280 },
  ];

  const categoryData = [
    { name: 'Fiction', value: 35, earnings: 8500, color: '#8B5CF6' },
    { name: 'Non-Fiction', value: 25, earnings: 6200, color: '#06B6D4' },
    { name: 'Science', value: 20, earnings: 4800, color: '#10B981' },
    { name: 'Biography', value: 12, earnings: 2900, color: '#F59E0B' },
    { name: 'Others', value: 8, earnings: 1900, color: '#EF4444' },
  ];

  const topBooks = [
    { id: 1, title: 'The Midnight Library', author: 'Matt Haig', sales: 145, earnings: 2175, rating: 4.8, category: 'Fiction', trend: '+12%' },
    { id: 2, title: 'Atomic Habits', author: 'James Clear', sales: 132, earnings: 1980, rating: 4.9, category: 'Self-Help', trend: '+8%' },
    { id: 3, title: 'Project Hail Mary', author: 'Andy Weir', sales: 98, earnings: 1470, rating: 4.7, category: 'Science Fiction', trend: '+15%' },
    { id: 4, title: 'The Seven Husbands of Evelyn Hugo', author: 'Taylor Jenkins Reid', sales: 87, earnings: 1305, rating: 4.6, category: 'Fiction', trend: '+5%' },
    { id: 5, title: 'Educated', author: 'Tara Westover', sales: 76, earnings: 1140, rating: 4.8, category: 'Biography', trend: '+3%' },
  ];

  const dailyEarnings = [
    { day: 'Mon', earnings: 850 },
    { day: 'Tue', earnings: 920 },
    { day: 'Wed', earnings: 1200 },
    { day: 'Thu', earnings: 890 },
    { day: 'Fri', earnings: 1450 },
    { day: 'Sat', earnings: 1680 },
    { day: 'Sun', earnings: 1320 },
  ];

  const totalEarnings = earningsData.reduce((sum, item) => sum + item.earnings, 0);
  const totalBooks = earningsData.reduce((sum, item) => sum + item.books, 0);
  const totalCustomers = earningsData.reduce((sum, item) => sum + item.customers, 0);

  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [selectedPeriod]);

  const toggleDetails = (bookId) => {
    setShowDetails(prev => ({
      ...prev,
      [bookId]: !prev[bookId]
    }));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-amber-700 rounded-lg p-3 shadow-xl">
          <p className="text-amber-900 font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm text-amber-800" style={{ color: entry.color }}>
              {entry.name}: ${entry.value?.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <>
    <NavBar/>
    <div className="font min-h-screen bg-white text-white p-6">
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
 <div className="bg-amber-600 backdrop-blur-sm rounded-lg mb-4">
 <div className="max-w-7xl px-2 sm:px-6 lg:px-2">
   <div className="flex items-center justify-center">
     <div className='flex flex-col lg:flex-row items-center gap-4 lg:gap-20'>
       <div className="h-[150px] w-[150px] sm:h-[200px] sm:w-[200px] lg:h-[300px] lg:w-[300px]">
          <DotLottieReact
      src="https://lottie.host/6c203fd1-8d27-40e1-9211-c78e7ebfd18b/4RXsvSRyXL.lottie"
      loop
      autoplay
    />
       </div>
       <div className='flex flex-col gap-2 text-center lg:text-left'>
         <h1 className="font2 text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-2">Earnings Dashboard</h1>
         <p className="font3 text-xl sm:text-3xl lg:text-3xl tracking-wider text-gray-900">Track your Bookstore performance and revenue</p>
       </div>
       <div className="flex items-center space-x-4">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-orange-700 border mr-6 border-amber-900 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all duration-200"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="12m">Last 12 months</option>
              </select>
            </div>
     </div>
   </div>
 </div>
 </div>






        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Total Earnings', value: `$${totalEarnings.toLocaleString()}`, icon: DollarSign, color: 'from-green-400 to-blue-500', change: '+12.5%' },
            { title: 'Books Sold', value: totalBooks.toLocaleString(), icon: BookOpen, color: 'from-purple-400 to-pink-500', change: '+8.2%' },
            { title: 'Customers', value: totalCustomers.toLocaleString(), icon: Users, color: 'from-blue-400 to-cyan-500', change: '+15.3%' },
            { title: 'Avg. Order', value: `$${(totalEarnings / totalBooks).toFixed(2)}`, icon: TrendingUp, color: 'from-orange-400 to-red-500', change: '+4.1%' },
          ].map((stat, index) => (
            <div key={index} className="bg-gradient-to-r from-amber-600 to-orange-800 rounded-xl p-6 border border-amber-950 hover:border-gray-600 transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-50 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  <span className="text-green-400 text-sm font-medium">{stat.change}</span>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Earnings Trend */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-black" />
              Earnings Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={earningsData} key={animationKey}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFFF00" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FFFF00" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#000" />
                <XAxis dataKey="month" stroke="#00000" />
                <YAxis stroke="#00000" />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="earnings" 
                  stroke="#964B00" 
                  fillOpacity={1} 
                  fill="url(#colorEarnings)"
                  strokeWidth={3}
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Daily Earnings */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-black" />
              Daily Earnings
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyEarnings} key={animationKey + 1}>
                <CartesianGrid strokeDasharray="3 3" stroke="#000" />
                <XAxis dataKey="day" stroke="#00000" />
                <YAxis stroke="#00000" />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="earnings" 
                  fill="#FFFF00" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={1500}
                  animationDelay={200}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution & Books Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Category Pie Chart */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Category Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart key={animationKey + 2}>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  animationDuration={1800}
                  animationDelay={300}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value}% ($${props.payload.earnings.toLocaleString()})`,
                    name
                  ]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-sm text-gray-50">{category.name}</span>
                  </div>
                  <span className="text-sm font-medium">{category.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Books */}
          <div className="lg:col-span-2 bg-gradient-to-r from-amber-600 to-orange-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-400" />
              Top Performing Books
            </h3>
            <div className="space-y-4">
              {topBooks.map((book, index) => (
                <div key={book.id} className="bg-orange-900 rounded-lg p-4 hover:bg-orange-950 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white truncate">{book.title}</h4>
                        <button
                          onClick={() => toggleDetails(book.id)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {showDetails[book.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">by {book.author}</p>
                      <div className="flex items-center space-x-4">
                        <span className="text-green-400 font-medium">${book.earnings.toLocaleString()}</span>
                        <span className="text-gray-300">{book.sales} sold</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-sm">{book.rating}</span>
                        </div>
                        <span className="text-blue-400 text-sm font-medium">{book.trend}</span>
                      </div>
                    </div>
                  </div>
                  
                  {showDetails[book.id] && (
                    <div className="mt-4 pt-4 border-t border-gray-600 animate-in slide-in-from-top duration-300">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Category:</span>
                          <span className="ml-2 text-white">{book.category}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Revenue per unit:</span>
                          <span className="ml-2 text-white">${(book.earnings / book.sales).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-800 rounded-xl p-6 border border-gray-600">
          <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-50 to-purple-50 bg-clip-text text-transparent">
            Performance Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-200 mb-2">${totalEarnings.toLocaleString()}</div>
              <div className="text-gray-50">Total Revenue</div>
              <div className="text-sm text-green-400 mt-1">+12.5% from last period</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-50 mb-2">{totalBooks}</div>
              <div className="text-gray-50">Books Sold</div>
              <div className="text-sm text-blue-400 mt-1">Across {categoryData.length} categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-50 mb-2">{totalCustomers}</div>
              <div className="text-gray-50">Happy Customers</div>
              <div className="text-sm text-purple-400 mt-1">4.7 avg rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer1/>
    </>
  );
};

export default BookstoreEarningsDashboard;