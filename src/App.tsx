// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { FakeAuthProvider } from './contexts/FakeAuthContext';
import Hospitals from './components/Hospitals';
import Universities from './components/Universities';
import UniversityMaps from './components/UniversityMaps'; // Fixed import to match component name
import NavBar from './components/Navbar'; // Import NavBar

const App: React.FC = () => {
  return (
    <FakeAuthProvider>
      <Router>
        <div className="min-h-screen w-screen flex flex-col bg-gray-100">
          <NavBar /> {/* Include NavBar */}
          <main className="flex-grow container mx-auto p-4">
            <Routes>
              <Route path="/hospitals" element={<Hospitals />} />
              <Route path="/universities" element={<Universities />} />
              <Route path="/" element={<UniversityMaps />} />
            </Routes>
          </main>
        </div>
      </Router>
    </FakeAuthProvider>
  );
};

export default App;
