/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Navigate, redirect, useNavigate } from 'react-router-dom';

const Login = () => {
    //const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            email: email,
            password: password,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            const accessToken = data.access_token;

            // Store the access token in local storage
            localStorage.setItem('access_token', accessToken);

            //history.push('/');
            navigate('/');
            //redirect('*');
        } else {
            console.error('Login failed');
        }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
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
    );
};

export default Login;

