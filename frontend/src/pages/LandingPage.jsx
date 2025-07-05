import React, { useState, useEffect,useRef } from 'react';
import { ChevronDown, BookOpen, Users, Star, ArrowRight, Menu, X, Check, Mail, Phone, MapPin, Sun, Moon, Book, TrendingUp, Eye, Heart } from 'lucide-react';

const BookExchangeLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollY, setScrollY] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [visibleItems, setVisibleItems] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Enhanced animated card component with hover effects
 const AnimatedCard = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const cardRef = useRef(null);
 const [isHovered, setIsHovered] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Delay the visibility by `delay` ms
          setTimeout(() => {
            setIsVisible(true);
          }, delay);

          // Optional: Unobserve after it becomes visible
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1, // Adjust as needed
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [delay]);
    return (
      <div
        className={`transform transition-all duration-700 ease-out ${
          isVisible 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-8 opacity-0'
        } ${isHovered ? 'scale-105 -translate-y-2' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ transitionDelay: isVisible ? '0ms' : `${delay}ms` }}
      >
        {children}
      </div>
    );
  };

  const GradientText = ({ children, className = "" }) => (
    <span className={`bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-600 bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );

  const FloatingBook = ({ delay = 0, size = "w-8 h-8", position = "top-1/4 left-1/4" }) => (
    <div 
      className={`absolute ${position} ${size} ${isDarkMode ? 'text-orange-400/30' : 'text-orange-600/40'} animate-float`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <Book className="w-full h-full" />
    </div>
  );

  // Floating elements for background animation
  const FloatingElement = ({ delay = 0, duration = 6 }) => (
    <div
      className="absolute w-64 h-64 rounded-full opacity-10 blur-3xl animate-pulse"
      style={{
        background: isDarkMode 
          ? 'linear-gradient(45deg, #FF7D29, #FFBF78, #7B4019)'
          : 'linear-gradient(45deg, #FF7D29, #FFBF78, #FFA500)',
        animation: `float ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );

 const TypewriterText = () => {
    const slogans = [
      "Expand Minds",
      "Read More, Spend Less", 
      "Connect Through Stories"
    ];
    
    const [currentSlogan, setCurrentSlogan] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    
    useEffect(() => {
      const currentText = slogans[currentSlogan];
      
      if (isPaused) {
        const pauseTimer = setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(true);
        }, 2000);
        return () => clearTimeout(pauseTimer);
      }
      
      const timer = setTimeout(() => {
        if (!isDeleting) {
          if (displayText.length < currentText.length) {
            setDisplayText(currentText.slice(0, displayText.length + 1));
          } else {
            setIsPaused(true);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(currentText.slice(0, displayText.length - 1));
          } else {
            setIsDeleting(false);
            setCurrentSlogan((prev) => (prev + 1) % slogans.length);
          }
        }
      }, isDeleting ? 50 : 100);
      
      return () => clearTimeout(timer);
    }, [displayText, isDeleting, isPaused, currentSlogan, slogans]);
    
    return (
      <div className="min-h-[120px] flex items-center justify-center">
        <div className="w-[800px] text-center">
          <GradientText className="text-6xl md:text-8xl">
            {displayText}
            <span className={`animate-pulse ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>|</span>
          </GradientText>
        </div>
      </div>
    );
  };
  
  // Book rating component
  const BookRating = ({ rating = 4.5 }) => (
    <div className="flex items-center gap-1 mb-2">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          className={`${
            i < Math.floor(rating) 
              ? 'text-yellow-400 fill-yellow-400' 
              : i < rating 
              ? 'text-yellow-400 fill-yellow-400 opacity-50' 
              : isDarkMode ? 'text-gray-600' : 'text-gray-400'
          } transition-colors duration-200`}
        />
      ))}
      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} ml-1`}>{rating}</span>
    </div>
  );

  // Enhanced book card with more interactive elements
  const BookCard = ({ book, index }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [viewCount, setViewCount] = useState(book.views || Math.floor(Math.random() * 500) + 100);

    const handleLike = (e) => {
      e.stopPropagation();
      setIsLiked(!isLiked);
    };

    const handleView = () => {
      setViewCount(prev => prev + 1);
    };

    // Generate unique gradient for each book
    const gradients = isDarkMode ? [
      'from-orange-500/30 via-yellow-500/20 to-orange-600/30',
      'from-yellow-500/30 via-orange-500/20 to-yellow-600/30',
      'from-orange-600/30 via-yellow-400/20 to-orange-500/30',
      'from-yellow-600/30 via-orange-400/20 to-yellow-500/30'
    ] : [
      'from-orange-400/40 via-yellow-400/30 to-orange-500/40',
      'from-yellow-400/40 via-orange-400/30 to-yellow-500/40',
      'from-orange-500/40 via-yellow-300/30 to-orange-400/40',
      'from-yellow-500/40 via-orange-300/30 to-yellow-400/40'
    ];

    return (
      <AnimatedCard delay={index * 200} index={index}>
        <div className={`group relative ${isDarkMode ? 'bg-white/5' : 'bg-white/80'} backdrop-blur-xl rounded-3xl p-6 border ${isDarkMode ? 'border-white/10 hover:border-orange-400/50' : 'border-gray-200/50 hover:border-orange-500/50'} transition-all duration-500 hover:shadow-2xl ${isDarkMode ? 'hover:shadow-orange-500/20' : 'hover:shadow-orange-400/30'} overflow-hidden`}>
          {/* Animated background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />
          
          {/* Floating sparkles effect */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
          </div>

          <div className="relative z-10">
            {/* Book cover with enhanced hover effects */}
            <div className={`h-56 bg-gradient-to-br ${gradients[index % gradients.length]} rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500`}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <BookOpen className="h-20 w-20 text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
              
              {/* Trending indicator */}
              {book.trending && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 animate-bounce">
                  <TrendingUp size={12} />
                  Hot
                </div>
              )}

              {/* Like button */}
              <button
                onClick={handleLike}
                className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all duration-300 group"
              >
                <Heart 
                  size={16} 
                  className={`transition-all duration-300 ${
                    isLiked 
                      ? 'text-red-500 fill-red-500 scale-110' 
                      : 'text-white hover:text-red-400'
                  }`} 
                />
              </button>
            </div>

           {/* Book info */}
            <div className="space-y-3">
              <BookRating rating={book.rating} />
              
              <h3 className={`font-bold text-xl mb-2 ${isDarkMode ? 'group-hover:text-orange-300' : 'group-hover:text-orange-600'} transition-colors duration-300 line-clamp-2`}>
                {book.title}
              </h3>
              
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-3`}>by {book.author}</p>
              
              <div className="flex items-center justify-between mb-4">
                <span className={`text-sm px-3 py-1 ${isDarkMode ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-400/30 text-orange-700'} rounded-full`}>
                  {book.genre}
                </span>
                <div className={`flex items-center gap-4 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  <div className="flex items-center gap-1">
                    <Users size={12} />
                    {book.exchanges}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye size={12} />
                    {viewCount}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button 
                  onClick={handleView}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 py-3 rounded-2xl font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 text-white group-hover:scale-105 flex items-center justify-center gap-2"
                >
                  View Details
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </AnimatedCard>
    );
  };

  const themeClasses = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    navBg: isDarkMode ? 'bg-gray-900/90' : 'bg-white/90',
    navBorder: isDarkMode ? 'border-gray-800' : 'border-gray-200',
    cardBg: isDarkMode ? 'bg-gray-800/50 backdrop-blur-xl' : 'bg-white/80 backdrop-blur-xl',
    cardBorder: isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50',
    cardHover: isDarkMode ? 'hover:border-orange-500/50' : 'hover:border-orange-400/50',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-700',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    sectionBg: isDarkMode ? 'bg-gray-800/30' : 'bg-gray-100/30',
    inputBg: isDarkMode ? 'bg-gray-700/50' : 'bg-gray-200/50',
    inputBorder: isDarkMode ? 'border-gray-600' : 'border-gray-300',
    footerBg: isDarkMode ? 'bg-gray-900' : 'bg-gray-100',
    footerBorder: isDarkMode ? 'border-gray-800' : 'border-gray-200',
    heroBg: isDarkMode ? 'bg-[#7b4019]' : 'bg-[#ffeea9]',
    heroText: isDarkMode ? 'text-white' : 'text-[#7b4019]',
    heroGradient: isDarkMode ? 'from-[#7b4019]/20 via-[#7b4019] to-[#ff7d29]/20' : 'from-[#ffbf78]/20 via-[#ffeea9] to-[#ff7d29]/20',
    heroOrb1: isDarkMode ? 'bg-[#ff7d29]/10' : 'bg-[#ff7d29]/20',
    heroOrb2: isDarkMode ? 'bg-[#ffbf78]/10' : 'bg-[#ffbf78]/20'
  };

  const roadmapData = [
    { 
      phase: 'Q2 2025', 
      title: 'AI Recommendation Engine', 
      status: 'In Progress', 
      description: 'Advanced ML algorithms for personalized book recommendations',
      icon: '🤖'
    },
    { 
      phase: 'Q3 2025', 
      title: 'Virtual Book Clubs', 
      status: 'Planned', 
      description: 'Host and join virtual reading sessions with community members',
      icon: '📚'
    },
    { 
      phase: 'Q4 2025', 
      title: 'Global Marketplace', 
      status: 'Planned', 
      description: 'Expand to international book exchanges and rare book trading',
      icon: '🌍'
    },
    { 
      phase: 'Q1 2026', 
      title: 'AR Book Preview', 
      status: 'Research', 
      description: 'Augmented reality features for previewing books before exchange',
      icon: '🥽'
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      roadmapData.forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems(prev => [...prev, index]);
        }, index * 200);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'In Progress':
        return isDarkMode 
          ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30'
          : 'bg-gradient-to-r from-yellow-400/30 to-orange-400/30 text-yellow-700 border border-yellow-500/40';
      case 'Planned':
        return isDarkMode
          ? 'bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-orange-400 border border-orange-500/30'
          : 'bg-gradient-to-r from-orange-400/30 to-yellow-400/30 text-orange-700 border border-orange-500/40';
      case 'Research':
        return isDarkMode
          ? 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20 text-yellow-600 border border-yellow-600/30'
          : 'bg-gradient-to-r from-yellow-500/30 to-orange-500/30 text-yellow-800 border border-yellow-600/40';
      default:
        return isDarkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-400/30 text-gray-700';
    }
  };

  const categories = ['All', 'Fiction', 'Self-Help', 'Sci-Fi', 'Fantasy'];
  
  const books = [
    { 
      title: 'The Midnight Library', 
      author: 'Matt Haig', 
      genre: 'Fiction', 
      exchanges: 156,
      rating: 4.8,
      trending: true,
      views: 1240
    },
    { 
      title: 'Atomic Habits', 
      author: 'James Clear', 
      genre: 'Self-Help', 
      exchanges: 243,
      rating: 4.9,
      trending: true,
      views: 2100
    },
    { 
      title: 'Dune', 
      author: 'Frank Herbert', 
      genre: 'Sci-Fi', 
      exchanges: 189,
      rating: 4.7,
      trending: false,
      views: 980
    },
    { 
      title: 'The Seven Moons', 
      author: 'Alex Rivera', 
      genre: 'Fantasy', 
      exchanges: 78,
      rating: 4.5,
      trending: false,
      views: 567
    }
  ];

  const filteredBooks = selectedCategory === 'All' 
    ? books 
    : books.filter(book => book.genre === selectedCategory);

  return (
    <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text} overflow-x-hidden transition-colors duration-300`}>
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-xl ${themeClasses.navBg} border-b ${themeClasses.navBorder} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
           <div className="flex items-center space-x-2">
              <a href="#home">
                 <img src='/favicon.png' className='w-[50px] h-[50px]' alt="BookHive Logo" />
               </a>
              <a href="#home" className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
                 BookHive
               </a>
           </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {['Home', 'About', 'Features', 'Store', 'Roadmap', 'Contact'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`${themeClasses.textSecondary} hover:text-orange-400 transition-colors duration-300 font-medium`}
                >
                  {item}
                </a>
              ))}
              
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${themeClasses.cardBg} ${themeClasses.cardBorder} border hover:border-orange-500/50 transition-all duration-300`}
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              
              <button className="bg-gradient-to-r from-orange-500 to-yellow-500 px-6 py-2 rounded-full font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 text-white">
                Get Started
              </button>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={`fixed inset-0 z-40 ${themeClasses.navBg} backdrop-blur-xl md:hidden`}>
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            {['Home', 'About', 'Features', 'Store', 'Roadmap', 'Contact'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`text-2xl font-semibold ${themeClasses.textSecondary} hover:text-orange-400 transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <button
              onClick={toggleDarkMode}
              className={`flex items-center space-x-2 text-lg font-semibold ${themeClasses.textSecondary} hover:text-orange-400 transition-colors`}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      
      <div className={`min-h-screen ${isDarkMode ? 'bg-[#7b4019] text-white' : 'bg-[#ffeea9] text-[#7b4019]'} transition-colors duration-500`}>
      
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-br from-[#7b4019]/20 via-[#7b4019] to-[#ff7d29]/20' : 'bg-gradient-to-br from-[#ffbf78]/20 via-[#ffeea9] to-[#ff7d29]/20'} animate-gradient-shift`}></div>
        
        {/* Floating Orbs */}
        <div className="absolute inset-0">
          <div className={`absolute top-1/4 left-1/4 w-72 h-72 ${isDarkMode ? 'bg-[#ff7d29]/10' : 'bg-[#ff7d29]/20'} rounded-full filter blur-3xl animate-pulse-slow`}></div>
          <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${isDarkMode ? 'bg-[#ffbf78]/10' : 'bg-[#ffbf78]/20'} rounded-full filter blur-3xl animate-pulse-slow`} style={{animationDelay: '1s'}}></div>
        </div>

        {/* Floating Books */}
        <FloatingBook position="top-10 left-10" delay={0} />
        <FloatingBook position="top-1/3 right-20" delay={2000} size="w-6 h-6" />
        <FloatingBook position="bottom-1/3 left-16" delay={4000} size="w-10 h-10" />
        <FloatingBook position="top-20 right-1/3" delay={6000} />
        <FloatingBook position="bottom-20 right-10" delay={8000} size="w-7 h-7" />
        <FloatingBook position="top-1/2 left-8" delay={10000} size="w-5 h-5" />

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              Exchange Books,
              <br />
              <TypewriterText />
            </h1>
            <p className={`text-xl md:text-2xl ${themeClasses.textSecondary} mb-8 max-w-3xl mx-auto font-light animate-fade-in-delay`}>
              Join the revolutionary platform where book lovers connect, trade, and discover their next favorite read.
              Transform your bookshelf into a gateway to endless literary adventures.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-delay-2">
            <button className="group bg-gradient-to-r from-[#ff7d29] to-[#ffbf78] px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-[#ff7d29]/25 transition-all duration-300 transform hover:scale-105 text-white">
              Start Trading Books
              <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className={`px-8 py-4 rounded-full border-2 ${themeClasses.cardBorder} hover:border-[#ff7d29] font-semibold transition-all duration-300 hover:bg-[#ff7d29]/10`}>
              Watch Demo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              { number: '50K+', label: 'Active Traders', icon: Users },
              { number: '200K+', label: 'Books Exchanged', icon: BookOpen },
              { number: '4.9★', label: 'User Rating', icon: Star }
            ].map((stat, index) => (
              <AnimatedCard key={index} delay={index * 200}>
                <div className={`${themeClasses.cardBg} backdrop-blur-xl rounded-2xl p-6 border ${themeClasses.cardBorder} ${themeClasses.cardHover} transition-all duration-300 hover:scale-105`}>
                  <stat.icon className="h-8 w-8 text-[#ff7d29] mb-4 mx-auto" />
                  <div className="text-3xl font-bold mb-2">{stat.number}</div>
                  <div className={themeClasses.textMuted}>{stat.label}</div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className={`h-8 w-8 ${themeClasses.textMuted}`} />
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(90deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
          75% { transform: translateY(-30px) rotate(270deg); }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.1); }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 1s ease-out 0.3s both;
        }
        
        .animate-fade-in-delay-2 {
          animation: fade-in 1s ease-out 0.6s both;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out both;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  


      {/* About Section */}
     <div className={`min-h-screen ${isDarkMode ? 'bg-[#7b4019] text-white' : 'bg-[#ffeea9] text-[#7b4019]'} transition-colors duration-500`}>
      {/* Theme Toggle */}
      

      {/* About Section */}
      <section id="about" className="py-20 px-4 relative overflow-hidden"> 

        <div className="max-w-7xl mx-auto relative z-10"> 
          <div className="text-center mb-16"> 
            <h2 className="text-4xl md:text-6xl font-bold mb-6"> 
              About <GradientText>BookHive</GradientText> 
            </h2> 
            <p className={`text-xl ${themeClasses.textSecondary} max-w-3xl mx-auto`}> 
              Born from a passion for literature and community, BookHive revolutionizes how book enthusiasts  
              discover, share, and enjoy their favorite reads. 
            </p> 
          </div> 
 
          <div className="grid md:grid-cols-2 gap-12 items-center"> 
            <div className="space-y-6"> 
              <h3 className="text-3xl font-bold mb-4">Our Mission</h3> 
              <p className={`${themeClasses.textSecondary} text-lg`}> 
                We believe every book deserves multiple readers and every reader deserves access to countless stories.  
                Our platform creates a sustainable ecosystem where literature flows freely between passionate readers. 
              </p> 
              <div className="space-y-4"> 
                {[ 
                  'Sustainable reading through book exchange', 
                  'Building communities of book lovers', 
                  'Making literature accessible to everyone', 
                  'Reducing waste through book reuse' 
                ].map((item, index) => ( 
                  <div key={index} className="flex items-center space-x-3 animate-slide-in" style={{animationDelay: `${index * 200}ms`}}> 
                    <div className="relative">
                      <Check className="h-5 w-5 text-[#ff7d29] animate-pulse-glow hover:scale-110 transition-transform duration-300" /> 
                      <div className="absolute inset-0 bg-[#ff7d29]/20 rounded-full animate-ping"></div>
                    </div>
                    <span className={themeClasses.textSecondary}>{item}</span> 
                  </div> 
                ))} 
              </div>

              {/* Founder's Quote */}
              <div className={`mt-8 p-6 rounded-2xl border-l-4 border-[#ff7d29] ${themeClasses.cardBg} backdrop-blur-xl`}>
                <blockquote className={`text-lg italic ${themeClasses.textSecondary} mb-3`}>
                  "Stories should never be locked away. At BookHive, we believe every book has more than one reader."
                </blockquote>
                <cite className="text-[#ff7d29] font-semibold">— Sujith, BookHive Founder</cite>
              </div>
            </div> 

            {/* Visual Timeline */}
            <div className="relative"> 
              <div className={`bg-gradient-to-br from-[#ff7d29]/20 to-[#ffbf78]/20 rounded-3xl p-8 backdrop-blur-xl border ${themeClasses.cardBorder}`}> 
                <h4 className="text-2xl font-bold mb-8 text-center">Our Journey</h4>
                <div className="space-y-8">
                  {[ 
                    { title: 'Founded', value: '2023', icon: Star, color: 'text-[#ffbf78]' }, 
                    { title: 'Genres', value: '500+', icon: BookOpen, color: 'text-[#ff7d29]' }, 
                    { title: 'Communities', value: '100+', icon: Users, color: 'text-[#7b4019]' } 
                  ].map((stat, index) => ( 
                    <div key={index} className="flex items-center space-x-4 group hover:scale-105 transition-transform duration-300"> 
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r from-[#ff7d29]/20 to-[#ffbf78]/20 flex items-center justify-center border ${themeClasses.cardBorder}`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${themeClasses.textMuted}`}>{stat.title}</span>
                          <span className="text-2xl font-bold text-[#ff7d29]">{stat.value}</span>
                        </div>
                        <div className={`h-2 bg-gray-200/20 rounded-full mt-2 overflow-hidden`}>
                          <div 
                            className="h-full bg-gradient-to-r from-[#ff7d29] to-[#ffbf78] rounded-full animate-progress"
                            style={{animationDelay: `${index * 500}ms`}}
                          ></div>
                        </div>
                      </div>
                    </div> 
                  ))} 
                </div>
              </div> 
            </div> 
          </div>
        </div> 
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(90deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
          75% { transform: translateY(-30px) rotate(270deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.1); }
        }

        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 5px rgba(255, 125, 41, 0.3); }
          50% { box-shadow: 0 0 20px rgba(255, 125, 41, 0.6), 0 0 30px rgba(255, 125, 41, 0.4); }
        }

        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-slide-in {
          animation: slide-in 0.8s ease-out both;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animate-progress {
          animation: progress 2s ease-out both;
        }
      `}</style>
    </div>

     {/* Features Section */}
{/* Features Section */}
<section id="features" className={`py-20 px-4 ${isDarkMode ? 'bg-gradient-to-br from-[#7B4019] to-[#5A2E12]' : 'bg-gradient-to-br from-[#FFEEA9] to-[#FFF8DC]'}`}>
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-16">
      <h2 className={`text-4xl md:text-6xl font-bold mb-6 ${themeClasses.textPrimary}`}>
        Powerful <GradientText>Features</GradientText>
      </h2>
      <p className={`text-xl ${themeClasses.textSecondary} max-w-3xl mx-auto`}>
        Everything you need to trade, discover, and enjoy books in one seamless platform
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        {
          title: 'Smart Matching',
          description: 'AI-powered algorithm matches you with readers who have books you want and want books you have.',
          icon: '🤖',
          gradient: isDarkMode ? 'from-[#7B4019] to-[#FF7D29]' : 'from-[#FFBF78] to-[#FF7D29]'
        },
        {
          title: 'Local Communities',
          description: 'Connect with book lovers in your area for easy exchanges and book club discussions.',
          icon: '🏘️',
          gradient: isDarkMode ? 'from-[#FF7D29] to-[#FFBF78]' : 'from-[#FF7D29] to-[#FFEEA9]'
        },
        {
          title: 'Rating System',
          description: 'Rate books and traders to help build a trustworthy community ecosystem.',
          icon: '⭐',
          gradient: isDarkMode ? 'from-[#FFBF78] to-[#FFEEA9]' : 'from-[#FFEEA9] to-[#FFBF78]'
        },
        {
          title: 'Secure Exchanges',
          description: 'Built-in escrow system ensures safe and fair book exchanges every time.',
          icon: '🔒',
          gradient: isDarkMode ? 'from-[#7B4019] to-[#FFBF78]' : 'from-[#7B4019] to-[#FF7D29]'
        }
      ].map((feature, index) => (
        <AnimatedCard key={index} delay={index * 100}>
          <div className={`${themeClasses.cardBg} backdrop-blur-xl rounded-2xl p-8 border ${themeClasses.cardBorder} ${themeClasses.cardHover} transition-all duration-300 h-full flex flex-col items-center text-center`}>
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-3xl mb-6 animate-[float_4s_ease-in-out_infinite] ${index % 2 === 0 ? 'animate-delay-100' : 'animate-delay-300'}`}>
              {feature.icon}
            </div>
            <h3 className={`text-2xl font-bold mb-4 ${themeClasses.textPrimary}`}>{feature.title}</h3>
            <p className={themeClasses.textSecondary}>{feature.description}</p>
            <div className={`mt-6 w-full h-1 bg-gradient-to-r from-transparent ${isDarkMode ? 'via-[#FF7D29]' : 'via-[#FFBF78]'} to-transparent ${isDarkMode ? 'opacity-30' : 'opacity-50'}`}></div>
          </div>
        </AnimatedCard>
      ))}
    </div>

    <div className={`mt-16 text-center ${themeClasses.cardBg} backdrop-blur-xl rounded-3xl p-8 border ${themeClasses.cardBorder}`}>
      <h3 className={`text-3xl font-bold mb-4 ${themeClasses.textPrimary}`}>Ready to Transform Your Reading Experience?</h3>
      <p className={`text-xl ${themeClasses.textSecondary} mb-8 max-w-2xl mx-auto`}>
        Join thousands of book lovers already enjoying seamless book exchanges.
      </p>
      <button className={`group px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-[#7B4019] to-[#FF7D29] text-white hover:shadow-[#FF7D29]/25' 
          : 'bg-gradient-to-r from-[#FF7D29] to-[#FFBF78] text-white hover:shadow-[#FF7D29]/25'
      }`}>
        Get Started Now
        <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </div>
