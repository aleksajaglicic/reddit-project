/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion as m } from "framer-motion";
import { ToastProvider } from "../components/Toast";

const NotFound = () => {
    const navigate = useNavigate();
    const handleHome = async () => {
        try {
            navigate("/");
        } catch (error) {
            console.error("Login failed");
        }
    };
    return (
        <m.div className="w-full"
            initial={{ opacity: 0}} animate={{ opacity: 1 }} transition= {{ duration: 0.75}}>
                <div className="flex flex-col items-center mt-4 ">
                    <div className="card bg-base-100 mt-2 ml-4 mr-4 z-40">
                        <div className="card-body shadow-2xl rounded-2xl space-y-5">
                            <h2 className="card-title text-4xl font-semibold mb-1 self-center">404</h2>
                            <h2 className="text-2xl font-semibold mb-4 self-center">NOT FOUND</h2>
                            <div className="card-action">
                                <button
                                    className="btn btn-primary rounded-2xl btn-wide"
                                    onClick={handleHome}>
                                    Back to Home
                                </button>
                            </div>
                        </div>           
                    </div>
                </div>
        </m.div>
    );
};

export default NotFound;
