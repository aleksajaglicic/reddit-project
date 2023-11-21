/* eslint-disable no-unused-vars */
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';

const Layout = () => {
  return (
    <div className="d-flex flex-column h-screen min-w-700px">
      <ScrollToTop>
      <Navbar />
      <div className="flex-grow flex pt-16">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/profile" element={<Profile />} />
          </Routes>
      </div>
      </ScrollToTop>
    </div>
  );
};

export default Layout;
