
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
    const { user } = useAuth(); // Assuming you have an authentication context to get the logged-in user
    const [userData, setUserData] = useState<any>(null);
  
    useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          const response = await fetch(`http://localhost:5000/profile`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer YOUR_ACCESS_TOKEN`, // Replace YOUR_ACCESS_TOKEN with your actual token or adjust accordingly
            },
          });
  
          if (response.ok) {
            const result = await response.json();
            setUserData(result);
          } else {
            console.error('Error fetching user profile:', response);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };
  
      if (user) {
        fetchUserProfile();
      }
    }, [user]);
  
    if (!userData) {
      return <div>Loading...</div>;
    }
  
    return (
      <div className="container">
        <h2>{userData.user.name}'s Profile</h2>
        <p>Email: {userData.user.email}</p>
        {/* Display user topics, posts, and comments as needed */}
        <div>
          <h3>Topics:</h3>
          {userData.topics.map((topic: any) => (
            <div key={topic.id}>
              <p>Title: {topic.title}</p>
              <p>Content: {topic.content}</p>
            </div>
          ))}
        </div>
        <div>
          <h3>Posts:</h3>
          {userData.posts.map((post: any) => (
            <div key={post.id}>
              <p>Content: {post.content}</p>
            </div>
          ))}
        </div>
        <div>
          <h3>Comments:</h3>
          {userData.comments.map((comment: any) => (
            <div key={comment.id}>
              <p>Content: {comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Profile;  