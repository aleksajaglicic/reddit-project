// eslint-disable-next-line no-unused-vars
import React from "react"
import { useAuth } from "../contexts/AuthContext";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid"

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <div className="navbar fixed bg-base-300 bg-opacity-30 w-full z-50">
            <div className="navbar-start">
                <img className="w-7 p-1 ml-2" src="/reddit-4.svg" alt="Logo" />
                <a className="text-xl pl-1">PReddit</a>
            </div>
            <div className="relative w-full">
                <input
                    type="text"
                    placeholder="Search PReddit"
                    className="input input-bordered rounded-2xl text-center w-full"
                />
                <MagnifyingGlassIcon className="absolute space-x-2 w-5 h-5 text-gray-400 ml-2" />
            </div>
            <div className="navbar-end bg-opacity-100 space-x-2 lg:flex">
                {user ? (
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img alt="User avatar" src={user.avatar} />
                            </div>
                        </label>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-300 rounded-box w-52">
                            <li>
                                <a className="justify-between">
                                    {user.username}
                                    <span className="badge">New</span>
                                </a>
                            </li>
                            <li><a>My Threads</a></li>
                            <li><a>My Posts</a></li>
                            <li><a onClick={logout}>Logout</a></li>
                        </ul>
                    </div>
                ) : (
                    <>
                        <div className="mr-1 space-x-2">
                        <a className="btn btn-primary rounded-2xl w-13">Login</a>
                        <a className="btn btn-secondary rounded-2xl w-13">Register</a>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Navbar;
