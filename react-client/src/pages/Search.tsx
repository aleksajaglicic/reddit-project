// Search.tsx

import React from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

interface SearchResult {
  // Define the structure of each search result
    id: string;
    title: string;
    owner_name: string;
    topic_name: string;
}

interface SearchProps {
    searchResults: SearchResult[];
}

const Search: React.FC<SearchProps> = () => {
    const location = useLocation();
    const searchResults = location.state?.searchResults || [];
    return (
        <div className="container mt-8 items-center max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4">Search Results</h1>

        {searchResults.map((result: SearchResult) => (
            <div key={result.id} className="post-background mb-6">
            <div className="card w-full bg-base-100 rounded-2xl overflow-hidden">
                <div className="card-body">
                <div className="flex items-center">
                    <span className="mx-1 text-xs">•</span>
                    <Link to={`/pr/${result.title}`} className="text-sm underline">
                    pr/{result.title}
                    </Link>
                    <span className="mx-1 text-xs">•</span>
                </div>
                <h2 className="card-title text-xl md:text-2xl font-semibold mb-4">{result.title}</h2>
                </div>
            </div>
            </div>
        ))}
        </div>
    );
};

export default Search;
