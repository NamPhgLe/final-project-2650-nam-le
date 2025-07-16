
import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ItemFetcher from './components/lol-ItemFetch/ItemFetch/ItemFetch';
import ChampionFetcher from './components/lol-ChampFetch/ChampStats';
import SignupForm from './components/AccountForms/SignupForm';
import LoginForm from './components/AccountForms/LoginForm';
import NavBar from './components/Layout/NavBar';
import Layout from './components/Layout/Layout'
import HomePage from './components/Pages/Home/HomePage';
import React, { Suspense, lazy } from 'react';
import { PopupProvider } from './components/Layout/PopupContext';
import Popup from './components/Layout/Popup';
import axios from 'axios';

const LeagueOfLegendsPage = lazy(() =>
  import('./components/Pages/Content/LeagueOfLegendsPage')
);

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/member/protected`, { withCredentials: true });
        if (response.status === 200 && response.data.user) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        setLoggedIn(false);
      }
    };
  
    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${apiUrl}/api/member/signout`, {}, { withCredentials: true });
      setLoggedIn(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  

  return (
    <>
      <PopupProvider>
        <NavBar loggedIn={loggedIn} onLogout={handleLogout} />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="signup" element={<SignupForm setLoggedIn={setLoggedIn} />} />
            <Route path="login" element={<LoginForm setLoggedIn={setLoggedIn} />} />
            <Route path="/league" element={<LeagueOfLegendsPage />} />
          </Routes>
        </Suspense>
        <Popup />
      </PopupProvider>
    </>
  );
}

export default App;