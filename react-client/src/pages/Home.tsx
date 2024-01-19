import React, { useState, useEffect } from "react";
import { motion as m } from "framer-motion";
import PostContainer from "../components/PostContainer";
import PostContainerProps from "../components/PostContainer";
import InfiniteScroll from "react-infinite-scroll-component";
import TopicCreator from "../components/TopicCreator";

interface Post {
    id: string;
    title: string;
    owner_id: string;
    topic_id: string;
    content: string;
    topic_name: string;
    owner_name: string;
    num_likes: number; // Adjust as needed
    num_comments: number; // Adjust as needed
}

const Home = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchPosts = (pageNumber: number) => {
        fetch(`http://localhost:5000/?page=${pageNumber}`)
            .then((response) => response.json())
            .then((data) => {
                setPosts((prevPosts) => {
                const uniquePosts = data.posts
                    ? data.posts.filter(
                        (newPost: Post) =>
                        !prevPosts.some((prevPost) => prevPost.id === newPost.id)
                    )
                    : [];
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
            <PostContainer posts={posts} title={null} topic_id={""} />
        </InfiniteScroll>
        </m.div>
    );
};

export default Home;
