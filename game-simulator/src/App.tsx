import ItemFetcher from './components/lol-item-fetch';
import ChampionFetcher from './components/lol-champ-fetch'

function App() {
  return (
    <div>
      <h1>Game Calculator</h1>
      <ItemFetcher />
      <ChampionFetcher />
    </div>
  );
}

export default App;