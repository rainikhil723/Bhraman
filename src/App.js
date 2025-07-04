import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import DelhiPage from './pages/DelhiPage';
import VaranasiPage from './pages/VaranasiPage';
import HyderabadPage from './pages/HyderabadPage';
import AgraPage from './pages/AgraPage';
import GoaPage from './pages/GoaPage';
import JaipurPage from './pages/JaipurPage';
import AmritsarPage from './pages/AmritsarPage';
import BengaluruPage from './pages/BengaluruPage';
import MumbaiPage from './pages/MumbaiPage';
import UttarakhandPage from './pages/UttarakhandPage';
import UdaipurPage from './pages/UdaipurPage';
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import { useLocation } from 'react-router-dom';
import TransportForm from './components/TransportForm';
import ResultsPage from './components/ResultsPage';
import CityNotFound from './pages/CityNotFound';
import About from "./pages/About";



function AppContent() {
  const location = useLocation();
  const showNavbarOnlyOnLanding = location.pathname === "/";

  return (
    <>
      {showNavbarOnlyOnLanding && <Navbar />} {/* Show only on "/" */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/results/delhi" element={<DelhiPage />} />
        <Route path="/results/varanasi" element={<VaranasiPage />} />
        <Route path="/results/amritsar" element={<AmritsarPage />} />
        <Route path="/results/bengaluru" element={<BengaluruPage />} />
        <Route path="/results/goa" element={<GoaPage />} />
        <Route path="/results/hyderabad" element={<HyderabadPage />} />
        <Route path="/results/jaipur" element={<JaipurPage />} />
        <Route path="/results/mumbai" element={<MumbaiPage />} />
        <Route path="/results/agra" element={<AgraPage />} />
        <Route path="/results/uttarakhand" element={<UttarakhandPage />} />
        <Route path="/results/udaipur" element={<UdaipurPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/transport" element={<TransportForm />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/city-not-found" element={<CityNotFound />} />
        <Route path="/about" element={<About />} />

      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
