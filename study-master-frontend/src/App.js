import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Components/landingpage';
import Dashboard from './Components/dashboard';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
