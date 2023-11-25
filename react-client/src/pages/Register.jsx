/* eslint-disable no-unused-vars */
import React from 'react';
import { motion as m } from "framer-motion";

const Register = () => {
    return (
        <m.div className="w-full" initial={{ opacity: 0}} animate={{ opacity: 1 }} transition= {{ duration: 0.75}}>
            <div className="flex flex-col items-center w-screen mt-4">
                <div className="card bg-base-300 mt-2 ml-4 mr-4 z-40">
                    <div className="card-body flex flex-col items-center justify-center shadow-2xl rounded-2xl space-y-5">
                        <h2 className="card-title text-4xl font-semibold self-center mb-4">Register</h2>
                        <div className='grid grid-cols-2 gap-4'>
                            <div className="flex flex-col">
                                <label htmlFor="firstName" className="text-sm font-medium text-gray-400 mb-1">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    placeholder="Enter your first name"
                                    className="input input-primary input-md w-full max-w-md bg-base-100"
                                    // onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="lastName" className="text-sm font-medium text-gray-400 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    placeholder="Enter your last name"
                                    className="input input-primary input-md w-full max-w-md bg-base-100"
                                    // onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="address" className="text-sm font-medium text-gray-400 mb-1">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    placeholder="Enter your address"
                                    className="input input-primary input-md w-full max-w-md bg-base-100"
                                    // onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="city" className="text-sm font-medium text-gray-400 mb-1">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    placeholder="Enter your city"
                                    className="input input-primary input-md w-full max-w-md bg-base-100"
                                    // onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    id="phoneNumber"
                                    placeholder="Enter your phone number"
                                    className="input input-primary input-md w-full max-w-md bg-base-100"
                                    // onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="email" className="text-sm font-medium text-gray-400 mb-1">Email</label>
                                <input
                                    type="text"
                                    id="email"
                                    placeholder="Enter your email"
                                    className="input input-primary input-md w-full max-w-md bg-base-100"
                                    // onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="password" className="text-sm font-medium text-gray-400 mb-1">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Enter your password"
                                    className="input input-primary input-md w-full max-w-md bg-base-100"
                                    // onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="card-action">
                            <button className="btn btn-primary btn-wide rounded-2xl">Register</button>
                        </div>
                    </div>
                </div>
            </div>
        </m.div>
    )
}

export default Register