/* eslint-disable no-unused-vars */
import React , { useEffect, useState }from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Topic from './pages/Topic';
import { ToastProvider } from './components/Toast';
import PostCreator from './components/PostCreator';

const Layout = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <ToastProvider>
      <div className="w-full h-screen background_root__yzs99">
        <ScrollToTop>
        <Navbar />
        <div className="flex flex-grow pt-16">
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/register" element={<Register />} />
              <Route exact path="/profile" element={<Profile />} />
              <Route exact path="/notFound" element={<NotFound />} />
              <Route exact path="/pr/:title" element={<Topic />} />
              <Route exact path="/post_creator" element={<PostCreator />} />
            </Routes>
        </div>
        </ScrollToTop>
      </div>
    </ToastProvider>
  );
};

export default Layout;
