import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Edit3,
  Trash2,
  Eye,
  DollarSign,
  Calendar,
  Package,
  Hash,
  User,
  FileText,
  Image,
  Plus,
  Search,
  Filter,
  MoreVertical,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Navbar from '../components/navbar';

const MyListedBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [actionLoading, setActionLoading] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    fetchMyBooks();
  }, []);

  useEffect(() => {
    filterAndSortBooks();
  }, [books, searchTerm, selectedCondition, sortBy]);

  const fetchMyBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/sell/getmysells', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch your books');
      }

      const data = await response.json();
      console.log('Fetched my books:', data);
      setBooks(data.allSells || []);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortBooks = () => {
    let filtered = books.filter(book => {
      const matchesSearch = book.bookName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.isbn.toString().includes(searchTerm);
      
      const matchesCondition = selectedCondition === 'all' || 
                              book.condition.toLowerCase() === selectedCondition.toLowerCase();

      return matchesSearch && matchesCondition;
    });

    // Sort books
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id);
        case 'oldest':
          return new Date(a.createdAt || a._id) - new Date(b.createdAt || b._id);
        case 'price-high':
          return b.token - a.token;
        case 'price-low':
          return a.token - b.token;
        case 'name':
          return a.bookName.localeCompare(b.bookName);
        default:
          return 0;
      }
    });

    setFilteredBooks(filtered);
  };

  const handleDeleteBook = async (bookId) => {
    try {
      setActionLoading(prev => ({ ...prev, [`delete-${bookId}`]: true }));
      
      const response = await fetch('http://localhost:3000/api/sell/deletesell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ sellId: bookId })
      });

      const data = await response.json();
      if (data.message) {
        setBooks(prev => prev.filter(book => book._id !== bookId));
        setShowDeleteModal(null);
        alert('Book deleted successfully!');
      } else {
        throw new Error(data.error || 'Failed to delete book');
      }
    } catch (err) {
      console.error('Error deleting book:', err);
      alert('Failed to delete book: ' + err.message);
    } finally {
      setActionLoading(prev => ({ ...prev, [`delete-${bookId}`]: false }));
    }
  };

  const handleImageError = (bookId, imageIndex) => {
    setImageErrors(prev => ({
      ...prev,
      [`${bookId}-${imageIndex}`]: true
    }));
  };

  const getConditionColor = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'average': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'poor': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const BookImageDisplay = ({ book }) => {
    const hasImages = book.images && book.images.length > 0;
    
    if (!hasImages) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
          <BookOpen className="h-12 w-12 text-indigo-400" />
        </div>
      );
    }

    const imageUrl = book.images[0];
    const hasError = imageErrors[`${book._id}-0`];

    if (hasError) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
          <BookOpen className="h-12 w-12 text-indigo-400" />
        </div>
      );
    }

    return (
      <div className="relative w-full h-full">
        <img
          src={imageUrl}
          alt={book.bookName}
          className="w-full h-full object-cover"
          onError={() => handleImageError(book._id, 0)}
        />
        {book.images.length > 1 && (
          <div className="absolute bottom-2 right-2">
            <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">
              +{book.images.length - 1}
            </span>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-gray-600 font-medium">Loading your books...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">My Listed Books</h1>
                <p className="text-xl text-gray-600">Manage your book listings and track performance</p>
              </div>
              <button
                onClick={() => window.location.href = '/sell-book'}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add New Book</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters and Search */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Conditions</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="average">Average</option>
                  <option value="poor">Poor</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>

              {/* Results Count */}
              <div className="flex items-center space-x-2 text-gray-600">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">{filteredBooks.length} books listed</span>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <div>
                  <h3 className="text-lg font-semibold text-red-900">Error Loading Books</h3>
                  <p className="text-red-700">{error}</p>
                  <button
                    onClick={fetchMyBooks}
                    className="mt-2 text-red-600 hover:text-red-800 font-medium"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredBooks.length === 0 && !error && (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {books.length === 0 ? 'No Books Listed Yet' : 'No Books Match Your Search'}
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {books.length === 0 
                    ? 'Start building your book collection by listing your first book for exchange.'
                    : 'Try adjusting your search terms or filters to find your books.'
                  }
                </p>
                {books.length === 0 && (
                  <button
                    onClick={() => window.location.href = '/sell-book'}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    List Your First Book
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Books Grid */}
          {filteredBooks.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredBooks.map((book) => (
                <div
                  key={book._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="md:flex">
                    {/* Book Image */}
                    <div className="md:w-48 h-64 md:h-auto bg-gray-100 relative overflow-hidden">
                      <BookImageDisplay book={book} />
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium border border-green-200">
                          <CheckCircle className="w-3 h-3 inline mr-1" />
                          Active
                        </span>
                      </div>
                    </div>

                    {/* Book Details */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">
                            {book.bookName}
                          </h3>
                          <p className="text-gray-600 mb-2">by {book.authorName}</p>
                          <div className="flex items-center space-x-4 mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getConditionColor(book.condition)}`}>
                              {book.condition}
                            </span>
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="w-4 h-4 mr-1" />
                              Listed {formatDate(book.createdAt)}
                            </div>
                          </div>
                        </div>

                        {/* Action Menu */}
                        <div className="flex space-x-2">
                          <button
                            onClick={() => window.location.href = `/book/${book._id}`}
                            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => window.location.href = `/edit-book/${book._id}`}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit Book"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setShowDeleteModal(book._id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete Book"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Book Info Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center mb-1">
                            <Hash className="w-4 h-4 text-gray-500 mr-1" />
                            <span className="text-xs font-medium text-gray-600">ISBN</span>
                          </div>
                          <p className="text-sm font-mono text-gray-900">{book.isbn}</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center mb-1">
                            <FileText className="w-4 h-4 text-gray-500 mr-1" />
                            <span className="text-xs font-medium text-gray-600">Pages</span>
                          </div>
                          <p className="text-sm text-gray-900">{book.pageCount}</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center mb-1">
                            <DollarSign className="w-4 h-4 text-gray-500 mr-1" />
                            <span className="text-xs font-medium text-gray-600">Price</span>
                          </div>
                          <p className="text-lg font-bold text-indigo-600">{book.token} tokens</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center mb-1">
                            <Image className="w-4 h-4 text-gray-500 mr-1" />
                            <span className="text-xs font-medium text-gray-600">Images</span>
                          </div>
                          <p className="text-sm text-gray-900">
                            {book.images?.length || 0} photo{(book.images?.length || 0) !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      {book.description && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
                          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                            {book.description}
                          </p>
                        </div>
                      )}

                      {/* Stats Row */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            <span>0 views</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>Active for {Math.floor((new Date() - new Date(book.createdAt || book._id)) / (1000 * 60 * 60 * 24))} days</span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => window.location.href = `/book/${book._id}`}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all duration-300 flex items-center space-x-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Listing</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Book Listing</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this book listing? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteBook(showDeleteModal)}
                    disabled={actionLoading[`delete-${showDeleteModal}`]}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {actionLoading[`delete-${showDeleteModal}`] ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Delete'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MyListedBooksPage;