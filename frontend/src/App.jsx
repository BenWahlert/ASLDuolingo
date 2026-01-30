import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProgressProvider } from './context/ProgressContext';
import Navbar from './components/common/Navbar';
import Learn from './pages/Learn';
import Lesson from './pages/Lesson';
import Profile from './pages/Profile';
import './App.css';

function App() {
  return (
    <BrowserRouter basename="/ASLDuolingo">
      <ProgressProvider>
        <div className="app-container">
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/learn" replace />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/lesson/:id" element={<Lesson />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </ProgressProvider>
    </BrowserRouter>
  );
}

export default App;
