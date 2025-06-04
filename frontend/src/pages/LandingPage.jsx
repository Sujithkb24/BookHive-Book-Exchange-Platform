import React, { useState, useEffect } from 'react';
import { ChevronDown, BookOpen, Users, Star, ArrowRight, Menu, X, Check, Mail, Phone, MapPin } from 'lucide-react';

const BookExchangeLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const AnimatedCard = ({ children, delay = 0 }) => (
    <div 
      className="transform transition-all duration-700 hover:scale-105 hover:-translate-y-2"
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );

  const GradientText = ({ children, className = "" }) => (
    <span className={`bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-gray-900/80 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img src='/favicon.png' className='w-[50px] h-[50px]'></img>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                BookHive
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {['Home', 'About', 'Features', 'Store', 'Roadmap', 'Contact'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-300 font-medium"
                >
                  {item}
                </a>
              ))}
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
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
        <div className="fixed inset-0 z-40 bg-gray-900/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            {['Home', 'About', 'Features', 'Store', 'Roadmap', 'Contact'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-2xl font-semibold text-gray-300 hover:text-purple-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900 to-pink-900/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              Exchange Books,
              <br />
              <GradientText className="text-6xl md:text-8xl">Expand Minds</GradientText>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto font-light">
              Join the revolutionary platform where book lovers connect, trade, and discover their next favorite read. 
              Transform your bookshelf into a gateway to endless literary adventures.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button className="group bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
              Start Trading Books
              <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 rounded-full border-2 border-gray-600 hover:border-purple-400 font-semibold transition-all duration-300 hover:bg-purple-500/10">
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
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
                  <stat.icon className="h-8 w-8 text-purple-400 mb-4 mx-auto" />
                  <div className="text-3xl font-bold mb-2">{stat.number}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-gray-400" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              About <GradientText>BookSwap</GradientText>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Born from a passion for literature and community, BookSwap revolutionizes how book enthusiasts 
              discover, share, and enjoy their favorite reads.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-300 text-lg">
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
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-400" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl p-8 backdrop-blur-xl border border-gray-700">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { title: 'Founded', value: '2023' },
                    { title: 'Countries', value: '25+' },
                    { title: 'Genres', value: '500+' },
                    { title: 'Communities', value: '100+' }
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{stat.value}</div>
                      <div className="text-gray-400">{stat.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Powerful <GradientText>Features</GradientText>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to trade, discover, and enjoy books in one seamless platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Smart Matching',
                description: 'AI-powered algorithm matches you with readers who have books you want and want books you have.',
                icon: '🤖',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                title: 'Local Communities',
                description: 'Connect with book lovers in your area for easy exchanges and book club discussions.',
                icon: '🏘️',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                title: 'Digital Library',
                description: 'Keep track of your collection, wishlist, and reading history all in one place.',
                icon: '📚',
                gradient: 'from-green-500 to-emerald-500'
              },
              {
                title: 'Rating System',
                description: 'Rate books and traders to help build a trustworthy community ecosystem.',
                icon: '⭐',
                gradient: 'from-yellow-500 to-orange-500'
              },
              {
                title: 'Secure Exchanges',
                description: 'Built-in escrow system ensures safe and fair book exchanges every time.',
                icon: '🔒',
                gradient: 'from-red-500 to-pink-500'
              },
              {
                title: 'Mobile App',
                description: 'Take your book trading on the go with our intuitive mobile application.',
                icon: '📱',
                gradient: 'from-indigo-500 to-purple-500'
              }
            ].map((feature, index) => (
              <AnimatedCard key={index} delay={index * 100}>
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 h-full">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-2xl mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
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
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="text-4xl mr-4">{testimonial.avatar}</div>
                    <div>
                      <div className="font-bold">{testimonial.name}</div>
                      <div className="text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">"{testimonial.quote}"</p>
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Book Store Section */}
      <section id="store" className="py-20 px-4 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Featured <GradientText>Books</GradientText>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover trending books available for exchange in our community
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { title: 'The Midnight Library', author: 'Matt Haig', genre: 'Fiction', exchanges: 156 },
              { title: 'Atomic Habits', author: 'James Clear', genre: 'Self-Help', exchanges: 243 },
              { title: 'Dune', author: 'Frank Herbert', genre: 'Sci-Fi', exchanges: 189 },
              { title: 'The Seven Moons', author: 'Alex Rivera', genre: 'Fantasy', exchanges: 78 }
            ].map((book, index) => (
              <AnimatedCard key={index} delay={index * 150}>
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
                  <div className="h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl mb-4 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-purple-400" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{book.title}</h3>
                  <p className="text-gray-300 mb-2">by {book.author}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-400">{book.genre}</span>
                    <span className="text-sm text-gray-400">{book.exchanges} exchanges</span>
                  </div>
                  <button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-300">
                    View Details
                  </button>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Our <GradientText>Roadmap</GradientText>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Exciting features and improvements coming to BookSwap
            </p>
          </div>

          <div className="space-y-12">
            {[
              { phase: 'Q2 2025', title: 'AI Recommendation Engine', status: 'In Progress', description: 'Advanced ML algorithms for personalized book recommendations' },
              { phase: 'Q3 2025', title: 'Virtual Book Clubs', status: 'Planned', description: 'Host and join virtual reading sessions with community members' },
              { phase: 'Q4 2025', title: 'Global Marketplace', status: 'Planned', description: 'Expand to international book exchanges and rare book trading' },
              { phase: 'Q1 2026', title: 'AR Book Preview', status: 'Research', description: 'Augmented reality features for previewing books before exchange' }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-8">
                <div className="flex-shrink-0 w-32 text-right">
                  <div className="text-purple-400 font-bold">{item.phase}</div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                </div>
                <div className="flex-1 bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      item.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400' :
                      item.status === 'Planned' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-gray-300">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-gray-800/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <GradientText>FAQ</GradientText>
            </h2>
          </div>

          <div className="space-y-6">
            {[
              { q: 'How does the book exchange process work?', a: 'Simply list your books, browse available titles, and request exchanges. Our smart matching system connects you with compatible traders in your area.' },
              { q: 'Is BookSwap free to use?', a: 'Yes! BookSwap is completely free. We believe in making literature accessible to everyone without barriers.' },
              { q: 'How do you ensure book quality?', a: 'Our community-driven rating system helps maintain quality standards. Users rate both books and traders to build trust.' },
              { q: 'Can I exchange internationally?', a: 'Currently, we focus on local exchanges to reduce shipping costs and environmental impact. International features are planned for 2025.' }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-3 text-purple-400">{faq.q}</h3>
                <p className="text-gray-300">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Get In <GradientText>Touch</GradientText>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <Mail className="h-6 w-6 text-purple-400" />
                <div>
                  <div className="font-semibold">Email</div>
                  <div className="text-gray-300">hello@bookswap.com</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Phone className="h-6 w-6 text-purple-400" />
                <div>
                  <div className="font-semibold">Phone</div>
                  <div className="text-gray-300">+1 (555) 123-4567</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <MapPin className="h-6 w-6 text-purple-400" />
                <div>
                  <div className="font-semibold">Address</div>
                  <div className="text-gray-300">123 Book Street, Reading City, RC 12345</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700">
              <div className="space-y-6">
                <div>
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    placeholder="Your Email" 
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <textarea 
                    rows={4}
                    placeholder="Your Message" 
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                  ></textarea>
                </div>
                <button 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                  onClick={() => alert('Message sent! We\'ll get back to you soon.')}
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-8 w-8 text-purple-500" />
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  BookSwap
                </span>
              </div>
              <p className="text-gray-400">
                Connecting book lovers worldwide through the joy of sharing literature.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <div className="space-y-2 text-gray-400">
                <div>How it Works</div>
                <div>Features</div>
                <div>Pricing</div>
                <div>Mobile App</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <div className="space-y-2 text-gray-400">
                <div>Book Clubs</div>
                <div>Reviews</div>
                <div>Events</div>
                <div>Blog</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-gray-400">
                <div>Help Center</div>
                <div>Contact Us</div>
                <div>Privacy Policy</div>
                <div>Terms of Service</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 BookSwap. All rights reserved. Made with ❤️ for book lovers everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BookExchangeLanding;