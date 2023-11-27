/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useToast } from '../components/Toast';
import {v4 as uuidv4} from "uuid"
const PostCreator = ({ userId, topicId }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleDescriptionChange = (event) => {
        const limitedDescription = event.target.value.slice(0, 300);
        setContent(limitedDescription);
    };

    const handlePostTitleChange = (event) => {
        const limitedPostTitle = event.target.value.slice(0, 16);
        setTitle(limitedPostTitle);
    };

    const toast = useToast();

    const handleCreatePost = async () => {
        try {
            const postId = uuidv4();

            //const token = localStorage.getItem('access_token');
            //console.log(token);
            const response = await fetch('http://localhost:5000/create_post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    
                },
                body: JSON.stringify({ postId, title, content, userId, topicId }),
            });

            if (response.ok) {
                console.log('Post created successfully');
            } else {
                throw new Error('Failed to create post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            toast({
                title: 'Error',
                description: 'Failed to create post. Please try again.',
                variant: 'error',
            });
        }
    };

    return (
        <div className="card w-full h-fit bg-base-100 rounded-2xl relative">
            <div className="card-body">
                <div className="card-title text-4xl">Create a post!</div>
                <div className="mt-2 space-y-4">
                    <div className="flex flex-col">
                        <label htmlFor="title" className="text-sm font-medium mb-1">
                            Post Title
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="title"
                                name="title"
                                className="input input-bordered bg-base-300 text-sm"
                                placeholder="Enter post title"
                                maxLength={18}
                                value={title}
                                onChange={handlePostTitleChange}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">
                            Content
                        </label>
                        <textarea
                            rows="4"
                            maxLength={200}
                            value={content}
                            className="textarea textarea-bordered h-11 bg-base-300"
                            placeholder="Enter community description"
                            onChange={handleDescriptionChange}
                            style={{ resize: 'none' }}
                        />
                    </div>
                    <button
                        className="btn btn-primary w-xs"
                        onClick={handleCreatePost}
                    >
                        Create Post
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostCreator;
