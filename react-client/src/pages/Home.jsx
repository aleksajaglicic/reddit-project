/* eslint-disable no-unused-vars */
import React from 'react'
import Post from '../components/Post'
//import Post from '../components/Post'

const Home = () => {
    return (
        <div className="card w-screen flex bg-base-300 mt-2 ml-52 mr-52 z-40">
            <div className="card-body shadow-2xl rounded-2xl space-y-5">
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
            </div>
        </div>
    )
}

export default Home