import React, { useState, useEffect } from 'react';
import { ShoppingCart, BookOpen, Hash, DollarSign, CheckCircle, Trash2, Package, X } from 'lucide-react';
import Navbar from '../components/navbar';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Footer1 from '../ui/footer';
const SuccessAnimation = ({ isVisible, onClose, bookTitle = "Book" }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 text-center transform animate-in zoom-in-95 duration-500 slide-in-from-bottom-4">
        {/* Success Icon */}
        <div className="mx-auto mb-6 relative">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto animate-in zoom-in duration-700 delay-200">
            <CheckCircle 
              className="w-10 h-10 text-white animate-in zoom-in duration-500 delay-500" 
              strokeWidth={3}
            />
          </div>
          {/* Pulse rings */}
          <div className="absolute inset-0 w-20 h-20 bg-green-400 rounded-full opacity-30 animate-ping"></div>
          <div className="absolute inset-0 w-20 h-20 bg-green-400 rounded-full opacity-20 animate-ping delay-75"></div>
        </div>

        {/* Success Content */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-800 animate-in slide-in-from-bottom-2 duration-500 delay-300">
            Order Placed! 🎉
          </h3>
          <p className="text-gray-600 animate-in slide-in-from-bottom-2 duration-500 delay-400">
            Your order for <span className="font-semibold text-green-600">"{bookTitle}"</span> has been successfully placed.
          </p>
        </div>

        {/* Decorative elements */}
        <div className="flex justify-center mt-6 space-x-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-in slide-in-from-bottom-2 duration-500 delay-500"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};



const CartPage = () => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderingItems, setOrderingItems] = useState(new Set());
  const [orderedItems, setOrderedItems] = useState(new Set());
   const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [currentBookTitle, setCurrentBookTitle] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/auth/getallcartitems', {
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
      console.log('Fetched cart items:', data);
      setCartData(data);
    } catch (err) {
      console.error('Error fetching cart items:', err);
      setError('Failed to fetch cart items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderBook = async (bookId, seller, tokensUsed, bookTitle = "Book") => {
    try {
      setOrderingItems(prev => new Set([...prev, bookId]));

      const response = await fetch('http://localhost:3000/api/order/orderbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ bookId, seller, tokensUsed })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        alert(data.message || 'Failed to order book');
      } else {
        // Show success animation instead of alert
        setCurrentBookTitle(bookTitle);
        setShowSuccessAnimation(true);
        
        setOrderedItems(prev => new Set([...prev, bookId]));

        // ✅ Fixed: Remove from cart instantly with proper filtering
        setCartData(prev => {
          if (!prev || !prev.books) return prev;
          
          const updatedBooks = prev.books.filter(book => {
            // Log for debugging - remove in production
            console.log('Comparing:', book.id, 'with', bookId, 'Match:', book.id === bookId);
            return book.id !== bookId;
          });
          
          console.log('Books before filter:', prev.books.length);
          console.log('Books after filter:', updatedBooks.length);
          
          return {
            ...prev,
            books: updatedBooks
          };
        });

        // Auto-hide animation after 3 seconds
        setTimeout(() => {
          setShowSuccessAnimation(false);
        }, 3000);
      }
    } catch (err) {
      console.error('Error ordering book:', err);
      alert('Failed to order book. Please try again.');
    } finally {
      setOrderingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookId);
        return newSet;
      });
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessAnimation(false);
  };


  // ✅ Alternative approach: Remove from cart by calling API
  const handleOrderBookWithAPIRemoval = async (bookId, seller, tokensUsed) => {
    try {
      setOrderingItems(prev => new Set([...prev, bookId]));

      const response = await fetch('http://localhost:3000/api/order/orderbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ bookId, seller, tokensUsed })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        alert(data.message || 'Failed to order book');
      } else {

        setOrderedItems(prev => new Set([...prev, bookId]));

        // Option 1: Remove locally (current approach - fixed)
        // setCartData(prev => ({
        //   ...prev,
        //   books: prev.books.filter(book => book.id !== bookId)
        // }));

        // Option 2: Or refresh cart from server (more reliable but slower)
        await fetchCartItems();
      }
    } catch (err) {
      console.error('Error ordering book:', err);
      alert('Failed to order book. Please try again.');
    } finally {
      setOrderingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookId);
        return newSet;
      });
    }
  };

  const getTotalTokens = () => {
    if (!cartData?.books) return 0;
    return cartData.books.reduce((total, book) => total + book.tokens, 0);
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
         <SuccessAnimation 
        isVisible={showSuccessAnimation}
        onClose={handleCloseSuccess}
        bookTitle={currentBookTitle}
      />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={fetchCartItems}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
<div className="bg-amber-600 backdrop-blur-sm rounded-lg mb-4">
 <div className="max-w-7xl px-2 sm:px-6 lg:px-2">
   <div className="flex items-center justify-center">
     <div className='flex flex-col lg:flex-row items-center gap-4 lg:gap-20'>
       <div className="h-[150px] w-[150px] sm:h-[200px] sm:w-[200px] lg:h-[300px] lg:w-[300px]">
          <DotLottieReact
      src="https://lottie.host/144be238-77d8-4b7b-9548-617233c46982/0E6r7IDs6T.lottie"
      loop
      autoplay
    />
       </div>
       <div className='flex flex-col gap-2 text-center lg:text-left'>
         <h1 className="font2 text-4xl sm:text-6xl lg:text-9xl font-bold text-white mb-2">Your Cart</h1>
        <div className='bg-amber-900 p-2 rounded-lg w-ful flex items-center justify-center'>
         <p className="text-white font   text-4xl">
            {cartData?.books?.length || 0} item{cartData?.books?.length !== 1 ? 's' : ''} in your cart
          </p>
          </div>
       </div>
     </div>
     </div>
     </div>
     </div>

        {/* Empty Cart State */}
        {!cartData?.books || cartData.books.length === 0 ? (
          <div className="bg-orange-100 font rounded-2xl shadow-lg p-12 text-center">
            <div className="mb-6">
              <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600">Start adding some books to your cart!</p>
            </div>
            <button  onClick={() => navigate('/dashboard')} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors transform hover:scale-105">
              Browse Books
            </button>
          </div>
        ) : (
          <div className="font lg:flex lg:gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3 space-y-6">
              {cartData.books.map((book) => (
                <div key={book.id} className="bg-yellow-100 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex items-start space-x-6">
                      {/* Book Image Placeholder */}
                      <div className="w-24 h-32 bg-amber-300 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-8 w-8 text-amber-800" />
                      </div>
                      
                      {/* Book Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font2 text-xl font-bold text-gray-900 mb-2 truncate">
                          {book.bookName}
                        </h3>
                        
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="flex items-center text-gray-600">
                            <Hash className="h-4 w-4 mr-1" />
                            <span className="text-sm">ISBN: {book.isbn}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <img
                  src="/fire.png"
                  alt="BookHive"
                  className="w-10 h-10 rounded-xl shadow-sm"
                />
                            <span className="text-2xl font-bold text-amber-600">
                              {book.tokens} Tokens
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            
                            
                            <button
                              onClick={() => handleOrderBook(book.id, book.seller, book.tokens)}
                              disabled={orderingItems.has(book.id) || orderedItems.has(book.id)}
                              className={`px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                                orderedItems.has(book.id)
                                  ? 'bg-green-600 hover:bg-green-700'
                                  : orderingItems.has(book.id)
                                  ? 'bg-blue-400 cursor-not-allowed'
                                  : 'bg-amber-700 hover:bg-amber-800 hover:scale-105 active:scale-95'
                              } shadow-lg hover:shadow-xl`}
                            >
                              <div className="flex items-center justify-center">
                                {orderingItems.has(book.id) ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Ordering...
                                  </>
                                ) : orderedItems.has(book.id) ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Ordered!
                                  </>
                                ) : (
                                  <>
                                    <Package className="h-4 w-4 mr-2" />
                                    Order Now
                                  </>
                                )}
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:w-1/3 mt-8 lg:mt-0">
              <div className="bg-yellow-100 rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Items</span>
                    <span className="font-semibold">{cartData.books.length}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Tokens</span>
                    <span className="font-semibold">{getTotalTokens()}</span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <div className='flex gap-2 '>
                        <img
                  src="/fire.png"
                  alt="BookHive"
                  className="w-10 h-10 "
                />
                        <span className="text-2xl p-2 font-bold text-amber-600">
                         
                        {getTotalTokens()} Tokens
                      </span>
                      </div>
                      
                    </div>
                  </div>
                </div>

                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">💰 Token Balance</h3>
                  <p className="text-blue-700 text-sm">
                    Make sure you have enough tokens to complete your order. Tokens are earned by selling books!
                  </p>
                </div>

                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">📚 How it works</h3>
                  <p className="text-green-700 text-sm">
                    Use your tokens to order books from other users. Each book has a token price set by the seller.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer1/>
    </div>
  );
};

export default CartPage;