/* eslint-disable no-unused-vars */
// auth/AuthContext.js
import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

const useAuth = () => {
    return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (email, password) => {
        try {
        // Make a request to your Flask API for login
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            // Set the user in the context or local storage
            setUser(data.access_token);
        } else {
            throw new Error("Login failed");
        }
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const logout = () => {
        // Implement logout logic if needed
        setUser(null);
    };

    const value = {
        user,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider, useAuth };

