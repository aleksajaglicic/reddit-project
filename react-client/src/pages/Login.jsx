/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async () => {
        try {
            await login(email, password);
            navigate("/");
        } catch (error) {
            console.error('Login failed');
        }
    };

    return (
        <div className="card w-screen flex lg:flex min-w-fit bg-base-300 mt-2 ml-4 mr-4 z-40">
            <div className="card-body shadow-2xl rounded-2xl items-center space-y-5">
                <div className="join join-vertical pt-10 pl-10 space-y-3">
                    <input
                        type="text"
                        placeholder="username"
                        className="input input-primary input-md w-full max-w-xs"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="password"
                        className="input input-primary input-md w-full max-w-xs"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleLogin}>Login</button>
                </div>
            </div>
        </div>
    );
};

export default Login;
