/* eslint-disable no-unused-vars */
import React, { ChangeEvent, useState } from "react";
import { motion as m } from "framer-motion";
import { useToast } from "../components/Toast";

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        last_name: '',
        address: '',
        city: '',
        phone_number: '',
        email: '',
        password: '',
    });

    const toast = useToast();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [id]: value }));
    };

    const handleRegister = async () => {
        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('Registration successful');
            } else {
                const errorData = await response.json();
                toast({
                    title: 'Error',
                    description: errorData.error || 'Registration failed',
                    variant: 'error',
                });
            }
        } catch (error) {
            console.error('Error during registration:', error);
            toast({
                title: 'Error',
                description: 'An error occurred during registration',
                variant: 'error',
            });
        }
    };

    return (
            <m.div className="w-full" initial={{ opacity: 0}} animate={{ opacity: 1 }} transition= {{ duration: 0.75}}>
                <div className="flex flex-col items-center mt-4">
                    <div className="card bg-base-100 mt-2 ml-4 mr-4">
                        <div className="card-body items-center shadow-2xl rounded-2xl space-y-5">
                            <h2 className="card-title text-4xl font-semibold self-center mb-4">Register</h2>
                            <div className='grid grid-cols-2 gap-4'>
                                <div className="flex flex-col">
                                    <label htmlFor="name" className="text-sm font-medium mb-1">First Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        placeholder="Enter your first name"
                                        className="input input-secondary input-md w-full max-w-md bg-base-100"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="last_name" className="text-sm font-medium mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        id="last_name"
                                        placeholder="Enter your last name"
                                        className="input input-secondary input-md w-full max-w-md bg-base-100"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="address" className="text-sm font-medium mb-1">Address</label>
                                    <input
                                        type="text"
                                        id="address"
                                        placeholder="Enter your address"
                                        className="input input-secondary input-md w-full max-w-md bg-base-100"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="city" className="text-sm font-medium mb-1">City</label>
                                    <input
                                        type="text"
                                        id="city"
                                        placeholder="Enter your city"
                                        className="input input-secondary input-md w-full max-w-md bg-base-100"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="phone_number" className="text-sm font-medium mb-1">Phone Number</label>
                                    <input
                                        type="text"
                                        id="phone_number"
                                        placeholder="Enter your phone number"
                                        className="input input-secondary input-md w-full max-w-md bg-base-100"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="email" className="text-sm font-medium mb-1">Email</label>
                                    <input
                                        type="text"
                                        id="email"
                                        placeholder="Enter your email"
                                        className="input input-secondary input-md w-full max-w-md bg-base-100"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="password" className="text-sm font-medium mb-1">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        placeholder="Enter your password"
                                        className="input input-secondary input-md w-full max-w-md bg-base-100"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="card-action">
                                <button className="btn btn-secondary btn-wide rounded-2xl" onClick={handleRegister}>Register</button>
                            </div>
                        </div>
                    </div>
                </div>
            </m.div>
    )
}

export default Register