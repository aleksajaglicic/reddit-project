/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";

const GlowButton = () => {
    return (
        <div className="flex">
        <motion.div className="group relative" whileHover={{ scale: 1.05 }}>
            <motion.div
            className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 opacity-50 blur flicker"
            initial={{ opacity: 0.2 }}
            animate={{
                opacity: [0.2, 0.5, 0.3, 0.7, 0.4, 0.8, 0.2],
                transition: { duration: 2 },
            }}
            transition={{ repeat: Infinity }}
            ></motion.div>
            <button className="btn relative rounded-2xl bg-black px-7 py-4 text-white">Open</button>
        </motion.div>
        </div>
    );
};

export default GlowButton;
