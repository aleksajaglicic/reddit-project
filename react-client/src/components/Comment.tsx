/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/20/solid";

interface ReplyProps {
  id: string;
  text: string;
  user_id: string;
  post_id: string;
  num_likes?: number;
  owner_name: string;
  replies?: Comment[];
}

interface CommentProps {
  id: string;
  text: string;
  user_id: string;
  post_id: string;
  num_likes?: number;
  owner_name: string;
  replies?: ReplyProps[];
}

const Comment: React.FC<CommentProps> = ({ id, text, user_id, post_id, num_likes, owner_name, replies = []}) => {
  const { user } = useAuth();
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasDownvoted, setHasDownvoted] = useState(false);
  const [likesCount, setLikesCount] = useState(num_likes ?? 0);
  const [isUsersPost, setIsUsersPost] = useState(false);

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

  const handleCommentDeletion = async () => {
    try {
        const authToken = localStorage.getItem('access_token');
        if (user) {
            const response = await fetch('http://localhost:5000/delete_comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ user_id: user.id, comment_id: id, topic_id }),
            });

            if (response.ok) {
                console.log('User successfully deleted the comment');
            } else {
                const errorData = await response.json();
                console.error('Error during deletion:', errorData);
            }
        }
    } catch (error) {
        console.error('Error during deletion:', error);
    }
  };

  useEffect(() => {
    if (user?.id === String(user_id)) {
      setIsUsersPost(true);
    } else {
      setIsUsersPost(false);
    }
  }, [user, id]);

  const checkCommentVote = async () => {
    try {
      const authToken = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:5000/check_comment_vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ comment_id: id }),
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.vote_status === 'upvoted') {
          setHasUpvoted(true);
          setHasDownvoted(false);
        } else if (data.vote_status === 'downvoted') {
          setHasUpvoted(false);
          setHasDownvoted(true);
        } else {
          setHasUpvoted(false);
          setHasDownvoted(false);
        }
  
        setLikesCount(data.likes_count || 0);
      }
    } catch (error) {
      console.error('Error checking comment vote:', error);
    }
  };
  
  useEffect(() => {
    checkCommentVote();
  }, [id]);

  return (
    <motion.div
      className="card w-full bg-base-100 rounded-2xl overflow-hidden"
      initial={{ height: "fit-content", backgroundSize: "70% 100%" }}
      transition={{ duration: 0.3 }}
    >
      <div className="card-body">
        <p className="text-sm mb-4">Comment by: {owner_name}</p>
        <div className="flex items-center space-x-4">
          <div className="bg-info text-base-300 rounded-2xl font-bold text-sm flex items-center justify-center">
            {isUsersPost ? (
              <div className="dropdown dropdown-top">
                <button
                  className="btn btn-ghost">
                  <EllipsisVerticalIcon className="w-5 h-5 fill-base-300" />
                </button>
                <ul
                  tabIndex={0}
                  className="menu 
                      menu-sm 
                      dropdown-content 
                      mt-3 z-[1] 
                      p-2 shadow 
                      bg-base-300 
                      rounded-box w-52">
                  <li><a className="text-red-500" onClick={handleCommentDeletion}>Delete</a></li>
                </ul>
              </div>
            ) : ""}
            {user ? (
              <div className="flex items-center space-x-2">
                <button
                  className={`btn btn-ghost rounded-2xl w-4 h-4 ${
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
                  className={`btn btn-ghost rounded-2xl w-4 h-4 ${
                    hasDownvoted ? 'text-error' : ''
                  }`}
                  onClick={handleDownvote}
                >
                  <ArrowDownIcon
                    className={`stroke-2 w-4 h-4 ${hasDownvoted ? 'fill-red-700' : 'fill-base-300'}`}
                  />
                </button>
              </div>
            ) : (
              <button className="btn btn-info" aria-readonly>Number of likes: {num_likes}</button>
            )}
          </div>
          <div className="flex-grow">
            <p className="text-base">{text}</p>
            {replies && replies.length > 0 && (
              <div className="ml-4">
                {replies.map((reply) => (
                  <Comment
                    key={reply.id}
                    id={reply.id}
                    text={reply.text}
                    user_id={reply.user_id}
                    post_id={reply.post_id}
                    num_likes={reply.num_likes}
                    owner_name={reply.owner_name}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Comment;