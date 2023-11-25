/* eslint-disable no-unused-vars */
import React from "react";
import Post from "../components/Post";
import { motion as m } from "framer-motion";
import PostContainer from "../components/PostContainer";
import { ToastProvider } from "../components/Toast";
import "@codaworks/react-glow"
import { Glow, GlowCapture } from "@codaworks/react-glow";
//import Post from '../components/Post'

const Home = () => {
    return (
        <m.div className="w-full" initial={{ opacity: 0}} animate={{ opacity: 1 }} transition= {{ duration: 0.75}}>
            <ToastProvider>
                <PostContainer />
            </ToastProvider>
        </m.div>
    )
}

export default Home