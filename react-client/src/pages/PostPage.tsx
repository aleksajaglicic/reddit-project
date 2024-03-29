import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Comment from '../components/Comment';
import Post from "../components/Post";
import CommentCreator from '../components/CommentCreator';
import { useAuth } from '../contexts/AuthContext';

interface Reply {
  id: string;
  owner_id: string;
  topic_id: string;
  text: string;
  num_likes: string;
  owner_name: string;
}

interface CommentData {
  id: string;
  topic_id: string;
  text: string;
  owner_name: string;
  post_id: string;
  user_id: string;
  num_likes: number;
  replies: Reply[];
}

interface PostPageProps {
  post_id: string;
  title: string | null;
  topic_id: string;
  comments: CommentData[];
}

const PostPage: React.FC<PostPageProps> = () => {
  const { user } = useAuth();
  const { title, post_id } = useParams<{ title: string; post_id: string, topic_id: string }>();
  const [post, setPost] = useState<Post>();
  const [comments, setComments] = useState<CommentData[]>([]);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const response = await fetch(`http://localhost:5000/pr/${title}/${post_id}`);
        if (response.ok) {
          const result = await response.json();
          setPost(result.post);
          setComments(result.comments);
        } else {
          console.error('Error fetching post and comments:', response);
        }
      } catch (error) {
        console.error('Error fetching post and comments:', error);
      }
    };

    fetchPostAndComments();
  }, [title, post_id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-8 items-center max-w-7xl mx-auto">
      <>
        <Post
          key={post.id}
          id={post.id}
          title={post.title}
          owner_id={post.owner_id}
          topic_id={post.topic_id}
          content={post.content}
          topic_name={post.topic_name}
          owner_name={post.owner_name}
          num_likes={post.num_likes}
        />
        {console.log("This is topic id" + post.topic_id)}
        {user && <CommentCreator user_id={post.owner_id} post_id={post.id} topic_id={post.topic_id} />}
        <div className="card-body space-y-5">
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              id={comment.id}
              text={comment.text}
              user_id={comment.user_id}
              post_id={comment.post_id}
              num_likes={comment.num_likes}
              owner_name={comment.owner_name}
            />
          ))}
        </div>
      </>
    </div>
  );
};

export default PostPage;
