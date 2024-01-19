/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion as m } from "framer-motion";
import { ToastProvider } from "../components/Toast";
import useLoading from "../hooks/useLoading";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const [handleLogin, loading] = useLoading(
        async () => {
            await login(email, password);
        },
        { minDuration: 1000, navigateFunction: () => navigate("/") }
    );

    return (
        <m.div
        className="w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.75 }}
        >
            <div className="flex flex-col items-center mt-4 ">
                <div className="card bg-base-100 mt-2 ml-4 mr-4 z-40">
                    <div className="card-body shadow-2xl rounded-2xl space-y-5">
                    <h2 className="card-title text-4xl font-semibold mb-4 self-center">
                        Login
                    </h2>
                    <div className="grid grid-rows-2 gap-4">
                        <div className="flex flex-col">
                        <label
                            htmlFor="email"
                            className="text-sm font-mediummb-1"
                        >
                            Email
                        </label>
                        <input
                            type="text"
                            id="email"
                            placeholder="Enter your email"
                            className="input input-primary input-md w-full max-w-md bg-base-100"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        </div>
                        <div className="flex flex-col">
                        <label
                            htmlFor="password"
                            className="text-sm font-medium mb-1"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            className="input input-primary input-md w-full max-w-md bg-base-100"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        </div>
                    </div>
                    <div className="card-action">
                        <button
                        className="btn btn-primary rounded-2xl btn-wide"
                        onClick={handleLogin}
                        disabled={loading}
                        >
                        {loading ? (
                            <div className="loading loading-dots" />
                        ) : (
                            "Login"
                        )}
                        </button>
                    </div>
                    </div>
                </div>
            </div>
        </m.div>
    );
};

export default Login;
