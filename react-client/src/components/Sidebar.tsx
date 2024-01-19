/* eslint-disable no-unused-vars */
import React from 'react'

interface PostContainerProps {
    topics: {
        id: string,
        title: string,
    }
}

const Sidebar = () => {
    return (
        <div className="fixed drawer z-40">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="absolute drawer-side">
                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu p-4 mt-16 w-80 min-h-full bg-base-200 text-base-content">
                    <li><a>Sidebar Item 1</a></li>
                    <li><a>Sidebar Item 2</a></li>                
                </ul>
            </div>
        </div>
    )
}

export default Sidebar