</section>

{/* Testimonials */}
<section className={`py-20 px-4 ${themeClasses.sectionBg}`}>
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-16">
      <h2 className={`text-4xl md:text-6xl font-bold mb-6 ${themeClasses.textPrimary}`}>
        What Our <GradientText>Users Say</GradientText>
      </h2>
    </div>

    <div className="grid md:grid-cols-3 gap-8">
      {[
        {
          name: 'Sarah Chen',
          role: 'Avid Reader',
          quote: 'BookSwap transformed my reading experience. I\'ve discovered amazing books I never would have found otherwise!',
          rating: 5,
          avatar: '👩‍💼'
        },
        {
          name: 'Marcus Johnson',
          role: 'Book Collector',
          quote: 'The community aspect is incredible. I\'ve made lasting friendships through our shared love of literature.',
          rating: 5,
          avatar: '👨‍🎓'
        },
        {
          name: 'Emily Rodriguez',
          role: 'Student',
          quote: 'As a student, this platform saves me hundreds on textbooks while giving me access to recreational reading.',
          rating: 5,
          avatar: '👩‍🎓'
        }
      ].map((testimonial, index) => (
        <AnimatedCard key={index} delay={index * 200}>
          <div className={`${themeClasses.cardBg} backdrop-blur-xl rounded-2xl p-8 border ${themeClasses.cardBorder} ${themeClasses.cardHover} transition-all duration-300`}>
            <div className="flex items-center mb-6">
              <div className="text-4xl mr-4">{testimonial.avatar}</div>
              <div>
                <div className={`font-bold ${themeClasses.textPrimary}`}>{testimonial.name}</div>
                <div className={themeClasses.textMuted}>{testimonial.role}</div>
              </div>
            </div>
            <p className={`${themeClasses.textSecondary} mb-4`}>"{testimonial.quote}"</p>
            <div className="flex">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />
              ))}
            </div>
          </div>
        </AnimatedCard>
      ))}
    </div>
  </div>
