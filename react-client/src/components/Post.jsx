/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowUpTrayIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";

const Post = ({ id, title, owner_id, owner_name, topic_id, content, num_likes, num_comments, topic_name }) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  if (!num_likes) {
    num_likes = 0;
  }
  if(!num_comments) {
    num_comments = 0;
  }

  const text =
    "If a dog chews shoes whose shoes does he choose? If the text is long, it will fade downwards. Click to expand...";

  return (
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
          <button
            className="btn btn-ghost"
            onClick={() => alert(`Edit post ${id}`)}
          >
            <EllipsisVerticalIcon className="w-5 h-5" />
          </button>
        </div>
        <h2 className="card-title text-xl md:text-2xl font-semibold mb-2">
          {title}
        </h2>
        <motion.p
          className={`mt-2 ${
            text.length > 400 ? (expanded ? "" : "line-clamp-3 cursor-pointer") : ""
          }`}
          onClick={text.length > 400 ? toggleExpansion : undefined}
        >
          {content}
        </motion.p>
        <div className="flex items-center space-x-4 mt-2">
          <div className="bg-info text-base-300 rounded-2xl font-bold text-sm flex items-center justify-center">
            <button className="btn btn-ghost mr-2 rounded-2xl w-4 h-4">
              <ArrowUpIcon className="stroke-2 w-4 h-4 fill-base-300" />
            </button>
            {num_likes}
            <button className="btn btn-ghost ml-2 rounded-2xl w-4 h-4">
              <ArrowDownIcon className="stroke-2 w-4 h-4 fill-base-300" />
            </button>
          </div>
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
  );
};

export default Post;
