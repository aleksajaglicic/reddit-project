/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowUpTrayIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/20/solid";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface PostProps {
  id: string;
  title: string;
  owner_id: string;
  owner_name: string;
  topic_id: string;
  content: string;
  num_likes?: number;
  num_comments?: number;
  topic_name: string;
}

const Post: React.FC<PostProps> = ({
  id,
  title,
  owner_id,
  owner_name,
  topic_id,
  content,
  num_likes,
  num_comments,
  topic_name,
}) => {
  const { user } = useAuth()
  const [expanded, setExpanded] = useState(false);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasDownvoted, setHasDownvoted] = useState(false);
  const [isUsersPost, setIsUsersPost] = useState(false);
  const [likesCount, setLikesCount] = useState(num_likes ?? 0);
  const [truncated, setTruncated] = useState(true);
  const navigate = useNavigate();

    const toggleExpansion = () => {
      setExpanded(!expanded);
    };

    const handleUpvote = async () => {
      try {
        const authToken = localStorage.getItem('access_token');
        await fetch(`http://localhost:5000/upvote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify({ user_id: user?.id, post_id: id }),
        });
        setHasUpvoted(!hasUpvoted);
        
        setLikesCount(hasUpvoted ? likesCount - 1 : likesCount + 1);
      } catch (error) {
        console.error("Error upvoting post:", error);
      }
    };
    
    const handleDownvote = async () => {
      try {
        const authToken = localStorage.getItem('access_token');

        await fetch(`http://localhost:5000/downvote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,

          },
          body: JSON.stringify({ post_id: id }),
        });
        setHasDownvoted(!hasDownvoted);
        setLikesCount(hasDownvoted ? likesCount + 1 : likesCount - 1);
      } catch (error) {
        console.error("Error downvoting post:", error);
      }
    };
    
    const handlePostDeletion = async () => {
      try {
          const authToken = localStorage.getItem('access_token');
          if (user) {
              const response = await fetch('http://localhost:5000/delete_post', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${authToken}`,
                  },
                  body: JSON.stringify({ user_id: user.id, post_id: id }),
              });

              if (response.ok) {
                  console.log('User successfully deleted the post');
                  navigate(`/pr/${topic_name}`);

              } else {
                  const errorData = await response.json();
                  console.error('Error during deletion:', errorData);
              }
          }
      } catch (error) {
          console.error('Error during deletion:', error);
      }
    } 

    useEffect(() => {
      const contentElement = document.getElementById(`content-${id}`);
  
      if (contentElement) {
        setTruncated(contentElement.scrollHeight > contentElement.clientHeight);
      }
    }, [content, truncated, id]);

    const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const target = e.target as HTMLElement;
      
      if (
        !target.closest(".btn") &&
        !target.closest(".dropdown") &&
        !target.closest(".text-sm.underline")
      ) {
        navigate(`/pr/${topic_name}/${id}`);
      }
    };
  
    const checkUserVote = async () => {
      try {
        if (!user) {
          return;
        }
  
        const authToken = localStorage.getItem('access_token');
        const response = await fetch(`http://localhost:5000/check_vote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify({ user_id: user?.id, post_id: id }),
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
        } else {
          console.error('Error checking user vote:', response.status);
        }
      } catch (error) {
        console.error('Error checking user vote:', error);
      }
    };

    useEffect(() => {
      checkUserVote();
    }, [user, id]);

  return (
    // <Link to={`/pr/${topic_name}/${id}`}>
    <div className="post-background" onClick={handleBackgroundClick}>
      <motion.div
        className="card w-full bg-base-100 rounded-2xl overflow-hidden"
        initial={{ height: "fit-content", backgroundSize: "70% 100%" }}
        animate={{ height: expanded ? "auto" : "fit-content" }}
        transition={{ duration: 0.3 }}
      >
        <div className="card-body">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Link to={`/pr/${topic_name}`} className="text-sm underline">
                pr/{topic_name}
              </Link>
              <span className="mx-1 text-xs">•</span>
              <p className="text-sm">Published by: {owner_name}</p>
            </div>
            {isUsersPost ? (
              <div className="ml-4 mt-4 dropdown dropdown-end">
                <button
                    className="btn btn-ghost">
                    <EllipsisVerticalIcon className="w-5 h-5" />
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
                        <li><a className="text-red-500" onClick={handlePostDeletion}>Delete</a></li>
                    </ul>
                </div>
            ) : ""}
          </div>
          <h2 className="card-title text-xl md:text-2xl font-semibold mb-4">
            {title}
          </h2>
          <motion.p
            id={`content-${id}`}
            className={`mt-2 mb-4 ${
              truncated ? "cursor-pointer" : ""
            }`}
            onClick={toggleExpansion}
          >
            {content}
          </motion.p>
          <div className="flex items-center space-x-4 mt-2">
            {user ? (
              <div className="bg-info text-base-300 rounded-2xl font-bold text-sm flex items-center justify-center">
                <button
                  className={`btn btn-ghost mr-2 rounded-2xl w-4 h-4 ${
                    hasUpvoted ? "fill-red-700" : "fill-base-300"
                  }`}
                  onClick={handleUpvote}
                >
                  <ArrowUpIcon className={`stroke-2 w-4 h-4 ${hasUpvoted ? "fill-red-700" : "fill-base-300"}`} />
                </button>
                {likesCount}
                <button
                  className={`btn btn-ghost ml-2 rounded-2xl w-4 h-4 ${
                    hasDownvoted ? "text-error" : ""
                  }`}
                  onClick={handleDownvote}
                >
                  <ArrowDownIcon className={`stroke-2 w-4 h-4 ${hasDownvoted ? "fill-red-700" : "fill-base-300"}`} />
                </button>
              </div>
            ) : (
              <button className="btn btn-info" aria-readonly>Number of likes: {num_likes}</button>
            )}
            <button className="btn btn-secondary rounded-2xl">
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
              <p className="hidden md:flex">{num_comments} Comments</p>
            </button>
            <button className="btn btn-accent rounded-2xl">
              <ArrowUpTrayIcon className="w-5 h-5 fill-base-300" />
              <p className="hidden md:flex">Share</p>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Post;
