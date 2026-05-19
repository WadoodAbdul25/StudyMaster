import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import LandingPage from './Components/landingpage';
import Dashboard from './Components/dashboard';
import UploadModal from './Components/uploadModal';

function App() {
  const [showUpload, setShowUpload] = useState(false);
  const [refreshDashboard, setRefreshDashboard] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshDashboard(prev => prev + 1);
  };

  return (
    <Router>
      <div>
        {/* Routes */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard key={refreshDashboard} />} />
        </Routes>

        {/* Upload Modal */}
        {showUpload && (
          <UploadModal
            onClose={() => setShowUpload(false)}
            onUploadSuccess={handleUploadSuccess}
          />
        )}
      </div>
    </Router>
  );
}

export default App;