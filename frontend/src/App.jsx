import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookExchangeLanding from "./pages/LandingPage";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BookExchangeLanding />} /> 

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
