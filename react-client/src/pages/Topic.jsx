/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import PostContainer from "../components/PostContainer";
const TopicPage = () => {
    const { title } = useParams();
    const [topic, setTopic] = useState(null);
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);

    useEffect(() => {
        // Fetch the topic and posts data based on the title from the server
        fetch(`http://localhost:5000/pr/${title}?page=${page}`)
        .then((response) => response.json())
        .then((data) => {
            setTopic(data.topic);
            setPosts((prevPosts) => [...prevPosts, ...data.posts]);
            setHasNext(data.has_next);
        })
        .catch((error) => console.error("Error fetching topic:", error));
    }, [title, page]);

    const loadMorePosts = () => {
        // Increment the page number to load more posts
        setPage((prevPage) => prevPage + 1);
    };

    if (!topic) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{topic.title}</h1>
            <p>{topic.description}</p>

            {/* Render posts */}
            <PostContainer posts={posts} />

            {/* Load more button */}
            {hasNext && <button onClick={loadMorePosts}>Load More</button>}
        </div>
    );
};


export default TopicPage;
