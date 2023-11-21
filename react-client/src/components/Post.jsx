/* eslint-disable no-unused-vars */
import React from "react"
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid"

const Post = () => {
    return (
        <div className="card w-full h-60 bg-base-100 border border-gray-600 rounded-2xl">
            <div className="card-body">
                <div tabIndex={0} className="absolute dropdown dropdown-bottom top-1 right-2 w-4 h-4">
                    <button className="absolute btn btn-ghost top-4 right-3 w-4 h-4">
                        <EllipsisVerticalIcon className="w-5 h-5 text-gray-400"/>
                    </button>
                    <ul tabIndex={0}
                    className="menu 
                        menu-sm 
                        border 
                        border-gray-600 
                        dropdown-content 
                        mt-3 z-[1] p-2 
                        shadow bg-base-300 
                        rounded-box w-52">
                        <li><a>Edit</a></li>
                        <li><a>Save</a></li>
                        <li><a className="text-red-500">Delete</a></li>
                    </ul>
                </div>           
                <h2 className="card-title">Shoes!</h2>
                <p className="">If a dog chews shoes whose shoes does he choose?
                </p>
            </div>
        </div>
    )
}

export default Post