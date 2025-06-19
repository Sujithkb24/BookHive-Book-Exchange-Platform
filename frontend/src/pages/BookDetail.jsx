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

  const { bookId } = useParams(); // Get bookId from URL parameters
  console.log('Book ID from URL:', bookId); // Debugging line to check bookId

  // Get bookId from URL parameters
  const bookImages = [
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop"
  ];

  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchBookDetails();
  }, [bookId]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/sell/getsellbyid/${bookId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token is stored in localStorage    
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
    
    // Simulate API call
    

    const response = await fetch(`http://localhost:3000/api/auth/addtocart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token is stored in localStorage
        },
        body: JSON.stringify({ bookId })
    });
    
    const data = await response.json();
    console.log('Book added to cart:', data);
    if(!data.success) {
      alert(data.message);
      setIsAddingToCart(false);
      
    }
    else{
      alert('Book added to cart successfully!');
      setIsAddingToCart(false);
    }

  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const getConditionColor = (condition) => {
    switch(condition.toLowerCase()) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

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
                <div className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden">
                  <img
                    src={bookImages[selectedImage]}
                    alt={sell.bookName}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="flex space-x-2">
                  {bookImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-24 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        selectedImage === index ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
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
                      Add to cart
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;