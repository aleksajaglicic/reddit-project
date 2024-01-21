// eslint-disable-next-line no-unused-vars
import React, { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { MagnifyingGlassIcon, Bars2Icon } from "@heroicons/react/20/solid"
import { useNavigate } from "react-router-dom"
interface NavbarProps {
    style?: React.CSSProperties & {
        "--navbar-bg"?: string;
    };
}

const Navbar: React.FC<NavbarProps> = ({ style }) => {
    const [searchResults, setSearchResults] = useState([]);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
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

    const handleLogoutClick = () => {
        logout()
        navigate("/");
    }

    const handleSearch = () => {
        console.log("Search query:", searchQuery);

        fetch(`http://localhost:5000/sort_search_topics`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sort_type: "default", search_query: searchQuery }),
        })
        .then(response => response.json())
        .then(data => {
            console.log("Search results:", data.topics);
            setSearchResults(data.topics); // Set search results in state
            navigate('/search', { state: { searchResults: data.topics } }); // Navigate to search page
        })
        .catch(error => console.error("Error during search:", error));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div 
        className="navbar 
            fixed bg-base-300 
            border-b border-base-300 
            border-opacity-75
            bg-opacity-7
            w-full z-50"
            style={style}>
            <div className="navbar-start">
                <img 
                    className="w-7 p-1 ml-2 cursor-pointer" 
                    onClick={handleLogoClick} 
                    src="/reddit-4.svg" 
                    alt="Logo" />
                <a className="text-xl pl-1 pr-1 cursor-pointer hidden md:flex" onClick={handleLogoClick}>PReddit</a>
                <label htmlFor="my-drawer" className="btn btn-ghost w-5 h-5">
                    <Bars2Icon className="w-5 h-5 text-gray-400 ml-4" />
                </label>
            </div>
            <div className="relative w-full">
            <input
                type="text"
                placeholder="Search PReddit"
                className="input input-bordered rounded-2xl text-center w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
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
                                <a className="justify-between">My Profile
                                </a>
                            </li>
                            <li><a className="text-red-500" onClick={handleLogoutClick}>Logout</a></li>
                        </ul>
                    </div>
                ) : (
                    <>
                        <div className="mr-1 space-x-2 hidden md:flex">
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
