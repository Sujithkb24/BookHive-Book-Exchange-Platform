import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookExchangeLanding from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import AuthForm from "./pages/LoginRegisterUser";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BookExchangeLanding />} /> 
        <Route path="/login" element={<AuthForm/>} /> 
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
