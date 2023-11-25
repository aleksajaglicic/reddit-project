// eslint-disable-next-line no-unused-vars
import React from "react"
import { useAuth } from "../contexts/AuthContext"
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid"
import { useNavigate } from "react-router-dom"

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    console.log("User in Navbar:", user);

    const handleLoginClick = () => {
        navigate("/login");
    }

    const handleRegisterClick = () => {
        navigate("/register");
    }

    const handleLogoClick = () => {
        navigate("/");
    }

    return (
        <div 
        className="navbar 
            fixed bg-base-300 
            border-b border-base-300 
            border-opacity-75
            bg-opacity-7
            w-full z-50"
            style={{ "--navbar-bg": "var(--bg-base-300)" }}>
            <div className="navbar-start">
                <img 
                    className="w-7 p-1 ml-2 cursor-pointer" 
                    onClick={handleLogoClick} 
                    src="/reddit-4.svg" 
                    alt="Logo" />
                <a className="text-xl pl-1 cursor-pointer" onClick={handleLogoClick}>PReddit</a>
            </div>
            <div className="relative w-full">
                <input
                    type="text"
                    placeholder="Search PReddit"
                    className="input input-bordered rounded-2xl text-center w-full"
                />
                <MagnifyingGlassIcon className="absolute space-x-2 w-5 h-5 text-gray-400 ml-2" />
            </div>
            <div className="navbar-end bg-opacity-100 space-x-2 lg: flex">
                {user ? (
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full border border-gray-600">
                                <p>{user.email}</p>
                            </div>
                        </label>
                        <ul
                        tabIndex={0}
                        className="menu 
                            menu-sm 
                            dropdown-content 
                            mt-3 z-[1] 
                            p-2 shadow 
                            bg-base-300 
                            rounded-box w-52">
                            <li>
                                <a className="justify-between">
                                    {user.email}
                                </a>
                            </li>
                            <li><a>My Threads</a></li>
                            <li><a>My Posts</a></li>
                            <li><a className="text-red-500" onClick={logout}>Logout</a></li>
                        </ul>
                    </div>
                ) : (
                    <>
                        <div className="mr-1 space-x-2">
                        <a className="btn btn-primary rounded-2xl w-13" onClick={handleLoginClick}>Login</a>
                        <a className="btn btn-secondary rounded-2xl w-13" onClick={handleRegisterClick}>Register</a>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Navbar;
