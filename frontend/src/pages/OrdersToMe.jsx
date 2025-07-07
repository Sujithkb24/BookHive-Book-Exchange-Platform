// Full updated code for OrdersToMe with Cancel Order button
import React, { useState, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import {Plus, Package, User, Mail, Phone, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import Navbar from '../components/navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import Footer1 from '../ui/footer';
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
   toast.success('Seller has been reported successfully');
 } catch (err) {
   toast.error('Failed to report seller: ' + err.message);
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
   if (!data.success) return toast.error(data.message);
   toast.success('Order marked as delivered successfully');
   orders[orderIndex].isDelivered = true;
   setOrders([...orders]);
 } catch (err) {
   toast.error('Failed to update order status: ' + err.message);
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
   toast.success('Order canceled successfully');
 } catch (err) {
   toast.error('Failed to cancel order: ' + err.message);
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
      <ToastContainer />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-3">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-amber-600 backdrop-blur-sm rounded-lg mb-4">
 <div className="max-w-7xl px-2 sm:px-6 lg:px-2">
   <div className="flex items-center justify-center">
     <div className='flex flex-col lg:flex-row items-center gap-4 lg:gap-20'>
       <div className="h-[150px] w-[150px] sm:h-[200px] sm:w-[200px] lg:h-[300px] lg:w-[300px]">
         <DotLottieReact
           src="https://lottie.host/69aa50a9-0975-4f07-9869-2323478c80ee/4yWxLkXth8.lottie"
           loop
           autoplay
         />
       </div>
       <div className='flex flex-col gap-2 text-center lg:text-left'>
         <h1 className="font2 text-4xl sm:text-6xl lg:text-9xl font-bold text-white mb-2">My Orders</h1>
         <p className="font3 text-xl sm:text-3xl lg:text-5xl tracking-wider text-gray-900">Track and manage your orders</p>
       </div>
     </div>
   </div>
 </div>
</div>

        {/* Orders Grid */}
        <div className="font mt-3 mb-5 max-w-7xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {orders.map((order, index) => (
            <div 
              key={index} 
              className="group bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden border border-amber-100 hover:border-amber-200"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-2 line-clamp-2">{order.bookName}</h2>
                    <p className="text-amber-100 font-medium">{order.bookAuthor}</p>
                  </div>
                  <div className="ml-4">
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getConditionColor(order.bookCondition)}`}>
                      {order.bookCondition}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                {/* Book Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-amber-800/80">
                    <div className="w-2 h-2 bg-amber-300 rounded-full"></div>
                    <span className="font-medium">ISBN:</span>
                    <span className="font-mono">{order.isbn}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-amber-800/80">
                    <div className="w-2 h-2 bg-amber-300 rounded-full"></div>
                    <span className="font-medium">Pages:</span>
                    <span>{order.bookPageCount}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-amber-800/80">
                    <div className="w-2 h-2 bg-amber-300 rounded-full"></div>
                    <span className="font-medium">Tokens Used:</span>
                    <img
                  src="/fire.png"
                  alt="BookHive"
                  className="w-5 h-5 rounded-xl shadow-sm"
                /> 
                    <span className="font-bold text-amber-900">{order.tokensUsed}</span>
                  </div>
                </div>

                {/* Seller Info */}
                <div className="bg-gradient-to-r from-amber-100 to-orange-50 rounded-xl p-4 mb-6 border border-amber-100">
                  <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Seller Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-amber-800">
                      <span className="font-medium min-w-[50px]">Name:</span>
                      <span>{order.buyerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-800">
                      <Mail className="w-4 h-4 text-amber-600" />
                      <span className="break-all">{order.buyerEmail}</span>
                    </div>
                    {order.buyerPhone && (
                      <div className="flex items-center gap-2 text-amber-800">
                        <Phone className="w-4 h-4 text-amber-600" />
                        <span>{order.buyerPhone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => handleOrderReceived(order.orderId, index)}
                    disabled={order.isDelivered}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                      order.isDelivered
                        ? 'bg-emerald-100 text-emerald-800 cursor-not-allowed'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg active:scale-95'
                    }`}
                  >
                    {actionLoading[`deliver-${index}`] ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    {order.isDelivered ? 'Order Delivered' : 'Mark as Delivered'}
                  </button>

                  <button
                    onClick={() => handleCancelOrder(order.orderId, index)}
                    disabled={order.isDelivered}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                      order.isDelivered
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-amber-600 text-white hover:bg-amber-700 hover:shadow-lg active:scale-95'
                    }`}
                  >
                    {actionLoading[`cancel-${index}`] ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    {actionLoading[`cancel-${index}`] ? 'Cancelling...' : 'Cancel Order'}
                  </button>

                  <button
                    onClick={() => handleReport(order.sellerId, index)}
                    disabled={actionLoading[`report-${index}`]}
                    className="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 bg-red-600 text-white hover:bg-red-700 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading[`report-${index}`] ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                    {actionLoading[`report-${index}`] ? 'Reporting...' : 'Report Seller'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
              <Package className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-amber-800 mb-2">No orders yet</h3>
            <p className="text-amber-600">Your book orders will appear here once you make a purchase.</p>
          </div>
        )}
      </div>
    </div>
    <Footer1/>
    </>
  );
};

export default OrdersToMe;
