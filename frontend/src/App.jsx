import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookExchangeLanding from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import AuthForm from "./pages/LoginRegisterUser";
import ProductPage from "./components/ViewProduct";
import DashApp from "./pages/Dashboard";
import BookstoreEarningsDashboard from "./pages/YourEarnings";
import OrderComponent from "./pages/Orders";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BookExchangeLanding />} /> 
        <Route path="/YourEarnings" element={<BookstoreEarningsDashboard />} /> 
        <Route path="/Orders" element={<OrderComponent/>} /> 
        <Route path="/login" element={<AuthForm/>} /> 
        <Route path="/ViewProduct" element={<ProductPage/>} /> 
        <Route path="/Dashboard" element={<DashApp/>} /> 
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
