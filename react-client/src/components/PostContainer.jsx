/* eslint-disable no-unused-vars */
import React from "react"
import { useAuth } from "../contexts/AuthContext"
import Post from "./Post"
import { ToastProvider } from "./Toast"
import TopicCreator from "./TopicCreator"
import "@codaworks/react-glow"
import { Glow, GlowCapture } from "@codaworks/react-glow"

const PostContainer = () => {
    const { user } = useAuth();

    return (
        <div className="container items-center h-full max-w-7xl mx-auto">
            {user && (
                <div className="card w-200 flex bg-transparent mt-2">
                    <div className="card-body space-y-5">
                        <div className="card-title text-gray-400">
                        <TopicCreator />
                        </div>
                    </div>
                </div>
            )}
            <div className="text-7xl font-bold mt-2 mb-6 ml-6 mr-6">Topics</div>
            <div className="card w-full flex bg-base-300 mt-2 z-40">
                <div className="card-body shadow-2xl rounded-2xl space-y-5">
                    <Post />
                    <Post />
                    <Post />
                    <Post />
                    <Post />
                    <Post />
                </div>
            </div>
        </div>
    )
}

export default PostContainer