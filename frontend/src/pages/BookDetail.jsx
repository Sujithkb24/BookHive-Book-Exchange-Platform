import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Star, User, BookOpen, Hash, DollarSign, Package, CheckCircle } from 'lucide-react';
import Navbar from '../components/navbar';
import { useParams } from 'react-router-dom';

const BookDetailsPage = () => {
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageError, setImageError] = useState({});

  // For demo purposes - in real app, get from useParams()
  const bookIdToUse = useParams().bookId// Replace with actual book ID or use a default for testing
  console.log('Book ID:', bookIdToUse);

  // Fallback images for when no images are available
  const fallbackImages = [
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop"
  ];

  useEffect(() => {
    fetchBookDetails();
  }, [bookIdToUse]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/sell/getsellbyid/${bookIdToUse}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setBookData(data);
    } catch (err) {
      console.error('Error fetching book details:', err);
      setError('Failed to fetch book details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);

    const response = await fetch(`http://localhost:3000/api/auth/addtocart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ bookId: bookIdToUse })
    });
    
    const data = await response.json();
    console.log('Book added to cart:', data);
    if(!data.success) {
      alert(data.message);
      setIsAddingToCart(false);
    } else {
      alert('Book added to cart successfully!');
      setIsAddingToCart(false);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleImageError = (index) => {
    setImageError(prev => ({
      ...prev,
      [index]: true
    }));
  };

  const getConditionColor = (condition) => {
    switch(condition?.toLowerCase()) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'average': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Get images to display (book images or fallback)
  const getDisplayImages = () => {
    if (!bookData?.sell) return fallbackImages;
    
    const bookImages = bookData.sell.images;
    if (!bookImages || bookImages.length === 0) {
      return fallbackImages;
    }
    
    return bookImages;
  };

  const displayImages = getDisplayImages();
  const hasBookImages = bookData?.sell?.images && bookData.sell.images.length > 0;

  // Fallback component for broken images
  const ImageFallback = ({ alt, className }) => (
    <div className={`${className} bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center`}>
      <div className="text-center">
        <BookOpen className="h-16 w-16 text-indigo-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500">{alt}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const { sell, sellerName } = bookData;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="lg:flex">
            {/* Image Gallery */}
            <div className="lg:w-1/2 p-8">
              <div className="space-y-4">
                {/* Main Image */}
                <div className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden relative">
                  {imageError[selectedImage] ? (
                    <ImageFallback 
                      alt={sell.bookName} 
                      className="w-full h-full"
                    />
                  ) : (
                    <img
                      src={displayImages[selectedImage]}
                      alt={sell.bookName}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={() => handleImageError(selectedImage)}
                    />
                  )}
                  
                  {/* Image type indicator */}
                  {!hasBookImages && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                        Sample Image
                      </span>
                    </div>
                  )}
                  
                  {/* Image count */}
                  <div className="absolute bottom-3 right-3">
                    <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                      {selectedImage + 1} / {displayImages.length}
                    </span>
                  </div>
                </div>

                {/* Thumbnail Images */}
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {displayImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        selectedImage === index 
                          ? 'border-blue-600 ring-2 ring-blue-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {imageError[index] ? (
                        <ImageFallback 
                          alt={`${sell.bookName} ${index + 1}`} 
                          className="w-full h-full"
                        />
                      ) : (
                        <img 
                          src={img} 
                          alt={`${sell.bookName} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={() => handleImageError(index)}
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Image Info */}
                <div className="text-center">
                  {hasBookImages ? (
                    <p className="text-sm text-green-600 font-medium">
                      ✓ Actual book images uploaded by seller
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      📷 No images uploaded - showing sample book images
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Book Details */}
            <div className="lg:w-1/2 p-8">
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{sell.bookName}</h1>
                  <p className="text-xl text-gray-600 mb-4">by {sell.authorName}</p>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center">
                      {/* Rating stars or other info can go here */}
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-bold text-blue-600">{sell.token} Tokens</span>
                      <p className="text-sm text-gray-600 mt-1">Exchange tokens for books</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-blue-600" />
                  </div>
                </div>

                {/* Book Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Hash className="h-5 w-5 text-gray-600 mr-2" />
                      <span className="font-semibold text-gray-700">ISBN</span>
                    </div>
                    <p className="text-gray-900">{sell.isbn}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <BookOpen className="h-5 w-5 text-gray-600 mr-2" />
                      <span className="font-semibold text-gray-700">Pages</span>
                    </div>
                    <p className="text-gray-900">{sell.pageCount}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Package className="h-5 w-5 text-gray-600 mr-2" />
                      <span className="font-semibold text-gray-700">Condition</span>
                    </div>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(sell.condition)}`}>
                      {sell.condition}
                    </span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <User className="h-5 w-5 text-gray-600 mr-2" />
                      <span className="font-semibold text-gray-700">Seller</span>
                    </div>
                    <p className="text-gray-900">{sellerName}</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{sell.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleAddToCart}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                      addedToCart
                        ? 'bg-green-600 hover:bg-green-700'
                        : isAddingToCart
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95'
                    } shadow-lg hover:shadow-xl`}
                  >
                    <div className="flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      {isAddingToCart ? 'Adding to Cart...' : 'Add to Cart'}
                    </div>
                  </button>
                  
                  <button
                    onClick={toggleFavorite}
                    className={`w-full py-3 px-6 rounded-xl font-medium border-2 transition-all duration-300 ${
                      isFavorite
                        ? 'border-red-500 text-red-500 bg-red-50'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <Heart className={`h-5 w-5 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                      {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </div>
                  </button>
                </div>

                {/* Additional Info */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-800 mb-2">📚 Book Exchange Info</h4>
                  <p className="text-amber-700 text-sm">
                    This book is available through our token exchange system. Use your earned tokens to get this book!
                  </p>
                </div>

                {/* Image Upload Info */}
                {hasBookImages && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">📸 Verified Images</h4>
                    <p className="text-green-700 text-sm">
                      This seller has uploaded {sell.images.length} actual photo{sell.images.length > 1 ? 's' : ''} of the book.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;