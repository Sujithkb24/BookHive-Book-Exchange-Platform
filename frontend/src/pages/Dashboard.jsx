import React, { useState, useEffect } from 'react';
import { Search, Filter, SortDesc, ShoppingCart, Eye, Book, Home, Users, Settings, Menu, X, Star, Tag } from 'lucide-react';

const BookshopDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const [showFilters, setShowFilters] = useState(false);

  // Sample book data
  const [books] = useState([
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      price: 24.99,
      rating: 4.5,
      tags: ["Fiction", "Philosophy", "Bestseller"],
      genre: "fiction",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
      description: "A dazzling novel about all the choices that go into a life well lived."
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      price: 19.99,
      rating: 4.8,
      tags: ["Self-Help", "Productivity", "Psychology"],
      genre: "self-help",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
      description: "An easy & proven way to build good habits & break bad ones."
    },
    {
      id: 3,
      title: "Dune",
      author: "Frank Herbert",
      price: 16.99,
      rating: 4.7,
      tags: ["Sci-Fi", "Classic", "Adventure"],
      genre: "sci-fi",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
      description: "A stunning blend of adventure and mysticism, environmentalism and politics."
    },
    {
      id: 4,
      title: "The Seven Husbands of Evelyn Hugo",
      author: "Taylor Jenkins Reid",
      price: 22.50,
      rating: 4.6,
      tags: ["Romance", "Drama", "LGBTQ+"],
      genre: "romance",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop",
      description: "A reclusive Hollywood icon finally tells her story."
    },
    {
      id: 5,
      title: "Educated",
      author: "Tara Westover",
      price: 18.99,
      rating: 4.4,
      tags: ["Memoir", "Education", "Biography"],
      genre: "biography",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
      description: "A memoir that transforms from a story of survival to one of self-creation."
    },
    {
      id: 6,
      title: "The Silent Patient",
      author: "Alex Michaelides",
      price: 21.99,
      rating: 4.3,
      tags: ["Thriller", "Mystery", "Psychological"],
      genre: "thriller",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
      description: "A woman's act of violence against her husband triggers a story that refuses to be forgotten."
    }
  ]);

  const [cart, setCart] = useState([]);

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: Book, label: 'Books' },
    { icon: Users, label: 'Authors' },
    { icon: ShoppingCart, label: 'Orders' },
    { icon: Settings, label: 'Settings' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Books' },
    { value: 'fiction', label: 'Fiction' },
    { value: 'sci-fi', label: 'Sci-Fi' },
    { value: 'romance', label: 'Romance' },
    { value: 'self-help', label: 'Self-Help' },
    { value: 'biography', label: 'Biography' },
    { value: 'thriller', label: 'Thriller' }
  ];

  const sortOptions = [
    { value: 'title', label: 'Title' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Rating' }
  ];

  const filteredAndSortedBooks = books
    .filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = selectedFilter === 'all' || book.genre === selectedFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const addToCart = (book) => {
    setCart(prev => [...prev, book]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'blur-sm' : ''}`}>
        {/* Header */}
        <header className="bg-gray-800 shadow-lg">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-gray-400 hover:text-white transition-colors cursor-pointer" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                    {cart.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Search and Filter Bar */}
        <div className="p-6 bg-gray-800 border-b border-gray-700">
          <div className="flex flex-col lg:flex-row gap-4 max-w-7xl mx-auto">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search books, authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Filter and Sort */}
            <div className="flex gap-2 flex-shrink-0">
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600 transition-colors whitespace-nowrap"
                >
                  <Filter className="w-5 h-5" />
                  <span>Filter</span>
                </button>
                {showFilters && (
                  <div className="absolute top-full mt-2 right-0 bg-gray-700 border border-gray-600 rounded-lg shadow-xl z-10 min-w-48">
                    <div className="p-2">
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Genre</label>
                        {filterOptions.map(option => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSelectedFilter(option.value);
                              setShowFilters(false);
                            }}
                            className={`block w-full text-left px-3 py-2 rounded hover:bg-gray-600 transition-colors ${
                              selectedFilter === option.value ? 'bg-purple-600 text-white' : 'text-gray-300'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Sort by</label>
                        {sortOptions.map(option => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSortBy(option.value);
                              setShowFilters(false);
                            }}
                            className={`block w-full text-left px-3 py-2 rounded hover:bg-gray-600 transition-colors ${
                              sortBy === option.value ? 'bg-purple-600 text-white' : 'text-gray-300'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Book Cards Grid */}
        <main className="p-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">
                {selectedFilter === 'all' ? 'All Books' : filterOptions.find(f => f.value === selectedFilter)?.label}
              </h2>
              <p className="text-gray-400">
                {filteredAndSortedBooks.length} book{filteredAndSortedBooks.length !== 1 ? 's' : ''} found
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {filteredAndSortedBooks.map((book, index) => (
                <div
                  key={book.id}
                  className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-700 hover:border-purple-500 group"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white text-sm font-medium">{book.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-gray-400 mb-3 text-sm">by {book.author}</p>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{book.description}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {book.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="inline-flex items-center px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full border border-purple-600/30"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-400">${book.price}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => addToCart(book)}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-1"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span className="hidden sm:inline">Add</span>
                        </button>
                        <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span className="hidden sm:inline">View</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredAndSortedBooks.length === 0 && (
              <div className="text-center py-12">
                <Book className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No books found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 border-r border-gray-700 backdrop-blur-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 ">
          <div className="flex items-center space-x-2">
            <Book className="w-8 h-8 text-purple-400 flex-shrink-0" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              BookVault
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="mt-8">
          {sidebarItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 transform hover:translate-x-1 ${
                item.active ? 'bg-gray-700 text-white border-r-2 border-purple-400' : ''
              }`}
            >
              <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default BookshopDashboard;