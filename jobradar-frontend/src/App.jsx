import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import OAuth2Redirect from './pages/OAuth2Redirect';
import Home from './pages/Home';
import SelectSkills from './pages/SelectSkills';
import Jobs from './pages/Jobs';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
        <Route path="/skills" element={<SelectSkills />} />
        <Route path="/jobs" element={<Jobs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
