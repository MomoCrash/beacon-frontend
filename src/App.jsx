import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/home.jsx';
import UserSearching from './pages/player_search.jsx';
import ListChampGuid from './pages/guides.jsx';
import ChampGuid from './pages/champion.jsx';
import Register from "./pages/register.jsx";
import { NotFound } from './components/NotFound';
import { CustomNavbar } from './components/navbar';
import { Footer } from './components/footer';
import Login from "./pages/login.jsx";
import Profile from "./pages/profile.jsx";
import InGameProfile from "./pages/game_stats.jsx";
import React from "react";
import Esports from "./pages/e-sport.jsx";

function App() {

  const isLogged = localStorage.getItem("email") !== null

  console.log("Loaded")

  return (
    <Router>

      <div>
        <CustomNavbar />
        <Routes>
          <Route path="/beacon-frontend/" element={<Home />} />
          <Route path="/beacon-frontend/usersearch" element={<UserSearching />} />
          <Route path="/beacon-frontend/register" element={ isLogged ? <Profile /> : <Register />} />
          <Route path="/beacon-frontend/login" element={ isLogged ? <Profile /> : <Login />} />
          <Route path="/beacon-frontend/profile" element={ isLogged ? <Profile /> : <Login />} />
          <Route path="/beacon-frontend/in-game-profile" element={ isLogged ? <InGameProfile /> : <Register /> } />
          <Route path="/beacon-frontend/e-sport" element={ < Esports /> } />
          <Route path="/beacon-frontend/guide" element={<ListChampGuid />} />
          <Route path="/beacon-frontend/guide/:id" element={<ChampGuid />} />
          <Route path="/beacon-frontend/*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
