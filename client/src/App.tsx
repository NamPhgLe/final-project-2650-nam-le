import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import ItemFetcher from './components/lol-ItemFetch/ItemFetch/ItemFetch';
import ChampionFetcher from './components/lol-champ-fetch';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm'; 
import Layout from './components/Layout'


function Home() {
  return (
    <Layout>
      <h1>Game Calculator</h1>
      <ItemFetcher />
      <ChampionFetcher />
    </Layout>
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
