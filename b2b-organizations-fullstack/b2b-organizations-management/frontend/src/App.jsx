import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import OrganizationsList from './components/OrganizationsList';
import OrganizationDetails from './components/OrganizationDetails';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/organizations" replace />} />
            <Route path="/organizations" element={<OrganizationsList />} />
            <Route path="/organizations/:id" element={<OrganizationDetails />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
