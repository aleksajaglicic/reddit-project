/* eslint-disable no-unused-vars */
import React from "react"
import { useAuth } from "../contexts/AuthContext"
import Post from "./Post"
import { ToastProvider } from "./Toast"
import TopicCreator from "./TopicCreator"
import "@codaworks/react-glow"
import { Glow, GlowCapture } from "@codaworks/react-glow"

const PostContainer = ({ posts }) => {
    const { user } = useAuth();

    return (
        <div className="container items-center max-w-7xl mx-auto">
            {user && (
                <div className="card w-200 flex mt-2">
                    <div className="card-body space-y-5">
                        <div className="card-title">
                        <TopicCreator />
                        </div>
                    </div>
                </div>
            )}
            <div className="text-4xl md:text-7xl font-bold mt-2 mb-2 ml-10 mr-6">Topics</div>
            <div className="card-body space-y-5">
                {posts.map((post) => (
                    <Post
                        key={post.id}
                        id={post.id}
                        title={post.title}
                        owner_id={post.owner_id}
                        topic_id={post.topic_id}
                        content={post.content}
                    />
                ))}
            </div>
        </div>
    )
}

export default PostContainer