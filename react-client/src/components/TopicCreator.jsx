/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { useToast } from "../components/Toast"

const TopicCreator = () => {
    const [description, setDescription] = useState('');
    // const toast = useToast
    const handleDescriptionChange = (event) => {
        const limitedDescription = event.target.value.slice(0, 200);
        setDescription(limitedDescription);
    };

    const toast = useToast();

    const handleCreateCommunity = async () => {
        try {
            // Your logic for creating a community

            // For example, if there's an error:
            throw new Error('Community creation failed');
        } catch (error) {
        toast({
            title: 'Error',
            description: 'Community creation failed. Please try again.',
            variant: 'error',
        });
        }
    };

    return (
        <div className="card w-full h-fit bg-base-300 border border-gray-400 rounded-2xl relative">
            <div className="card-body">
                <div className="card-title text-4xl">Create a community!</div>
                <div className="mt-2 space-y-4">
                    <div className="flex flex-col">
                        <label htmlFor="communityName" className="text-sm font-medium text-gray-400 mb-1">
                            Community Name
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-1 pl-2 flex items-center text-gray-400 text-sm opacity-50">
                                pr/
                            </span>
                            <input
                                type="text"
                                id="communityName"
                                name="communityName"
                                className="input input-bordered pl-8 text-sm"
                                placeholder="Enter community name"
                                maxLength={16}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-400 mb-1">
                        Description
                        </label>
                        <textarea
                        rows="4"
                        maxLength={200}
                        value={description}
                        className="textarea textarea-bordered"
                        placeholder="Enter community description"
                        onChange={handleDescriptionChange}
                        style={{resize: "none"}} />
                    </div>
                    <button
                        className=" btn btn-primary w-xs" onClick={handleCreateCommunity}>
                        Create Community
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TopicCreator