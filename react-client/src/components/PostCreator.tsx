/* eslint-disable no-unused-vars */
import React, { useState, ChangeEvent } from 'react';
import { useToast } from './Toast';
import {v4 as uuidv4} from "uuid"

interface PostCreatorProps {
    owner_id: string;
    topic_id: string;
}

const PostCreator: React.FC<PostCreatorProps> = ({ owner_id, topic_id }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const limitedDescription = event.target.value.slice(0, 300);
        setContent(limitedDescription);
    };
    
    const handlePostTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const limitedPostTitle = event.target.value.slice(0, 16);
        setTitle(limitedPostTitle);
    };

    const toast = useToast();

    const handleCreatePost = async () => {
        try {
            const post_id = uuidv4();

            //const token = localStorage.getItem('access_token');
            //console.log(token);
            const response = await fetch('http://localhost:5000/create_post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    
                },
                body: JSON.stringify({ post_id, title, content, owner_id, topic_id }),
            });

            if (response.ok) {
                console.log('Post created successfully');
                toast({
                    title: 'Success',
                    description: 'Post created successfully',
                    variant: 'success',
                });
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
        <div className="container items-center max-w-7xl mx-auto mt-4 bg-base-100 rounded-2xl">
            <div className="card-body min-w-fit">
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
                            rows={4}
                            maxLength={200}
                            value={content}
                            className="textarea textarea-bordered h-30 bg-base-300 max-w-full"
                            placeholder="Write your post!"
                            onChange={handleDescriptionChange}
                            style={{ resize: 'none' }}
                        />
                    </div>
                    <button
                        className="btn btn-primary rounded-2xl w-xs"
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
