import React, { useRef, useEffect, useState } from 'react';
import { BookOpen, Eye, Search, Filter } from 'lucide-react';
import Navbar from '../components/navbar';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
    import { gsap } from 'gsap';
const BooksDashboard = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const navigate = useNavigate();

 


  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonRef = useRef(null);

 useEffect(() => {
  const elements = [
    titleRef.current,
    subtitleRef.current,
    descriptionRef.current,
    buttonRef.current
  ].filter(el => el !== null); // Filter out nulls

  if (elements.length > 0) {
    gsap.fromTo(
      elements,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
      }
    );
  }
}, []);
  // Fetch books from backend
  const backendapi = 'http://localhost:3000';
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem('token');
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
    navigate(`/book/${bookId}`);
  };

  const handleImageError = (bookId) => {
    setImageErrors(prev => ({
      ...prev,
      [bookId]: true
    }));
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Good': return 'bg-blue-100 text-blue-800';
      case 'Average': return 'bg-yellow-100 text-yellow-800';
      case 'Poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const BookCoverImage = ({ book }) => {
    const hasImages = book.images && book.images.length > 0;
    const imageUrl = hasImages ? book.images[0] : null;
    const hasImageError = imageErrors[book._id];

    if (!hasImages || hasImageError) {
      // Fallback to gradient background with book icon
      return (
        <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
          <BookOpen className="h-16 w-16 text-indigo-400 relative z-10" />
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(book.condition)}`}>
              {book.condition}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="h-48 relative overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={book.bookName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => handleImageError(book._id)}
          loading="lazy"
        />
        {/* Overlay for condition badge */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(book.condition)} backdrop-blur-sm bg-white/80`}>
            {book.condition}
          </span>
        </div>
        {/* Image count indicator if multiple images */}
        {book.images.length > 1 && (
          <div className="absolute bottom-3 left-3">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-black/50 text-white backdrop-blur-sm">
              +{book.images.length - 1} more
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
      
    <div className="min-h-[600px] bg-gradient-to-br from-amber-50 to-orange-100 flex items-center  px-8">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        
       
        <div className="flex justify-center">
          <div className="h-[500px] w-[1000px]">
           
            <DotLottieReact
      src="https://lottie.host/04299fbe-6092-47c1-8c2d-9a18274a0533/frsbwlwKN6.lottie"
      loop
      autoplay
    />
          </div>
        </div>

      
        <div className="space-y-6">
          <h1 
            ref={titleRef}
            className="text-5xl lg:text-6xl font-bold text-amber-900 transition-all duration-1000 ease-out"
          >
            Your next story 
            <span className="block text-orange-700">starts here</span>
          </h1>
          
          <h2 
            ref={subtitleRef}
            className="text-2xl text-amber-700 font-medium transition-all duration-1000 ease-out"
          >
           A smarter way to Share Books
          </h2>
          
          <p 
            ref={descriptionRef}
            className="text-lg text-amber-800/80 leading-relaxed transition-all duration-1000 ease-out"
          >
            Set your stories free. By listing your book, you’re giving someone else the opportunity to explore, learn, and be inspired
          </p>
          
          <div 
            ref={buttonRef}
            className="pt-4 transition-all duration-1000 ease-out"
          >
            <button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              Add your Book
            </button>
          </div>
        </div>
      </div>
    </div>
     



        {/* Main Content */}
        <div className=" mx-auto px-4 bg-orange-100 sm:px-6 lg:px-8 py-8">
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                />
              </div>
              <div className="flex items-center space-x-2 text-gray-600 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">{filteredBooks.length} books available</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
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
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200 transform hover:-translate-y-2"
                >
                  {/* Book Cover */}
                  <BookCoverImage book={book} />

                  {/* Card Content */}
                  <div className="p-5">
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors mb-1">
                        {book.bookName}
                      </h3>
                      <p className="text-sm text-gray-600">by {book.authorName}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span className="bg-gray-100 px-2 py-1 rounded-full">{book.pageCount} pages</span>
                      <span className="bg-gray-100 px-2 py-1 rounded-full">ISBN: {book.isbn}</span>
                    </div>

                    {book.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {book.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <span className="text-2xl font-bold text-indigo-600">{book.token}</span>
                        <span className="text-sm text-gray-500">tokens</span>
                      </div>
                      <button
                        onClick={() => handleViewBook(book._id)}
                        className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
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