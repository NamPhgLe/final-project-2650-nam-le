
import { Routes, Route } from 'react-router-dom';
import ItemFetcher from './components/lol-ItemFetch/ItemFetch/ItemFetch';
import ChampionFetcher from './components/lol-ChampFetch/ChampStats';
import SignupForm from './components/AccountForms/SignupForm';
import LoginForm from './components/AccountForms/LoginForm'; 
import NavBar from './components/Layout/NavBar';
import Layout from './components/Layout/Layout'
import HomePage from './components/Pages/Home/HomePage';
import React, { Suspense, lazy } from 'react';

const LeagueOfLegendsPage = lazy(() =>
  import('./components/Pages/Content/LeagueOfLegendsPage')
);


function App() {
  return (
    <>
      <NavBar />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/league" element={<LeagueOfLegendsPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;