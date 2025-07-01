import { Routes, Route } from 'react-router-dom';
import ItemFetcher from './components/lol-ItemFetch/ItemFetch/ItemFetch';
import ChampionFetcher from './components/lol-ChampFetch/ChampStats';
import SignupForm from './components/AccountForms/SignupForm';
import LoginForm from './components/AccountForms/LoginForm'; 
import NavBar from './components/Layout/NavBar';
import Layout from './components/Layout/Layout'


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
