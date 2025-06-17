import React, { useState, createContext, useContext, useMemo } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, CreditCard, Search, Filter, Menu, X, ChevronDown, Star } from 'lucide-react';

// Cart Context
const CartContext = createContext();

// Cart Provider Component
const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (book) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === book.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...book, quantity: 1 }];
    });
  };

  const removeFromCart = (bookId) => {
    setCart(prev => prev.filter(item => item.id !== bookId));
  };

  const updateQuantity = (bookId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(bookId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === bookId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      getTotalPrice,
      getTotalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Enhanced sample book data
const sampleBooks = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 15.99,
    rating: 4.5,
    genre: "Fiction",
    tags: ["Classic", "American Literature"],
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop&crop=center",
    description: "A classic American novel about the Jazz Age",
    publishYear: 1925,
    pages: 180
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 12.99,
    rating: 4.8,
    genre: "Fiction",
    tags: ["Classic", "Social Issues"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop&crop=center",
    description: "A gripping tale of racial injustice and childhood innocence",
    publishYear: 1960,
    pages: 281
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    price: 13.99,
    rating: 4.7,
    genre: "Science Fiction",
    tags: ["Dystopian", "Political"],
    image: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=200&h=300&fit=crop&crop=center",
    description: "A dystopian social science fiction novel",
    publishYear: 1949,
    pages: 328
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    price: 14.99,
    rating: 4.6,
    genre: "Romance",
    tags: ["Classic", "Romance"],
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop&crop=center",
    description: "A romantic novel of manners",
    publishYear: 1813,
    pages: 432
  },
  {
    id: 5,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    price: 16.99,
    rating: 4.2,
    genre: "Fiction",
    tags: ["Coming of Age", "American Literature"],
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=300&fit=crop&crop=center",
    description: "A controversial novel about teenage rebellion",
    publishYear: 1951,
    pages: 277
  },
  {
    id: 6,
    title: "Dune",
    author: "Frank Herbert",
    price: 18.99,
    rating: 4.9,
    genre: "Science Fiction",
    tags: ["Epic", "Space Opera"],
    image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=200&h=300&fit=crop&crop=center",
    description: "A science fiction masterpiece about desert planets",
    publishYear: 1965,
    pages: 688
  }
];

// Sidebar Component
const Sidebar = ({ isOpen, onClose, filters, onFiltersChange, onClearFilters }) => {
  const genres = [...new Set(sampleBooks.map(book => book.genre))];
  const authors = [...new Set(sampleBooks.map(book => book.author))];
  const priceRanges = [
    { label: "Under $15", min: 0, max: 15 },
    { label: "$15 - $20", min: 15, max: 20 },
    { label: "Over $20", min: 20, max: 1000 }
  ];

  const handleGenreChange = (genre) => {
    const newGenres = filters.genres.includes(genre)
      ? filters.genres.filter(g => g !== genre)
      : [...filters.genres, genre];
    onFiltersChange({ ...filters, genres: newGenres });
  };

  const handleAuthorChange = (author) => {
    const newAuthors = filters.authors.includes(author)
      ? filters.authors.filter(a => a !== author)
      : [...filters.authors, author];
    onFiltersChange({ ...filters, authors: newAuthors });
  };

  const handlePriceRangeChange = (range) => {
    onFiltersChange({ ...filters, priceRange: range });
  };

  const handleRatingChange = (rating) => {
    onFiltersChange({ ...filters, minRating: rating });
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-gray-800 z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:translate-x-0 lg:w-64`}>
        <div className="p-6 h-full overflow-y-auto">
            <div className="flex items-center space-x-3">
          <img
            src="/favicon.png"
            alt="Logo"
            className="w-8 h-8 rounded-full shadow"
          />
          <span className="text-white text-xl font-semibold tracking-wide">
            BookHive
          </span>
        </div>
             <nav className="mt-6 mb-7 space-y-7">
      <a href="/home" className="block text-gray-300 hover:text-white transition">🏠 Home</a>
      <a href="/about" className="block text-gray-300 hover:text-white transition">ℹ️ About</a>
      <a href="/services" className="block text-gray-300 hover:text-white transition">🛠 Services</a>
      <a href="/contact" className="block text-gray-300 hover:text-white transition">📞 Contact</a>
    </nav>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </h2>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Clear Filters */}
          <button
            onClick={onClearFilters}
            className="w-full mb-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            Clear All Filters
          </button>

          {/* Genre Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Genre</h3>
            {genres.map(genre => (
              <label key={genre} className="flex items-center mb-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.genres.includes(genre)}
                  onChange={() => handleGenreChange(genre)}
                  className="mr-3 w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                />
                <span className="text-gray-300">{genre}</span>
              </label>
            ))}
          </div>

          {/* Author Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Author</h3>
            {authors.map(author => (
              <label key={author} className="flex items-center mb-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.authors.includes(author)}
                  onChange={() => handleAuthorChange(author)}
                  className="mr-3 w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                />
                <span className="text-gray-300 text-sm">{author}</span>
              </label>
            ))}
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Price Range</h3>
            {priceRanges.map((range, index) => (
              <label key={index} className="flex items-center mb-2 cursor-pointer">
                <input
                  type="radio"
                  name="priceRange"
                  checked={filters.priceRange?.label === range.label}
                  onChange={() => handlePriceRangeChange(range)}
                  className="mr-3 w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 focus:ring-purple-500"
                />
                <span className="text-gray-300">{range.label}</span>
              </label>
            ))}
          </div>

          {/* Rating Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Minimum Rating</h3>
            {[4, 4.5, 4.8].map(rating => (
              <label key={rating} className="flex items-center mb-2 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.minRating === rating}
                  onChange={() => handleRatingChange(rating)}
                  className="mr-3 w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 focus:ring-purple-500"
                />
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-gray-300">{rating}+ Stars</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

// Dashboard Component
const Dashboard = ({ onNavigateToCart }) => {
  const { addToCart, getTotalItems } = useCart();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filters, setFilters] = useState({
    genres: [],
    authors: [],
    priceRange: null,
    minRating: null
  });
const BOOKS_PER_PAGE = 3;
  const [currentPage, setCurrentPage] = useState(1);


  // Filter and sort books
  const filteredAndSortedBooks = useMemo(() => {
    let filtered = sampleBooks.filter(book => {
      // Search filter
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           book.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Genre filter
      const matchesGenre = filters.genres.length === 0 || filters.genres.includes(book.genre);
      
      // Author filter
      const matchesAuthor = filters.authors.length === 0 || filters.authors.includes(book.author);
      
      // Price range filter
      const matchesPrice = !filters.priceRange || 
                          (book.price >= filters.priceRange.min && book.price <= filters.priceRange.max);
      
      // Rating filter
      const matchesRating = !filters.minRating || book.rating >= filters.minRating;

      return matchesSearch && matchesGenre && matchesAuthor && matchesPrice && matchesRating;
    });

    // Sort books
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'title' || sortBy === 'author') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [searchQuery, filters, sortBy, sortOrder]);

  const clearFilters = () => {
    setFilters({
      genres: [],
      authors: [],
      priceRange: null,
      minRating: null
    });
    setSearchQuery('');
  };

  const sortOptions = [
    { value: 'title', label: 'Title' },
    { value: 'author', label: 'Author' },
    { value: 'price', label: 'Price' },
    { value: 'rating', label: 'Rating' },
    { value: 'publishYear', label: 'Year' }
  ];
  
// Calculate total pages
const totalPages = Math.ceil(filteredAndSortedBooks.length / BOOKS_PER_PAGE);

// Get books to show on the current page
const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
const endIndex = startIndex + BOOKS_PER_PAGE;
const currentBooks = filteredAndSortedBooks.slice(startIndex, endIndex);

// Handler
const handlePageChange = (pageNumber) => {
  setCurrentPage(pageNumber);
};

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
      />

      {/* Main Content */}
      <div className="flex-1 min-h-screen">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden bg-gray-700 hover:bg-gray-600 p-2 rounded-lg mr-4 transition-colors duration-200"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-3xl font-bold">Store</h1>
            </div>
            <button
              onClick={onNavigateToCart}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Cart ({getTotalItems()})</span>
            </button>
          </div>

          {/* Search and Sort Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search books, authors, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Sort Controls */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    Sort by {option.label}
                  </option>
                ))}
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors duration-200 flex items-center"
              >
                <ChevronDown className={`w-4 h-4 transform transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                <span className="ml-1">{sortOrder === 'asc' ? 'A-Z' : 'Z-A'}</span>
              </button>
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-6 text-gray-400">
            Showing {filteredAndSortedBooks.length} of {sampleBooks.length} books
          </div>
        {/* Books Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {currentBooks.map((book) => (
    <div key={book.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          {/* Books Grid */}
          <div>
            
              <div key={book.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
                  <p className="text-gray-400 mb-2">by {book.author}</p>
                  
                  {/* Rating and Year */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm text-gray-300">{book.rating}</span>
                    </div>
                    <span className="text-sm text-gray-400">{book.publishYear}</span>
                  </div>

                  {/* Genre and Tags */}
                  <div className="mb-3">
                    <span className="inline-block px-2 py-1 bg-purple-600 text-xs rounded-full mr-2">
                      {book.genre}
                    </span>
                    {book.tags.map((tag, index) => (
                      <span key={index} className="inline-block px-2 py-1 bg-gray-700 text-xs rounded-full mr-1 mb-1">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-gray-300 text-sm mb-4">{book.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-purple-400">${book.price}</span>
                    <button
                      onClick={() => addToCart(book)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-1"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span className="hidden sm:inline">Add</span>
                    </button>
                  </div>
                </div>
              </div>
            
          </div>
           </div>
  ))}
  {/* Pagination */}

<div className="mt-8 flex justify-center items-center space-x-4">
  <button
    disabled={currentPage === 1}
    onClick={() => handlePageChange(currentPage - 1)}
    className="px-3 py-2 bg-gray-700 text-gray-300 rounded-md disabled:opacity-50"
  >
    Previous
  </button>

  {/* Page Numbers */}
  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
    <button
      key={page}
      onClick={() => handlePageChange(page)}
      className={`px-4 py-2 rounded-md ${
        currentPage === page
          ? "bg-purple-600 text-white"
          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
      }`}
    >
      {page}
    </button>
  ))}

  <button
    disabled={currentPage === totalPages}
    onClick={() => handlePageChange(currentPage + 1)}
    className="px-3 py-2 bg-gray-700 text-gray-300 rounded-md disabled:opacity-50"
  >
    Next
  </button>
</div>
</div>

          {/* No Results */}
          {filteredAndSortedBooks.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <Search className="w-16 h-16 mx-auto mb-4" />
              </div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No books found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
              <button
                onClick={clearFilters}
                className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Cart Page Component (unchanged)
const CartPage = ({ onNavigateBack }) => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <button
              onClick={onNavigateBack}
              className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg mr-4 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">Add some books to get started!</p>
            <button
              onClick={onNavigateBack}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-colors duration-200"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onNavigateBack}
            className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg mr-4 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
        </div>

        {/* Cart Items */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-700 last:border-b-0">
              <img
                src={item.image}
                alt={item.title}
                className="w-20 h-28 object-cover rounded-lg"
              />
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-gray-400">by {item.author}</p>
                <div className="flex items-center mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-sm text-gray-300">{item.rating}</span>
                </div>
                <p className="text-purple-400 font-bold">${item.price}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="bg-gray-700 hover:bg-gray-600 p-1 rounded transition-colors duration-200"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="bg-gray-700 hover:bg-gray-600 p-1 rounded transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Subtotal */}
              <div className="text-right">
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Total: ${getTotalPrice().toFixed(2)}</h2>
            <p className="text-gray-400">
              {cart.reduce((total, item) => total + item.quantity, 0)} items
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onNavigateBack}
              className="flex-1 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg transition-colors duration-200 text-center"
            >
              Continue Shopping
            </button>
            <button
              className="flex-1 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              onClick={() => alert('Proceeding to checkout... (Demo)')}
            >
              <CreditCard className="w-5 h-5" />
              <span>Proceed to Buy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const DashApp = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const navigateToCart = () => setCurrentPage('cart');
  const navigateBack = () => setCurrentPage('dashboard');

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-900">
        {currentPage === 'dashboard' ? (
          <Dashboard onNavigateToCart={navigateToCart} />
        ) : (
          <CartPage onNavigateBack={navigateBack} />
        )}
      </div>
    </CartProvider>
  );
};

export default DashApp;