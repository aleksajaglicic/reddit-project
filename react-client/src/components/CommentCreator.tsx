/* eslint-disable no-unused-vars */
import React, { useState, ChangeEvent } from 'react';
import { useToast } from './Toast';
import { v4 as uuidv4 } from 'uuid';

interface CommentCreatorProps {
    user_id: string;
    post_id: string;
    topic_id: string;
    }

    const CommentCreator: React.FC<CommentCreatorProps> = ({ user_id, post_id, topic_id }) => {
    const [text, setText] = useState('');
    const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const limitedText = event.target.value.slice(0, 300);
        setText(limitedText);
    };

    const toast = useToast();

    const handleCreateComment = async () => {
        try {
        const authToken = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:5000/create_comment', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({ text, user_id, post_id, topic_id }),
        });

        if (response.ok) {
            console.log('Comment created successfully');
            toast({
            title: 'Success',
            description: 'Comment created successfully',
            variant: 'success',
            });
        } else {
            throw new Error('Failed to create comment');
        }
        } catch (error) {
        console.error('Error creating comment:', error);
        toast({
            title: 'Error',
            description: 'Failed to create comment. Please try again.',
            variant: 'error',
        });
        }
    };

    return (
        <div className="container items-center max-w-7xl mx-auto mt-4 bg-base-100 rounded-2xl">
        <div className="card-body min-w-fit">
            <div className="card-title text-4xl">Post a comment!</div>
            <div className="mt-4 space-y-4">
                <div className="flex flex-col">
                    <textarea
                        rows={4}
                        maxLength={300}
                        value={text}
                        className="textarea textarea-bordered h-30 bg-base-300 max-w-full"
                        placeholder="Write your comment!"
                        onChange={handleTextChange}
                        style={{ resize: 'none' }}
                    />
                </div>
            <button
                className="btn btn-primary rounded-2xl w-xs"
                onClick={handleCreateComment}
            >
                Create Comment
            </button>
            </div>
        </div>
        </div>
    );
};

export default CommentCreator;
