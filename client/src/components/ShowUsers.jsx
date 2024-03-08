/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import useCurrentUser from './useCurrentUser.jsx';
import useAllSignedUsers from './useAllSignedUsers.jsx';

function ShowUsers() {
    const navigate = useNavigate();
    const [conversation, setConversation] = useState([]);
    const currentUser = useCurrentUser();
    const allUsers = useAllSignedUsers();

    // Log out
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            localStorage.removeItem('token');
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };
    
    return (
        <div className="auth-container auth-container-extra">
            <div className="users-list">
                <div className="groupchat-btns-container flex-row">
                    <Link to="/message/users"><button className="groupchat-btn">Users</button></Link>
                </div>
                {conversation && allUsers.filter(user => user._id !== currentUser.id).map((user, index) => (
                    <Link key={index} to={`/message/users/${user._id}`}>
                        <div className="flex-column user-brief-left">
                            <h4>{user.username}</h4>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="message-section flex-column">
                <div className="flex-row username-header">
                    <div className="flex-row user-img-name">
                        <img className="user-icon" src="../src/assets/icons/woman.png" alt="User Icon" />
                        <div className="flex-column">
                            <h4>{currentUser && currentUser.username}</h4>
                            <h4>Online</h4>
                        </div>
                    </div>
                    <button onClick={handleSubmit} type="submit" className="login-btn">Log out</button>
                </div>
                <div className="flex-column messages-container">
                </div>
            </div>
        </div>
    )
}

export default ShowUsers;