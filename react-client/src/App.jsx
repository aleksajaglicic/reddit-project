/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
// import { Login } from './pages/Login'
// import { Register } from './pages/Register'
// import { Profile } from './pages/Profile'
import './styles/globals.css'


const App = () => {
  const[data, setData] = useState([{}])
  useEffect(() => {
    fetch("http://localhost:5000/register")
      .then(res => res.json())
      .then(data => {
        setData(data);
        console.log(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  return (
    <div className="text-center">
        {(typeof data.members === 'undefined') ? (
          <p>Loading...</p>
        ) : (
          data.members.map((member, i) => (
            <p key={i}>{member}</p>
          ))
        )}
    </div>
  )
}

export default App