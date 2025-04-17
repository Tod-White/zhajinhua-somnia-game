import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import { GameProvider } from './contexts/GameContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Game from './pages/Game';
import Lobby from './pages/Lobby';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';

function App() {
  return (
    <WalletProvider>
      <GameProvider>
        <Router>
          <div className="app">
            <Header />
            <main className="container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/game/:gameId" element={<Game />} />
                <Route path="/lobby" element={<Lobby />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </GameProvider>
    </WalletProvider>
  );
}

export default App;
