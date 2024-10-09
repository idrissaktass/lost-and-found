import logo from './logo.svg';
import './App.css';
import Home from './components/Home';
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import React, {useState} from 'react';
import Signup from './components/SignUp';
import Listings from './components/Listings';
import Losts from './components/Losts';
import ListingDetails from './components/Listing';
import LostDetails from './components/Lost';
import MyListings from './components/MyListings';
import Pets from './components/Pets';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/listings" element={<Listings/>} />
          <Route path="/losts" element={<Losts/>} />
          <Route path="/listing/:id" element={<ListingDetails/>} />
          <Route path="/lost/:id" element={<LostDetails/>} />
          <Route path="/my-listings" element={<MyListings/>} />
          <Route path="/Pets" element={<Pets/>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