</section>

{/* Book Store Section */}
<div className={`min-h-screen ${isDarkMode 
  ? 'bg-gradient-to-br from-amber-900 via-orange-800 to-amber-900 text-white' 
  : 'bg-gradient-to-br from-amber-100 via-orange-100 to-amber-50 text-gray-900'
}`}>
  {/* Floating background elements */}
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <FloatingElement delay={0} duration={8} />
    <FloatingElement delay={2} duration={10} />
    <FloatingElement delay={4} duration={6} />
  </div>

  {/* Book Store Section */}
  <section className="relative py-24 px-4">
    <div className="max-w-7xl mx-auto">
      {/* Enhanced header with animated elements */}
      <div className="text-center mb-20 relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8">
          <div className={`w-32 h-1 bg-gradient-to-r from-transparent ${isDarkMode ? 'via-orange-400' : 'via-orange-600'} to-transparent animate-pulse`} />
        </div>
        
        <h2 className={`text-5xl md:text-7xl font-bold mb-8 relative ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Featured{' '}
          <GradientText className="relative">
            Books
            <div className={`absolute -inset-2 bg-gradient-to-r ${isDarkMode ? 'from-orange-400/20 to-amber-400/20' : 'from-orange-600/10 to-amber-600/10'} blur-xl -z-10 animate-pulse`} />
          </GradientText>
        </h2>
        
        <p className={`text-xl ${isDarkMode ? 'text-amber-200' : 'text-gray-700'} max-w-4xl mx-auto leading-relaxed mb-12`}>
          Discover trending books available for exchange in our vibrant community. 
          Join thousands of readers sharing their favorite stories.
        </p>

        {/* Category filter with animation */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-amber-800 to-orange-500 text-white shadow-lg shadow-orange-500/25 scale-105'
                  : isDarkMode 
                    ? 'bg-white/10 text-amber-200 hover:bg-white/20 hover:text-white'
                    : 'bg-black/10 text-gray-700 hover:bg-black/20 hover:text-gray-900'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced book grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredBooks.map((book, index) => (
          <BookCard key={`${book.title}-${selectedCategory}`} book={book} index={index} />
        ))}
      </div>

      {/* Call to action */}
      <div className="text-center mt-16">
        <button className="bg-gradient-to-r from-amber-700 via-orange-500 to-amber-400 px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105 group text-white">
          Explore All Books
          <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
        </button>
      </div>
    </div>
  </section>

  {/* CSS for custom animations */}
  <style jsx>{`
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(5deg); }
    }
    
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `}</style>
</div>


{/* Roadmap */}
     <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-amber-900 via-orange-900/20 to-amber-900' : 'bg-gradient-to-br from-amber-50 via-orange-50/20 to-amber-50'} text-white`}>
      <section id="roadmap" className="py-20 px-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className={`absolute top-20 left-10 w-72 h-72 ${isDarkMode ? 'bg-orange-500' : 'bg-orange-300'} rounded-full mix-blend-multiply filter blur-xl animate-pulse`}></div>
          <div className={`absolute top-40 right-10 w-72 h-72 ${isDarkMode ? 'bg-amber-500' : 'bg-amber-300'} rounded-full mix-blend-multiply filter blur-xl animate-pulse`} style={{animationDelay: '2s'}}></div>
          <div className={`absolute bottom-20 left-1/2 w-72 h-72 ${isDarkMode ? 'bg-yellow-500' : 'bg-yellow-300'} rounded-full mix-blend-multiply filter blur-xl animate-pulse`} style={{animationDelay: '4s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
              Our <GradientText>Roadmap</GradientText>
            </h2>
            <p className={`text-xl ${themeClasses.textSecondary} max-w-3xl mx-auto animate-fade-in-up`} style={{animationDelay: '0.2s'}}>
              Exciting features and improvements coming to BookSwap
            </p>
          </div>

          {/* Timeline line */}
          <div className="absolute left-1/2 md:left-40 transform -translate-x-1/2 md:translate-x-0 h-full w-px bg-gradient-to-b from-orange-500 via-amber-500 to-transparent opacity-60"></div>

          <div className="space-y-12 relative">
            {roadmapData.map((item, index) => (
              <div 
                key={index} 
                className={`transform transition-all duration-700 ${
                  visibleItems.includes(index) 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-20 opacity-0'
                }`}
                style={{transitionDelay: `${index * 100}ms`}}
              >
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
                  {/* Phase indicator */}
                  <div className="flex-shrink-0 w-32 text-center md:text-right order-2 md:order-1">
                    <div className="text-orange-400 font-bold text-lg animate-pulse">
                      {item.phase}
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div className="flex-shrink-0 relative order-1 md:order-2">
                    <div 
                      className={`w-6 h-6 rounded-full border-4 border-orange-500 transition-all duration-500 ${
                        visibleItems.includes(index) 
                          ? 'bg-orange-500 shadow-lg shadow-orange-500/50 scale-110' 
                          : 'bg-transparent'
                      }`}
                    >
                      {/* Pulse animation */}
                      {visibleItems.includes(index) && (
                        <div className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-40"></div>
                      )}
                    </div>
                  </div>

                  {/* Content card */}
                  <div 
                    className={`flex-1 ${themeClasses.cardBg} rounded-2xl p-6 border ${themeClasses.cardBorder} 
                      transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl 
                      hover:shadow-orange-500/20 hover:border-orange-500/50 cursor-pointer order-3
                      ${hoveredItem === index ? 'ring-2 ring-orange-500/30' : ''}`}
                    onMouseEnter={() => setHoveredItem(index)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl animate-bounce" style={{animationDelay: `${index * 0.5}s`}}>
                          {item.icon}
                        </span>
                        <h3 className={`text-xl font-bold ${isDarkMode ? 'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent' : 'text-gray-800'}`}>
                          {item.title}
                        </h3>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${getStatusStyle(item.status)}
                        ${hoveredItem === index ? 'scale-110' : ''}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className={`${themeClasses.textSecondary} leading-relaxed`}>
                      {item.description}
                    </p>

                    {/* Progress bar for "In Progress" items */}
                    {item.status === 'In Progress' && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                          <span>Progress</span>
                          <span>65%</span>
                        </div>
                        <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                          <div 
                            className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{
                              width: visibleItems.includes(index) ? '65%' : '0%',
                              transitionDelay: `${index * 200 + 500}ms`
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Hover effect overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-orange-500/5 to-amber-500/5 rounded-2xl 
                      transition-opacity duration-300 ${hoveredItem === index ? 'opacity-100' : 'opacity-0'}`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to action */}
          <div className={`text-center mt-16 transform transition-all duration-700 ${
            visibleItems.length === roadmapData.length 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-20 opacity-0'
          }`}>
            <div className={`bg-gradient-to-r ${isDarkMode ? 'from-orange-600/20 to-amber-600/20' : 'from-orange-100/50 to-amber-100/50'} backdrop-blur-sm rounded-2xl p-8 border ${isDarkMode ? 'border-orange-500/30' : 'border-orange-300/50'}`}>
              <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Want to influence our roadmap?
              </h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                Join our community and help shape the future of BookSwap
              </p>
              <button className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 
                px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 
                hover:shadow-lg hover:shadow-orange-500/25 text-white">
                Join the Discussion
              </button>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out forwards;
            opacity: 0;
          }
        `}</style>
      </section>
    </div>


{/* FAQ */}
      <div className={`min-h-screen ${isDarkMode ? 'bg-amber-900' : 'bg-white'}`}>
      {/* FAQ */}
      <section className={`py-20 px-4 ${isDarkMode ? 'bg-orange-800/30' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <GradientText>FAQ</GradientText>
            </h2>
            <p className={`text-xl ${themeClasses.textSecondary} max-w-3xl mx-auto`}>
              Find answers to common questions about BookSwap
            </p>
          </div>
          <div className="space-y-4">
            {[
              { q: 'How does the book exchange process work?', a: 'Simply list your books, browse available titles, and request exchanges. Our smart matching system connects you with compatible traders in your area.' },
              { q: 'Is BookSwap free to use?', a: 'Yes! BookSwap is completely free. We believe in making literature accessible to everyone without barriers.' },
              { q: 'How do you ensure book quality?', a: 'Our community-driven rating system helps maintain quality standards. Users rate both books and traders to build trust.' },
              { q: 'Can I exchange internationally?', a: 'Currently, we focus on local exchanges to reduce shipping costs and environmental impact. International features are planned for 2025.' }
            ].map((faq, index) => (
              <div 
                key={index}
                className={`
                  ${themeClasses.cardBg} backdrop-blur-xl rounded-2xl p-6 border ${themeClasses.cardBorder}
                  transform transition-all duration-500 ease-out
                  opacity-0 translate-y-10
                  animate-fade-in-up
                `}
                style={{
                  animationDelay: `${index * 100 + 200}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-bold text-orange-400 pr-4">{faq.q}</h3>
                  <ChevronDown className="h-5 w-5 text-orange-400" />
                </div>
                <div className={`mt-3 ${themeClasses.textSecondary}`}>
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
          <div 
            className={`
              mt-12 text-center
              opacity-0 translate-y-10
              animate-fade-in-up
            `}
            style={{
              animationDelay: '600ms',
              animationFillMode: 'forwards'
            }}
          >
            <p className={`${themeClasses.textSecondary} mb-6`}>
              Still have questions?
            </p>
            <a 
              href="#contact"
              className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 text-white"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
      </div>


{/* Contact */}
<section id="contact" className={`py-24 px-4 ${themeClasses.sectionBg}`}>
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-20">
      <h2 className={`text-4xl md:text-6xl font-bold mb-6 ${themeClasses.text}`}>
        Get In <GradientText>Touch</GradientText>
      </h2>
      <p className={`text-xl md:text-2xl ${themeClasses.textSecondary} max-w-3xl mx-auto`}>
        Have questions? We'd love to hear from you. Send us a message and we'll respond within 24 hours.
      </p>
    </div>

    <div className="grid lg:grid-cols-3 gap-12">
      {/* Contact Information */}
      <div className="space-y-10">
        <div className={`${themeClasses.cardBg} backdrop-blur-xl rounded-2xl p-8 border ${themeClasses.cardBorder} h-full`}>
          <h3 className={`text-2xl font-bold mb-8 ${themeClasses.text}`}>Contact Information</h3>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-500/10 text-orange-500'}`}>
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <div className={`font-semibold text-lg ${themeClasses.text}`}>Email</div>
                <a href="mailto:hello@bookswap.com" className={`${themeClasses.textSecondary} hover:text-orange-400 transition-colors`}>
                  hello@bookswap.com
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-500/10 text-amber-600'}`}>
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <div className={`font-semibold text-lg ${themeClasses.text}`}>Phone</div>
                <a href="tel:+15551234567" className={`${themeClasses.textSecondary} hover:text-orange-400 transition-colors`}>
                  +1 (555) 123-4567
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-500/10 text-yellow-600'}`}>
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <div className={`font-semibold text-lg ${themeClasses.text}`}>Address</div>
                <div className={themeClasses.textSecondary}>
                  123 Book Street<br />
                  Reading City, RC 12345
                </div>
              </div>
            </div>
          </div>

          <div className={`mt-10 pt-6 border-t ${themeClasses.cardBorder}`}>
            <h4 className={`font-semibold mb-4 ${themeClasses.text}`}>Business Hours</h4>
            <div className={`space-y-2 ${themeClasses.textSecondary}`}>
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span>9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span>10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>Closed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="lg:col-span-2">
        <div className={`${themeClasses.cardBg} backdrop-blur-xl rounded-2xl p-10 border ${themeClasses.cardBorder}`}>
          <h3 className={`text-2xl font-bold mb-8 ${themeClasses.text}`}>Send Us a Message</h3>
          
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className={`block mb-2 font-medium ${themeClasses.text}`}>
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className={`w-full ${themeClasses.inputBg} border ${themeClasses.inputBorder} rounded-xl px-4 py-3 ${themeClasses.text} placeholder-gray-500 dark:placeholder-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className={`block mb-2 font-medium ${themeClasses.text}`}>
                  Your Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className={`w-full ${themeClasses.inputBg} border ${themeClasses.inputBorder} rounded-xl px-4 py-3 ${themeClasses.text} placeholder-gray-500 dark:placeholder-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className={`block mb-2 font-medium ${themeClasses.text}`}>
                Subject
              </label>
              <input
                id="subject"
                type="text"
                placeholder="How can we help?"
                className={`w-full ${themeClasses.inputBg} border ${themeClasses.inputBorder} rounded-xl px-4 py-3 ${themeClasses.text} placeholder-gray-500 dark:placeholder-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                required
                />
            </div>

            <div>
              <label htmlFor="message" className={`block mb-2 font-medium ${themeClasses.text}`}>
                Your Message
              </label>
              <textarea
                id="message"
                rows={5}
                placeholder="Tell us about your inquiry..."
                className={`w-full ${themeClasses.inputBg} border ${themeClasses.inputBorder} rounded-xl px-4 py-3 ${themeClasses.text} placeholder-gray-500 dark:placeholder-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none`}
                required
              ></textarea>
            </div>

            <div className="flex items-center">
              <input
                id="consent"
                type="checkbox"
                className={`rounded ${themeClasses.inputBorder} text-orange-500 focus:ring-orange-500 mr-3 ${isDarkMode ? 'dark:bg-amber-700' : 'bg-white'}`}
                required
              />
              <label htmlFor="consent" className={`text-sm ${themeClasses.textSecondary}`}>
                I agree to the privacy policy and terms of service
              </label>
            </div>

            <button
              type="submit"
              className="group relative w-full bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-700 dark:to-amber-700 py-4 px-6 rounded-xl font-bold text-lg text-white hover:shadow-xl hover:shadow-orange-500/25 dark:hover:shadow-orange-400/20 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center">
                Send Message
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-orange-700 to-amber-700 dark:from-orange-800 dark:to-amber-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>

{/*/footer */}
<footer className={`py-16 px-4 ${themeClasses.footerBg} border-t ${themeClasses.footerBorder} transition-colors duration-300`}>
  <div className="max-w-7xl mx-auto">
    <div className="grid md:grid-cols-5 gap-10 mb-12">
      {/* Brand Column */}
      <div className="md:col-span-2">
        <div className="flex items-center space-x-3 mb-6">
          <BookOpen className="h-10 w-10 text-orange-500" />
          <span className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
            BookSwap
          </span>
        </div>
        <p className={`${themeClasses.textSecondary} mb-6 text-lg`}>
          Connecting book lovers worldwide through the joy of sharing literature.
        </p>
        <div className="flex space-x-4">
          {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
            <a 
              key={social} 
              href="#" 
              className={`p-2 rounded-full ${themeClasses.cardBg} ${themeClasses.cardBorder} border hover:border-orange-500 hover:text-orange-500 transition-all duration-300`}
              aria-label={`${social} link`}
            >
              {/* Replace with actual social icons or use react-icons */}
              <span className="text-lg">{social === 'twitter' ? '𝕏' : social.charAt(0).toUpperCase()}</span>
            </a>
          ))}
        </div>
      </div>
      
      {/* Platform Links */}
      <div>
        <h4 className={`text-xl font-bold mb-5 ${themeClasses.text} flex items-center`}>
          <ChevronDown className="mr-2 h-5 w-5 text-orange-400 md:hidden" />
          Platform
        </h4>
        <div className={`space-y-3 ${themeClasses.textSecondary}`}>
          {['How it Works', 'Features', 'Pricing', 'Mobile App'].map((item) => (
            <a 
              key={item} 
              href="#" 
              className="block hover:text-orange-400 transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
      
      {/* Community Links */}
      <div>
        <h4 className={`text-xl font-bold mb-5 ${themeClasses.text} flex items-center`}>
          <ChevronDown className="mr-2 h-5 w-5 text-orange-400 md:hidden" />
          Community
        </h4>
        <div className={`space-y-3 ${themeClasses.textSecondary}`}>
          {['Book Clubs', 'Reviews', 'Events', 'Blog'].map((item) => (
            <a 
              key={item} 
              href="#" 
              className="block hover:text-orange-400 transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
      
      {/* Support Links */}
      <div>
        <h4 className={`text-xl font-bold mb-5 ${themeClasses.text} flex items-center`}>
          <ChevronDown className="mr-2 h-5 w-5 text-orange-400 md:hidden" />
          Support
        </h4>
        <div className={`space-y-3 ${themeClasses.textSecondary}`}>
          {['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map((item) => (
            <a 
              key={item} 
              href="#" 
              className="block hover:text-orange-400 transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </div>
    
    {/* Newsletter Subscription */}
    <div className={`${themeClasses.cardBg} backdrop-blur-xl rounded-2xl p-8 border ${themeClasses.cardBorder} mb-12`}>
      <div className="md:flex items-center justify-between">
        <div className="md:w-1/2 mb-6 md:mb-0">
          <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
          <p className={themeClasses.textSecondary}>
            Subscribe to our newsletter for the latest book releases and community updates.
          </p>
        </div>
        <div className="md:w-1/2">
          <div className="flex">
            <input 
              type="email" 
              placeholder="Your email address" 
              className={`flex-grow ${themeClasses.inputBg} border ${themeClasses.inputBorder} rounded-l-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors`}
            />
            <button className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 rounded-r-xl font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 text-white">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
    
    {/* Copyright */}
    <div className={`border-t ${themeClasses.footerBorder} pt-8 flex flex-col md:flex-row justify-between items-center`}>
      <p className={`${themeClasses.textSecondary} mb-4 md:mb-0`}>
        &copy; 2025 BookSwap. All rights reserved. Made with <span className="text-orange-500">❤️</span> for book lovers everywhere.
      </p>
      <div className="flex space-x-6">
        <a href="#" className={themeClasses.textSecondary}>Privacy Policy</a>
        <a href="#" className={themeClasses.textSecondary}>Terms of Service</a>
        <a href="#" className={themeClasses.textSecondary}>Cookies</a>
      </div>
    </div>
  </div>
</footer>


</div>

  );
}; 

export default BookExchangeLanding;