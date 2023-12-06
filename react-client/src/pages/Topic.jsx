/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostContainer from "../components/PostContainer";
import InfiniteScroll from "react-infinite-scroll-component";
import { motion as m } from "framer-motion"

const TopicPage = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [loading, setLoading] = useState(true);
    const { title } = useParams();
    const [topic, setTopic] = useState(null);

    const fetchTopicData = (pageNumber) => {
        fetch(`http://localhost:5000/pr/${title}?page=${pageNumber}`)
            .then((response) => response.json())
            .then((data) => {
                setTopic(data.topic);
                setPosts((prevPosts) => {
                    const uniquePosts = data.posts
                    ? data.posts.filter(
                        (newPost) =>
                        !prevPosts.some((prevPost) => prevPost.id === newPost.id)
                    ) : [];
                    return [...prevPosts, ...uniquePosts];
                });
                setHasNext(data.has_next);
                setLoading(false);
            })
            .catch((error) => console.error("Error fetching topic:", error));
    };
    
        useEffect(() => {
            fetchTopicData(page);
        }, [page]);
    
        const loadMorePosts = () => {
            if (!loading && hasNext) {
                setLoading(true);
                fetchTopicData(page + 1);
                setPage(page + 1);
            }
        };

    if (!topic) {
        return <div>Loading...</div>;
    }


    return (
        <m.div
        className="w-full h-full background_root__yzs99"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.75 }}
        >
            <InfiniteScroll
                dataLength={posts.length}
                next={loadMorePosts}
                hasMore={hasNext && !loading}
                loader={<h4>Loading...</h4>}
            >
                <PostContainer posts={posts} title={topic.title} topic_id={topic.id}/>
            </InfiniteScroll>
        </m.div>
    );
};

export default TopicPage;
