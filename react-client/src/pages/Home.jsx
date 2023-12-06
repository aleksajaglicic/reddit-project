/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion as m } from "framer-motion";
import PostContainer from "../components/PostContainer";
import InfiniteScroll from "react-infinite-scroll-component";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchPosts = (pageNumber) => {
        fetch(`http://localhost:5000/?page=${pageNumber}`)
            .then((response) => response.json())
            .then((data) => {
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
            .catch((error) => console.error("Error fetching random posts:", error));
    };
    

    useEffect(() => {
        fetchPosts(page);
    }, [page]);

    const loadMorePosts = () => {
        if (!loading && hasNext) {
            setLoading(true);
            fetchPosts(page + 1);
            setPage(page + 1);
        }
    };

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
                <PostContainer posts={posts} title={null}/>
            </InfiniteScroll>
        </m.div>
    );
};
export default Home;
