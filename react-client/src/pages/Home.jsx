/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Post from "../components/Post";
import { motion as m } from "framer-motion";
import PostContainer from "../components/PostContainer";
import { ToastProvider } from "../components/Toast";
import "@codaworks/react-glow"
import { Glow, GlowCapture } from "@codaworks/react-glow";
//import Post from '../components/Post'

const Home = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // Fetch random posts from different topics
        fetch("http://localhost:5000/")
            .then((response) => response.json())
            .then((data) => {
                setPosts(data.posts);
            })
            .catch((error) => console.error("Error fetching random posts:", error));
    }, []);

    return (
        <m.div
            className="w-full h-full background_root__yzs99"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.75 }}
        >
            <PostContainer posts={posts} />
        </m.div>
    );
};

export default Home