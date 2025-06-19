// Full updated code for OrdersToMe with Cancel Order button
import React, { useState, useEffect } from 'react';
import {
  Package, User, Mail, Phone, Book, Calendar, Star,
  AlertTriangle, CheckCircle, Clock, BookOpen
} from 'lucide-react';
import Navbar from '../components/navbar';

const OrdersToMe = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/order/getorderstome', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      console.log('Fetched orders:', data);
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async (sellerId, orderIndex) => {
    try {
      setActionLoading(prev => ({ ...prev, [`report-${orderIndex}`]: true }));
      const response = await fetch('http://localhost:3000/api/auth/reportuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ userId: sellerId }),
      });
      if (!response.ok) throw new Error('Failed to report user');
      alert('Seller has been reported successfully');
    } catch (err) {
      alert('Failed to report seller: ' + err.message);
    } finally {
      setActionLoading(prev => ({ ...prev, [`report-${orderIndex}`]: false }));
    }
  };

  const handleOrderReceived = async (orderId, orderIndex) => {
    try {
      setActionLoading(prev => ({ ...prev, [`received-${orderIndex}`]: true }));
      const response = await fetch('http://localhost:3000/api/order/updatedelivered', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ orderId }),
      });
      const data = await response.json();
      if (!data.success) return alert(data.message);
      alert('Order marked as delivered successfully');
      orders[orderIndex].isDelivered = true;
      setOrders([...orders]);
    } catch (err) {
      alert('Failed to update order status: ' + err.message);
    } finally {
      setActionLoading(prev => ({ ...prev, [`received-${orderIndex}`]: false }));
    }
  };

  const handleCancelOrder = async (orderId, orderIndex) => {
    try {
      console.log('Canceling order:', orderId, 'at index:', orderIndex);
      setActionLoading(prev => ({ ...prev, [`cancel-${orderIndex}`]: true }));
      const response = await fetch('http://localhost:3000/api/order/ordercancelbyseller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ orderId }),
      });
      const data = await response.json();

      const updatedOrders = [...orders];
      updatedOrders.splice(orderIndex, 1);
      setOrders(updatedOrders);
      alert('Order canceled successfully');
    } catch (err) {
      alert('Failed to cancel order: ' + err.message);
    } finally {
      setActionLoading(prev => ({ ...prev, [`cancel-${orderIndex}`]: false }));
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  const getConditionColor = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'average': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) return (<><Navbar/><div className="min-h-screen flex justify-center items-center">Loading...</div></>);
  if (error) return (<><Navbar/><div className="min-h-screen flex justify-center items-center">{error}</div></>);

  return (
    <>
      <Navbar />
      <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">My Orders</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order, index) => (
              <div key={index} className="bg-white shadow-lg rounded-xl overflow-hidden p-6">
                <div className="mb-3">
                  <h2 className="text-xl font-bold mb-1">{order.bookName}</h2>
                  <p className="text-gray-600">{order.bookAuthor}</p>
                  <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${getConditionColor(order.bookCondition)}`}>
                    {order.bookCondition}
                  </span>
                </div>
                <div className="text-sm text-gray-700 mb-2">ISBN: {order.isbn}</div>
                <div className="text-sm text-gray-700 mb-2">Pages: {order.bookPageCount}</div>
                <div className="text-sm text-gray-700 mb-4">Tokens Used: <strong>{order.tokensUsed}</strong></div>

                <div className="bg-gray-100 p-3 rounded mb-4">
                  <h4 className="font-semibold mb-2">Seller Info:</h4>
                  <p><strong>Name:</strong> {order.buyerName}</p>
                  <p><strong>Email:</strong> {order.buyerEmail}</p>
                  {order.buyerPhone && <p><strong>Phone:</strong> {order.buyerPhone}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleOrderReceived(order.orderId, index)}
                    disabled={order.isDelivered}
                    className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {order.isDelivered ? 'Order Delivered' : 'Mark as Delivered'}
                  </button>

                  <button
                    onClick={() => handleCancelOrder(order.orderId, index)}
                    disabled={order.isDelivered}
                    className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 disabled:opacity-50"
                  >
                    {actionLoading[`cancel-${index}`] ? 'Cancelling...' : 'Cancel Order'}
                  </button>

                  <button
                    onClick={() => handleReport(order.sellerId, index)}
                    disabled={actionLoading[`report-${index}`]}
                    className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    {actionLoading[`report-${index}`] ? 'Reporting...' : 'Report Seller'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrdersToMe;
