/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const useAuth = () => {
    const { user, login, logout } = useContext(AuthContext);
    return { user, login, logout };
};

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // useEffect(() => {
    //     const storedToken = localStorage.getItem("access_token");

    //     if (storedToken) {
    //         try {
    //             const decodedToken = jwtDecode(storedToken);
    //             console.log("Decoded Token:", decodedToken);
    //             checkTokenExpiration(decodedToken.exp)

    //             const { user: decodedUser } = decodedToken;

    //             setUser(decodedToken);
    //             console.log("Decoded User:", decodedUser);
    //         } catch (error) {
    //             console.error("Error decoding token:", error);
    //         }
    //     }
    // }, []);

        
    useEffect(() => {
        const storedToken = localStorage.getItem("access_token");
        const storedUser = localStorage.getItem("user");

        if (storedToken) {
            try {
                const decodedToken = jwtDecode(storedToken);

                if (decodedToken.exp * 1000 < Date.now()) {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("user");
                    setUser(null);
                    return;
                }

                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, []);

    const checkTokenExpiration = (exp) => {
        const currentTime = Date.now() / 1000;
    
        if (exp && currentTime > exp) {
            logout();
        }
    };

    const login = async (email, password) => {
        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("access_token", data.access_token);
                localStorage.setItem("user", JSON.stringify(data.user));
                setUser(data.user);
            } else {
                throw new Error("Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("access_token");
        console.log("removed token");
    };

    const value = {
        user,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider, useAuth };
