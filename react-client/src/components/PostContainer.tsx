import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Post from "./Post";
import { ToastProvider } from "./Toast";
import { Link } from "react-router-dom";
import TopicCreator from "./TopicCreator";
import "@codaworks/react-glow";
import { Glow, GlowCapture } from "@codaworks/react-glow";
import PostCreator from "./PostCreator";
import Comment from "./Comment";

interface PostContainerProps {
    posts: {
    id: string;
    title: string;
    owner_id: string;
    topic_id: string;
    content: string;
    topic_name: string;
    owner_name: string;
    num_likes: number;
    num_comments: number;
    }[];
    title: string | null;
    topic_id: string;
}

const PostContainer: React.FC<PostContainerProps> = ({ posts, title, topic_id }) => {
    const { user } = useAuth();
    console.log({ topic_id });
    const isHomePage = title == null;
    const displayTopicCreation = title === null && user !== undefined;
    const displayPostCreation = title !== null && user !== undefined && user !== null;
    const displayTitle = !displayTopicCreation && !displayPostCreation;
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        const checkSubscription = async () => {
            try {
                const authToken = localStorage.getItem('access_token');
                if (user) {
                    const response = await fetch('http://localhost:5000/isSubscribed', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authToken}`,
                        },
                        body: JSON.stringify({ user_id: user.id, topic_id }),
                    });

                    if (response.ok) {
                        const result = await response.json();
                        setIsSubscribed(result.isSubscribed);
                    } else {
                        const errorData = await response.json();
                        console.error('Error checking subscription:', errorData);
                    }
                }
            } catch (error) {
                console.error('Error during subscription check:', error);
            }
        };

        checkSubscription();
    }, [user, topic_id]);

    const handleSubscription = async () => {
        try {
            const authToken = localStorage.getItem('access_token');
            if (user) {
                const response = await fetch('http://localhost:5000/subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                    body: JSON.stringify({ user_id: user.id, topic_id }),
                });

                if (response.ok) {
                    setIsSubscribed(true);
                    console.log('User subscribed to the topic');
                } else {
                    const errorData = await response.json();
                    console.error('Error during subscription:', errorData);
                }
            }
        } catch (error) {
            console.error('Error during subscription:', error);
        }
    };

    return (
        <div className="container items-center max-w-7xl mx-auto">
            <div className="card-body space-y-5">
            {/* <Comment/> */}
                {displayTopicCreation && user !== null && (
                <div className="card w-200 flex mt-2">
                    <div className="card-body space-y-5">
                    <div className="card-title">
                        <TopicCreator />
                    </div>
                    </div>
                </div>
                )}
                {displayPostCreation && (
                <div>
                    <div className="flex flex-cols-2 mt-2 mb-6">
                        <div className="text-4xl md:text-7xl font-bold">pr/{title}</div>
                        <button className="btn btn-secondary rounded-2xl mt-8 w-28 ml-6" onClick={handleSubscription}>
                            {isSubscribed ? "Subscribed" : "Join Topic"}
                        </button>
                    </div>
                    <PostCreator owner_id={(user ? user.id : "")} topic_id={topic_id} />
                </div>
                )}
                {!displayTopicCreation && !displayPostCreation ? (
                <div className="text-4xl md:text-7xl font-bold mt-2 mb-2 mr-6">{isHomePage ? "Topics" : title}</div>
                ) : (
                <div className="text-4xl md:text-7xl font-bold mt-2 mb-2 mr-6">Posts</div>
                )}
                {posts.map((post) => (
                <Post
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    owner_id={post.owner_id}
                    topic_id={post.topic_id}
                    content={post.content}
                    topic_name={post.topic_name}
                    owner_name={post.owner_name}
                />
                ))}
            </div>
        </div>
    );
};

export default PostContainer;
