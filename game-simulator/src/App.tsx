import ItemFetcher from './components/lol-item-fetch';
import ChampionFetcher from './components/lol-champ-fetch';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';

function App() {
  return (
    <div>
      <LoginForm />
      <SignupForm />
      <h1>Game Calculator</h1>
      <ItemFetcher />
      <ChampionFetcher />
    </div>
  );
}

export default App;