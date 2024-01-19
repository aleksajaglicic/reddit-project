/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React , { useEffect, useState }from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Home from "./pages/Home";
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Topic from './pages/Topic';
import { ToastProvider } from './components/Toast';
import PostCreator from './components/PostCreator';
import Sidebar from './components/Sidebar';
import PostPage from './pages/PostPage';

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
            <Sidebar />
            <div className="flex flex-grow pt-16">
                <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/notFound" element={<NotFound />} />
                <Route path="/pr/:title" element={<Topic />} />
                <Route path="/pr/:title/:post_id" element={<PostPage />} />
                <Route path="/post_creator" element={<PostCreator owner_id='' topic_id='' />} />
                </Routes>
            </div>
            </ScrollToTop>
        </div>
        </ToastProvider>
    );
};

export default Layout;
