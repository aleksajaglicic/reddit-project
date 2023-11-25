/* eslint-disable no-unused-vars */
import React from "react"
import { EllipsisVerticalIcon, ArrowUpTrayIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/20/solid"
import {ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline"
import { Link } from "react-router-dom"
import "@codaworks/react-glow"
import { Glow, GlowCapture } from "@codaworks/react-glow"
const Post = () => {
    return (
        // <Link to="./TopicCreator.jsx" className="link-hover">
        <GlowCapture>
                <Glow>
                    <div className="card w-full h-60 bg-base-100 rounded-2xl">
                        <div className="card-body">
                            <div tabIndex={0} className="absolute dropdown dropdown-left top-1 right-2 w-4 h-4">
                                <button className="absolute btn btn-ghost top-4 right-3 w-4 h-4">
                                    <EllipsisVerticalIcon className="w-5 h-5 text-gray-400"/>
                                </button>
                                <ul tabIndex={0}
                                className="menu 
                                    menu-sm 
                                    border 
                                    border-gray-600 
                                    dropdown-content 
                                    mt-16 z-[1] p-2 
                                    shadow bg-base-300 
                                    rounded-box w-52">
                                    <li><a>Edit</a></li>
                                    <li><a>Save</a></li>
                                    <li><a className="text-red-500">Delete</a></li>
                                </ul>
                            </div>           
                            <h2 className="card-title">Shoes!</h2>
                            <p className="mt-2">
                                If a dog chews shoes whose shoes does he choose?
                            </p>
                            <div className="flex items-center mt-4 space-x-2">
                                <div className="bg-info text-base-300 rounded-2xl font-bold text-sm flex items-center justify-center">
                                    <button className="btn btn-ghost mr-2 rounded-2xl w-4 h-4">
                                        <ArrowUpIcon className="stroke-2 w-4 h-4" />
                                    </button>
                                    12k
                                    <button className="btn btn-ghost ml-2 rounded-2xl w-4 h-4">
                                        <ArrowDownIcon className="stroke-2 w-4 h-4" />
                                    </button>
                                </div>
                                <button className="btn bg-base-300 rounded-2xl">
                                    <ChatBubbleLeftRightIcon className=" w-5 h-5" />
                                    2.2k Comments
                                </button>
                                <button className="btn btn-accent rounded-2xl">
                                    <ArrowUpTrayIcon className="w-5 h-5" />
                                    Share
                                </button>
                            </div>
                        </div>
                    </div>
                </Glow>
        </GlowCapture>
    )
}

export default Post