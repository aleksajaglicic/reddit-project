import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Comment from '../components/Comment';

interface PostPageProps {
  // You might want to define the props needed for this component
}

const PostPage: React.FC<PostPageProps> = () => {
    const { title, post_id } = useParams<{ title: string; post_id: string }>(); // Get title and post_id from URL parameters
    const { user } = useAuth();
    const [post, setPost] = useState<any>(null); // Replace 'any' with the type of your post object
    const [comments, setComments] = useState<any[]>([]);

    useEffect(() => {
        const fetchPostAndComments = async () => {
        try {
            const response = await fetch(`http://localhost:5000/pr/${title}/${post_id}`);
            if (response.ok) {
            const result = await response.json();
            setPost(result.post);
            setComments(result.comments);
            } else {
            // Handle error
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
        <div className="container items-center max-w-7xl mx-auto">
        <div className="card-body space-y-5">
            <div>
            <h2 className="text-4xl font-bold">{post.title}</h2>
            <p>{post.content}</p>
            </div>

            {/* Display CommentBox component for commenting */}
            {/* {user && <CommentBox postId={postId} />} */}

            {/* Display comments */}
            {comments.map((comment) => (
                <Comment
                    key={comment.id}
                    id={comment.id}
                    text={comment.content}  // Use the 'content' property as 'text'
                    user_name={comment.owner_name}  // Use the 'owner_name' property as 'user_name'
                    likes={comment.num_likes}  // Use the 'num_likes' property as 'likes'
                    replies={comment.replies}
                    // You may need to add 'onReply' logic based on your requirements
                />
                ))}
        </div>
        </div>
    );
};

export default PostPage;
