import { useState ,useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookExchangeLanding from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import AuthForm from "./pages/LoginRegisterUser";
// import ProductPage from "./components/ViewProduct";
import BooksDashboard from "./pages/Dashboard";
import {  useLocation} from 'react-router-dom';
import BookstoreEarningsDashboard from "./pages/YourEarnings";
import Loader from "./ui/Loader";
import BookshopDashboard from "./pages/Dashboard";
import BookDetailsPage from "./pages/BookDetail";
import CartPage from "./pages/CartPage";
import MyOrdersPage from "./pages/MyOrders";
import ProfilePage from "./pages/ProfilePage";
import OrdersToMe from "./pages/OrdersToMe";
import MyListedBooksPage from "./pages/ListedBookPage";
import BookSellPage from "./pages/BookSellPage";

function App() {
   const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  setLoading(true);
  
  // Hide overflow when loading starts
  document.body.style.overflowY = 'hidden';
  
  const minLoadTime = setTimeout(() => {
    setLoading(false);
    // Restore overflow when loading ends
    document.body.style.overflowY = 'auto';
  }, 1500);
  
  return () => {
    clearTimeout(minLoadTime);
    // Cleanup: restore overflow if component unmounts
    document.body.style.overflowY = 'auto';
  };
}, [location]);
  return (
     <div>
      {loading && <Loader />}
    
      
      <Routes>
        <Route path="/" element={<BookExchangeLanding />} /> 
        <Route path="/YourEarnings" element={<BookstoreEarningsDashboard />} /> 
      
        <Route path="/login" element={<AuthForm/>} /> 
   
        <Route path="/dashboard" element={<BookshopDashboard/>} /> 
        {/* <Route path="/ViewProduct" element={<ProductPage/>} />  */}
        <Route path="/dashboard" element={<BooksDashboard/>} /> 
        <Route path="/book/:bookId" element={<BookDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/myorders" element={<MyOrdersPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/orders-to-me" element={<OrdersToMe />} />
        <Route path="/addsell" element={<BookSellPage />} />
        <Route path="/mylistedsells" element={<MyListedBooksPage />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    
   </div>
  );
}

export default App;
