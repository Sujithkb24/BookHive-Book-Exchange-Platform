import React, { useState, useEffect } from 'react';
import { Calendar, Package, CreditCard, User, Star, ChevronDown, ChevronUp, Filter, Search, Clock, CheckCircle, Truck, MapPin, Check, X } from 'lucide-react';

const OrderComponent = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrders, setExpandedOrders] = useState({});
  const [sortBy, setSortBy] = useState('date');
  const [visibleCards, setVisibleCards] = useState([]);
  const [orderActions, setOrderActions] = useState({});

  // Sample order data
  const orders = [
    {
      id: 'ORD-2024-001',
      date: '2024-06-15',
      status: 'delivered',
      customer: 'John Smith',
      email: 'john.smith@email.com',
      total: 45.99,
      items: 3,
      books: [
        { title: 'Atomic Habits', author: 'James Clear', price: 15.99, quantity: 1, cover: 'https://via.placeholder.com/60x80/3B82F6/ffffff?text=AH', rating: 4.9 },
        { title: 'The Midnight Library', author: 'Matt Haig', price: 14.99, quantity: 1, cover: 'https://via.placeholder.com/60x80/8B5CF6/ffffff?text=ML', rating: 4.8 },
        { title: 'Project Hail Mary', author: 'Andy Weir', price: 15.01, quantity: 1, cover: 'https://via.placeholder.com/60x80/10B981/ffffff?text=PHM', rating: 4.7 }
      ],
      shippingAddress: '123 Main St, New York, NY 10001',
      paymentMethod: 'Credit Card (****1234)'
    },
    {
      id: 'ORD-2024-002',
      date: '2024-06-12',
      status: 'shipped',
      customer: 'Emily Johnson',
      email: 'emily.johnson@email.com',
      total: 32.98,
      items: 2,
      books: [
        { title: 'Educated', author: 'Tara Westover', price: 16.99, quantity: 1, cover: 'https://via.placeholder.com/60x80/F59E0B/ffffff?text=ED', rating: 4.8 },
        { title: 'The Seven Husbands', author: 'Taylor Jenkins Reid', price: 15.99, quantity: 1, cover: 'https://via.placeholder.com/60x80/EF4444/ffffff?text=SH', rating: 4.6 }
      ],
      shippingAddress: '456 Oak Ave, Los Angeles, CA 90210',
      paymentMethod: 'PayPal'
    },
    {
      id: 'ORD-2024-003',
      date: '2024-06-10',
      status: 'processing',
      customer: 'Michael Chen',
      email: 'michael.chen@email.com',
      total: 28.97,
      items: 2,
      books: [
        { title: 'Sapiens', author: 'Yuval Noah Harari', price: 18.99, quantity: 1, cover: 'https://via.placeholder.com/60x80/06B6D4/ffffff?text=SP', rating: 4.7 },
        { title: 'Think Again', author: 'Adam Grant', price: 9.98, quantity: 1, cover: 'https://via.placeholder.com/60x80/8B5CF6/ffffff?text=TA', rating: 4.5 }
      ],
      shippingAddress: '789 Pine St, Chicago, IL 60601',
      paymentMethod: 'Credit Card (****5678)'
    },
    {
      id: 'ORD-2024-004',
      date: '2024-06-08',
      status: 'delivered',
      customer: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      total: 52.96,
      items: 4,
      books: [
        { title: 'Dune', author: 'Frank Herbert', price: 16.99, quantity: 1, cover: 'https://via.placeholder.com/60x80/F59E0B/ffffff?text=DN', rating: 4.8 },
        { title: '1984', author: 'George Orwell', price: 12.99, quantity: 1, cover: 'https://via.placeholder.com/60x80/EF4444/ffffff?text=1984', rating: 4.9 },
        { title: 'The Alchemist', author: 'Paulo Coelho', price: 11.99, quantity: 1, cover: 'https://via.placeholder.com/60x80/10B981/ffffff?text=AL', rating: 4.6 },
        { title: 'Clean Code', author: 'Robert Martin', price: 10.99, quantity: 1, cover: 'https://via.placeholder.com/60x80/3B82F6/ffffff?text=CC', rating: 4.7 }
      ],
      shippingAddress: '321 Elm St, Seattle, WA 98101',
      paymentMethod: 'Credit Card (****9012)'
    },
    {
      id: 'ORD-2024-005',
      date: '2024-06-05',
      status: 'cancelled',
      customer: 'David Brown',
      email: 'david.brown@email.com',
      total: 23.98,
      items: 2,
      books: [
        { title: 'The Psychology of Money', author: 'Morgan Housel', price: 11.99, quantity: 1, cover: 'https://via.placeholder.com/60x80/8B5CF6/ffffff?text=PM', rating: 4.8 },
        { title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', price: 11.99, quantity: 1, cover: 'https://via.placeholder.com/60x80/F59E0B/ffffff?text=RD', rating: 4.5 }
      ],
      shippingAddress: '654 Cedar Rd, Miami, FL 33101',
      paymentMethod: 'Credit Card (****3456)'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-400 bg-green-400/10';
      case 'shipped': return 'text-blue-400 bg-blue-400/10';
      case 'processing': return 'text-yellow-400 bg-yellow-400/10';
      case 'cancelled': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return CheckCircle;
      case 'shipped': return Truck;
      case 'processing': return Clock;
      case 'cancelled': return Clock;
      default: return Package;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = selectedFilter === 'all' || order.status === selectedFilter;
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.books.some(book => book.title.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case 'date': return new Date(b.date) - new Date(a.date);
      case 'total': return b.total - a.total;
      case 'customer': return a.customer.localeCompare(b.customer);
      default: return 0;
    }
  });

  const toggleExpanded = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handleOrderAction = (orderId, action) => {
    setOrderActions(prev => ({
      ...prev,
      [orderId]: action
    }));
    
    // In a real app, you would make an API call here
    console.log(`Order ${orderId} ${action === 'accepted' ? 'accepted' : 'declined'}`);
    
    // Show temporary feedback
    setTimeout(() => {
      setOrderActions(prev => ({
        ...prev,
        [orderId]: null
      }));
    }, 3000);
  };

  // Staggered animation effect
  useEffect(() => {
    setVisibleCards([]);
    sortedOrders.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCards(prev => [...prev, index]);
      }, index * 100);
    });
  }, [selectedFilter, searchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
            Order History
          </h1>
          <p className="text-gray-400">Track and manage your book sales orders</p>
        </div>

       

        
        {/* Order Cards */}
        <div className="space-y-4">
          {sortedOrders.map((order, index) => {
            const StatusIcon = getStatusIcon(order.status);
            const isVisible = visibleCards.includes(index);
            const isExpanded = expandedOrders[order.id];

            return (
              <div
                key={order.id}
                className={`bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-500 transform ${
                  isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Main Order Card */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <StatusIcon className="w-5 h-5 text-gray-400" />
                        <span className="font-mono text-sm text-gray-300">{order.id}</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-400">${order.total.toFixed(2)}</div>
                        <div className="text-sm text-gray-400">{order.items} items</div>
                      </div>
                      <button
                        onClick={() => toggleExpanded(order.id)}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <User className="w-4 h-4 text-blue-400" />
                      <div>
                        <div className="font-medium">{order.customer}</div>
                        <div className="text-sm text-gray-400">{order.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <div>
                        <div className="font-medium">{new Date(order.date).toLocaleDateString()}</div>
                        <div className="text-sm text-gray-400">Order Date</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-4 h-4 text-green-400" />
                      <div>
                        <div className="font-medium">{order.paymentMethod}</div>
                        <div className="text-sm text-gray-400">Payment</div>
                      </div>
                    </div>
                  </div>

                  {/* Books Preview */}
                  <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                    {order.books.slice(0, 3).map((book, bookIndex) => (
                      <div key={bookIndex} className="flex items-center space-x-2 bg-gray-700 rounded-lg p-2 min-w-max">
                        <img src={book.cover} alt={book.title} className="w-8 h-10 rounded object-cover" />
                        <div>
                          <div className="text-sm font-medium truncate max-w-32">{book.title}</div>
                          <div className="text-xs text-gray-400">${book.price}</div>
                        </div>
                      </div>
                    ))}
                    {order.books.length > 3 && (
                      <div className="text-sm text-gray-400 ml-2">+{order.books.length - 3} more</div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    {orderActions[order.id] ? (
                      <div className="flex items-center justify-center space-x-2 py-2">
                        {orderActions[order.id] === 'accepted' ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span className="text-green-400 font-medium">Order Accepted</span>
                          </>
                        ) : (
                          <>
                            <X className="w-5 h-5 text-red-400" />
                            <span className="text-red-400 font-medium">Order Declined</span>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() => handleOrderAction(order.id, 'declined')}
                          className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-lg text-red-400 hover:text-red-300 transition-all duration-200 transform hover:scale-105"
                        >
                          <X className="w-4 h-4" />
                          <span>Decline</span>
                        </button>
                        <button
                          onClick={() => handleOrderAction(order.id, 'accepted')}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 hover:border-green-500/50 rounded-lg text-green-400 hover:text-green-300 transition-all duration-200 transform hover:scale-105"
                        >
                          <Check className="w-4 h-4" />
                          <span>Accept</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-700 p-6 animate-in slide-in-from-top duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Books Details */}
                      <div>
                        <h4 className="font-semibold mb-4 flex items-center">
                          <Package className="w-4 h-4 mr-2 text-blue-400" />
                          Order Items
                        </h4>
                        <div className="space-y-3">
                          {order.books.map((book, bookIndex) => (
                            <div key={bookIndex} className="flex items-center space-x-4 bg-gray-700 rounded-lg p-3">
                              <img src={book.cover} alt={book.title} className="w-12 h-16 rounded object-cover" />
                              <div className="flex-1">
                                <div className="font-medium">{book.title}</div>
                                <div className="text-sm text-gray-400">by {book.author}</div>
                                <div className="flex items-center mt-1">
                                  <Star className="w-3 h-3 text-yellow-400 mr-1" />
                                  <span className="text-xs text-gray-400">{book.rating}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">${book.price}</div>
                                <div className="text-sm text-gray-400">Qty: {book.quantity}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping & Payment Details */}
                      <div>
                        <h4 className="font-semibold mb-4 flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-green-400" />
                          Shipping & Payment
                        </h4>
                        <div className="space-y-4">
                          <div className="bg-gray-700 rounded-lg p-4">
                            <div className="text-sm text-gray-400 mb-1">Shipping Address</div>
                            <div className="text-white">{order.shippingAddress}</div>
                          </div>
                          <div className="bg-gray-700 rounded-lg p-4">
                            <div className="text-sm text-gray-400 mb-1">Payment Method</div>
                            <div className="text-white">{order.paymentMethod}</div>
                          </div>
                          <div className="bg-gray-700 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Subtotal:</span>
                              <span className="text-white">${(order.total * 0.9).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Tax:</span>
                              <span className="text-white">${(order.total * 0.1).toFixed(2)}</span>
                            </div>
                            <div className="border-t border-gray-600 pt-2 mt-2">
                              <div className="flex justify-between items-center font-semibold">
                                <span className="text-white">Total:</span>
                                <span className="text-green-400">${order.total.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {sortedOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No orders found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderComponent;