import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import ItemFetcher from './components/lol-item-fetch';
import ChampionFetcher from './components/lol-champ-fetch';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';

function Home() {
  return (
    <>
      <h1>Game Calculator</h1>
      <ItemFetcher />
      <ChampionFetcher />
    </>
  );
}

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
      </Routes>
    </>
  );
}

export default App;
