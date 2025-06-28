import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookExchangeLanding from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import AuthForm from "./pages/LoginRegisterUser";
import ProductPage from "./components/ViewProduct";
import DashApp from "./pages/Dashboard";
import BookstoreEarningsDashboard from "./pages/YourEarnings";
import OrderComponent from "./pages/Orders";
import BookshopDashboard from "./pages/Dashboard";
import BookDetailsPage from "./pages/BookDetail";
import CartPage from "./pages/CartPage";
import MyOrdersPage from "./pages/MyOrders";
import ProfilePage from "./pages/ProfilePage";
import OrdersToMe from "./pages/OrdersToMe";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BookExchangeLanding />} /> 
        <Route path="/YourEarnings" element={<BookstoreEarningsDashboard />} /> 
        <Route path="/Orders" element={<OrderComponent/>} /> 
        <Route path="/login" element={<AuthForm/>} /> 
        <Route path="/ViewProduct" element={<ProductPage/>} /> 
        <Route path="/dashboard" element={<BookshopDashboard/>} /> 
        <Route path="/book/:bookId" element={<BookDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/myorders" element={<MyOrdersPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/orders-to-me" element={<OrdersToMe />} />
        {/* Add more routes as needed */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
   
  );
}

export default App;
