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
    const [sortingOption, setSortingOption] = useState<string>("latest");

    const fetchPosts = (pageNumber: number, sortOption: string) => {
        fetch(`http://localhost:5000/?page=${pageNumber}&sort=${sortOption}`)
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
        fetchPosts(page, sortingOption);
    }, [page, sortingOption]);

    const loadMorePosts = () => {
        if (!loading && hasNext) {
        setLoading(true);
        fetchPosts(page + 1, sortingOption);
        setPage(page + 1);
        }
    };

    const handleSortingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortingOption(e.target.value);
        setPosts([]);
        setPage(1);
    };
    
    // Inside the return statement of Home component
    <div className="mb-4">
        <label className="mr-2">Sort by:</label>
        <select value={sortingOption} onChange={handleSortingChange}>
            <option value="latest">Latest</option>
            <option value="comments">Most Comments</option>
            <option value="upvotes">Most Upvotes</option>
        </select>
    </div>
    

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
            <div className="flex">
                <div className="absolute left-96 bottom-72">
                    <label className="mr-2">Sort by:</label>
                    <select className="select" value={sortingOption} onChange={handleSortingChange}>
                        <option value="latest">Latest</option>
                        <option value="comments">Most Comments</option>
                        <option value="upvotes">Most Upvotes</option>
                    </select>
                </div>
                <PostContainer posts={posts} title={null} topic_id={""} />
            </div>
        </InfiniteScroll>
        </m.div>
    );
};

export default Home;
