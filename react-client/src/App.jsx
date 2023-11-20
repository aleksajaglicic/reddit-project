/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import Login from './pages/Login';

// const App = () => {
//   const[data, setData] = useState([{}])
//   useEffect(() => {
//     fetch("http://localhost:5000/register")
//       .then(res => res.json())
//       .then(data => {
//         setData(data);
//         console.log(data);
//       })
//       .catch(error => {
//         console.error('Error:', error);
//       });
//   }, []);

//   return (
//     <div className="text-center">
//         {(typeof data.members === 'undefined') ? (
//           <p>Loading...</p>
//         ) : (
//           data.members.map((member, i) => (
//             <p key={i}>{member}</p>
//           ))
//         )}
//     </div>
//   )
// }

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  
    // Function to set authentication status
    const setAuth = (status) => {
      setAuthenticated(status);
    };

  return (
    <Router>
      <Routes>
        {/* <Route path="/login" element={<Login setAuth={setAuth} />} /> */}
        {/* <Route
          path="/*"
          element={authenticated ? <Layout /> : <Navigate to="/login" />}
        /> */}
        <Route exact path="*" element={<Layout />} />
      </Routes>
    </Router>
  )
}

export default App