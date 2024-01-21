import React, { ChangeEvent, useEffect, useState } from "react";
import { motion as m } from "framer-motion";
import { useToast } from "../components/Toast";

interface UserData {
    id: string;
    name: string;
    last_name: string;
    address: string;
    city: string;
    phone_number: string;
    email: string;
    password: string;
}

const initialFormData: UserData = {
    id: '',
    name: '',
    last_name: '',
    address: '',
    city: '',
    phone_number: '',
    email: '',
    password: '',
};

const Profile: React.FC = () => {
    const [fetchedData, setFetchedData] = useState<UserData | null>(null);
    const [formData, setFormData] = useState(initialFormData);

    const toast = useToast();

    useEffect(() => {
        // Fetch existing user data and update the fetchedData state
        const fetchUserData = async () => {
            try {
                const authToken = localStorage.getItem('access_token');
                const response = await fetch('http://localhost:5000/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                });

                if (response.ok) {
                    const userData = await response.json();
                    console.log("This is user data: ", userData);
                    setFetchedData(userData);
                } else {
                    const errorData = await response.json();
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        // Update the form data with fetched data
        if (fetchedData && fetchedData.user) {
            setFormData(fetchedData.user);
        }
    }, [fetchedData]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [id]: value }));
    };

    const handleUpdateProfile = async () => {
        try {
            const authToken = localStorage.getItem('access_token');
            const response = await fetch('http://localhost:5000/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast({
                    title: 'Success',
                    description: 'Profile updated successfully',
                    variant: 'success',
                });
            } else {
                const errorData = await response.json();
                // Handle error if needed
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            // Handle error if needed
        }
    };

    return (
        <m.div className="w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.75 }}>
            <div className="flex flex-col items-center mt-4">
                <div className="card bg-base-100 mt-2 ml-4 mr-4">
                    <div className="card-body items-center shadow-2xl rounded-2xl space-y-5">
                        <h2 className="card-title text-4xl font-semibold self-center mb-4">Edit Profile</h2>
                        <div className='grid grid-cols-2 gap-4'>
                            <div className="flex flex-col">
                                <label htmlFor="name" className="text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    className="input input-secondary input-md w-full max-w-md bg-base-100"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="last_name" className="text-sm font-medium mb-1">Last Name</label>
                                <input
                                    type="text"
                                    id="last_name"
                                    value={formData.last_name}
                                    className="input input-secondary input-md w-full max-w-md bg-base-100"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="address" className="text-sm font-medium mb-1">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    value={formData.address}
                                    className="input input-secondary input-md w-full max-w-md bg-base-100"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="city" className="text-sm font-medium mb-1">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    value={formData.city}
                                    className="input input-secondary input-md w-full max-w-md bg-base-100"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="phone_number" className="text-sm font-medium mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    id="phone_number"
                                    value={formData.phone_number}
                                    className="input input-secondary input-md w-full max-w-md bg-base-100"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="email" className="text-sm font-medium mb-1">Email</label>
                                <input
                                    type="text"
                                    id="email"
                                    value={formData.email}
                                    className="input input-disabled input-md w-full max-w-md bg-base-100"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="password" className="text-sm font-medium mb-1">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={formData.password}
                                    className="input input-disabled input-md w-full max-w-md bg-base-100"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="card-action">
                            <button className="btn btn-secondary btn-wide rounded-2xl" onClick={handleUpdateProfile}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </m.div>
    );
}

export default Profile;
