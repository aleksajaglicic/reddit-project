/* eslint-disable no-unused-vars */
import React from "react"
import { useAuth } from "../contexts/AuthContext"
import Post from "./Post"
import { ToastProvider } from "./Toast"
import TopicCreator from "./TopicCreator"
import "@codaworks/react-glow"
import { Glow, GlowCapture } from "@codaworks/react-glow"
import PostCreator from "./PostCreator"

const PostContainer = ({ posts, title, topic_id}) => {
    const { user } = useAuth();
    console.log({"topic_id": topic_id})
    const isHomePage = title == null;
    const displayTopicCreation = title === null && user !== undefined;
    const displayPostCreation = title !== null && user !== undefined && user !== null;
    const displayTitle = !displayTopicCreation && !displayPostCreation;
    return (
        <div className="container items-center max-w-7xl mx-auto">
            <div className="card-body space-y-5">
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
                        <div className="text-4xl md:text-7xl font-bold mt-2 mb-2 mr-6">pr/{title}</div>
                        <PostCreator owner_id={(user ? user.id : null)} topic_id={topic_id}/>
                    </div>
                )}
                {!displayTopicCreation && !displayPostCreation ? (
                    <div className="text-4xl md:text-7xl font-bold mt-2 mb-2 mr-6">{isHomePage ? "Topics" : title}</div>
                ) : (
                    <div className="text-4xl md:text-7xl font-bold mt-2 mb-2 mr-6">Topic</div>
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
    )
}

export default PostContainer