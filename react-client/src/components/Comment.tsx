import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EllipsisVerticalIcon, ArrowUpIcon, ArrowDownIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/20/solid';

type CommentProps = {
  id: string;
  text: string;
  user_name: string;
  likes: number;
  replies: CommentProps[];
  onReply?: () => void;
};

const Comment: React.FC<CommentProps> = ({ id, text, user_name, likes, replies, onReply }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  return (
    <motion.div
      className="card w-full bg-base-100 rounded-2xl overflow-hidden"
      initial={{ height: 'fit-content', backgroundSize: '70% 100%' }}
      animate={{ height: expanded ? 'auto' : 'fit-content' }}
      transition={{ duration: 0.3 }}
    >
      <div className="card-body">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <p className="text-sm">User: {user_name}</p>
          </div>
          <button className="btn btn-ghost" onClick={() => alert(`Edit comment ${id}`)}>
            <EllipsisVerticalIcon className="w-5 h-5" />
          </button>
        </div>
        <motion.p
          className={`mt-2 ${
            text.length > 400 ? (expanded ? '' : 'line-clamp-3 cursor-pointer') : ''
          }`}
          onClick={text.length > 400 ? toggleExpansion : undefined}
        >
          {text}
        </motion.p>
        <div className="flex items-center space-x-4 mt-2">
          <div className="bg-info text-base-300 rounded-2xl font-bold text-sm flex items-center justify-center">
            <button className="btn btn-ghost mr-2 rounded-2xl w-4 h-4">
              <ArrowUpIcon className="stroke-2 w-4 h-4 fill-base-300" />
            </button>
            {likes}
            <button className="btn btn-ghost ml-2 rounded-2xl w-4 h-4">
              <ArrowDownIcon className="stroke-2 w-4 h-4 fill-base-300" />
            </button>
          </div>
          <button className="btn btn-secondary rounded-2xl" onClick={onReply}>
            <ChatBubbleLeftRightIcon className="w-5 h-5" />
            <p className="hidden md:flex">Reply</p>
          </button>
        </div>
        {expanded && (
          <div className="ml-4 mt-2">
            {replies.map((reply) => (
              <Comment key={reply.id} {...reply} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Comment;
