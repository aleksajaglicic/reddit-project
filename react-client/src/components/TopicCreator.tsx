/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { useToast } from "./Toast"

const TopicCreator = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const limitedDescription = event.target.value.slice(0, 165);
        setContent(limitedDescription);
    };

    const handleCommunityNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const limitedCommunityName = event.target.value.slice(0, 16);
        setTitle(limitedCommunityName);
    };

    const toast = useToast();

    const handleCreateCommunity = async () => {
        try {
            const token = localStorage.getItem('access_token');
            console.log(token);
            const response = await fetch('http://localhost:5000/create_topic', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ title, content }),
            });

            if (response.ok) {
                console.log('Topic created successfully');
            } else {
                throw new Error('Failed to create topic');
            }
        } catch (error) {
            console.error('Error creating topic:', error);
            toast({
                title: 'Error',
                description: 'Failed to create topic. Please try again.',
                variant: 'error',
            });
        }
    };

    return (
        <div className="card w-full h-fit bg-base-100 rounded-2xl relative">
            <div className="card-body">
                <div className="card-title text-4xl">Create a community!</div>
                <div className="mt-2 space-y-4">
                    <div className="flex flex-col">
                        <label htmlFor="title" className="text-sm font-medium mb-1">
                            Community Name
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-1 pl-2 flex items-center text-sm opacity-50">
                                pr/
                            </span>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                className="input input-bordered bg-base-300 pl-8 text-sm"
                                placeholder="Enter community name"
                                maxLength={18}
                                value={title}
                                onChange={handleCommunityNameChange}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">
                            Description
                        </label>
                        <textarea
                            rows={4}
                            maxLength={200}
                            value={content}
                            className="textarea textarea-bordered h-11 bg-base-300"
                            placeholder="Enter community description"
                            onChange={handleDescriptionChange}
                            style={{ resize: "none" }}
                        />
                    </div>
                    <button
                        className="btn btn-primary w-xs"
                        onClick={handleCreateCommunity}
                    >
                        Create Community
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TopicCreator