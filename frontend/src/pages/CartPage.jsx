import React, { useState, useEffect } from 'react';
import { ShoppingCart, BookOpen, Hash, DollarSign, CheckCircle, Trash2, Package } from 'lucide-react';
import Navbar from '../components/navbar';

const CartPage = () => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderingItems, setOrderingItems] = useState(new Set());
  const [orderedItems, setOrderedItems] = useState(new Set());

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

  const handleOrderBook = async (bookId, seller, tokensUsed) => {
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
        alert('Book ordered successfully!');
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
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <ShoppingCart className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
          </div>
          <p className="text-gray-600">
            {cartData?.books?.length || 0} item{cartData?.books?.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        {/* Empty Cart State */}
        {!cartData?.books || cartData.books.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="mb-6">
              <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600">Start adding some books to your cart!</p>
            </div>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors transform hover:scale-105">
              Browse Books
            </button>
          </div>
        ) : (
          <div className="lg:flex lg:gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3 space-y-6">
              {cartData.books.map((book) => (
                <div key={book.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex items-start space-x-6">
                      {/* Book Image Placeholder */}
                      <div className="w-24 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-8 w-8 text-blue-600" />
                      </div>
                      
                      {/* Book Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
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
                            <DollarSign className="h-5 w-5 text-green-600" />
                            <span className="text-2xl font-bold text-green-600">
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
                                  : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95'
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
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
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
                      <span className="text-2xl font-bold text-blue-600">
                        {getTotalTokens()} Tokens
                      </span>
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
    </div>
  );
};

export default CartPage;