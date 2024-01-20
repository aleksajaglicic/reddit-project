import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/20/solid';
import { useAuth } from '../contexts/AuthContext';

interface CommentProps {
  id: string;
  text: string;
  user_id: string;
  post_id: string;
  num_likes?: number;
  owner_name: string;
  replies?: Comment[];
}


const Comment: React.FC<CommentProps> = ({ id, text, user_id, post_id, num_likes, owner_name, replies }) => {
  const { user } = useAuth();
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasDownvoted, setHasDownvoted] = useState(false);
  const [likesCount, setLikesCount] = useState(num_likes ?? 0);

  const handleUpvote = async () => {
    try {
      const authToken = localStorage.getItem('access_token');
      await fetch(`http://localhost:5000/upvote_comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ user_id: user?.id, comment_id: id }),
      });

      setHasUpvoted(!hasUpvoted);
      setLikesCount(hasUpvoted ? likesCount - 1 : likesCount + 1);
    } catch (error) {
      console.error('Error upvoting comment:', error);
    }
  };

  const handleDownvote = async () => {
    try {
      const authToken = localStorage.getItem('access_token');
      await fetch(`http://localhost:5000/downvote_comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ comment_id: id }),
      });

      setHasDownvoted(!hasDownvoted);
      setLikesCount(hasDownvoted ? likesCount + 1 : likesCount - 1);
    } catch (error) {
      console.error('Error downvoting comment:', error);
    }
  };

  return (
    <motion.div
      className="card w-full bg-base-100 rounded-2xl overflow-hidden mb-4"
      initial={{ height: 'fit-content', backgroundSize: '70% 100%' }}
    >
      <div className="card-body">
        <div className="flex items-center space-x-4">
          <div className="bg-info text-base-300 rounded-2xl font-bold text-sm flex items-center justify-center">
            <button
              className={`btn btn-ghost mr-2 rounded-2xl w-4 h-4 ${
                hasUpvoted ? 'fill-red-700' : 'fill-base-300'
              }`}
              onClick={handleUpvote}
            >
              <ArrowUpIcon
                className={`stroke-2 w-4 h-4 ${hasUpvoted ? 'fill-red-700' : 'fill-base-300'}`}
              />
            </button>
            {likesCount}
            <button
              className={`btn btn-ghost ml-2 rounded-2xl w-4 h-4 ${
                hasDownvoted ? 'text-error' : ''
              }`}
              onClick={handleDownvote}
            >
              <ArrowDownIcon
                className={`stroke-2 w-4 h-4 ${hasDownvoted ? 'fill-red-700' : 'fill-base-300'}`}
              />
            </button>
          </div>
          <div className="flex-grow">
            <p className="text-base">{text}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Comment;
