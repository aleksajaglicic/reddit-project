import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface User {
  // Define your user properties here
    id: string;
    email: string;
  // Add other properties as needed
}

interface AuthContextValue {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("access_token");
        const storedUser = localStorage.getItem("user");

        if (storedToken) {
        try {
            const decodedToken = jwtDecode(storedToken);

            if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
            setUser(null);
            return;
            }

            if (storedUser) {
            setUser(JSON.parse(storedUser) as User);
            }
        } catch (error) {
            console.error("Error decoding token:", error);
        }
        }
    }, []);

    const checkTokenExpiration = (exp: number) => {
        const currentTime = Date.now() / 1000;

        if (exp && currentTime > exp) {
        logout();
        }
    };

    const login = async (email: string, password: string) => {
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

    const value: AuthContextValue = {
        user,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    };

    const useAuth = (): AuthContextValue => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export { AuthProvider, useAuth };
