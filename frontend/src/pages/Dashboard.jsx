import React, { useState, useEffect } from 'react';
import { BookOpen, Eye, Search, Filter } from 'lucide-react';
import Navbar from '../components/navbar';
import { useNavigate } from 'react-router-dom';

const BooksDashboard = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const navigate = useNavigate(); // Assuming you're using react-router for navigation

  // Fetch books from backend
  const backendapi = 'http://localhost:3000'; // Adjust based on your environment
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming auth token is stored in localStorage
        const response = await fetch(`${backendapi}/api/sell/getallsells`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }

        const data = await response.json();
        console.log('Fetched books:', data);
        setBooks(data.allSells || []);
        setFilteredBooks(data.allSells || []);
      } catch (err) {
        setError(err.message);
        setBooks([]);
        setFilteredBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = books.filter(book =>
      book.bookName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.authorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [searchTerm, books]);

  const handleViewBook = (bookId) => {
    console.log(`Viewing book with ID: ${bookId}`);
    // Navigate to book details page or open modal
    navigate(`/book/${bookId}`); // Assuming you have a route set up for book details
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'Good': return 'bg-green-100 text-green-800';
      case 'Average': return 'bg-blue-100 text-blue-800';
      case 'Bad': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
      

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search books or authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">{filteredBooks.length} books available</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-500">Try adjusting your search terms or check back later for new arrivals.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book._id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200 transform hover:-translate-y-1"
              >
                {/* Book Cover Placeholder */}
                <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
                  <BookOpen className="h-16 w-16 text-indigo-400 relative z-10" />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(book.condition)}`}>
                      {book.condition}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {book.bookName}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">by {book.authorName}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>{book.pageCount} pages</span>
                    <span>ISBN: {book.isbn}</span>
                  </div>

                  {book.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {book.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <span className="text-lg font-bold text-indigo-600">{book.token}</span>
                      <span className="text-sm text-gray-500">tokens</span>
                    </div>
                    <button
                      onClick={() => handleViewBook(book._id)}
                      className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors group-hover:bg-indigo-700"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default BooksDashboard;