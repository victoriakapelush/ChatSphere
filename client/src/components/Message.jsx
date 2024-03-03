/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import { jwtDecode } from 'jwt-decode'

function Message() {
    const navigate = useNavigate();
    const [clickedUser, setClickedUser] = useState(null);
    const [currentUser, setCurrentUser] = useState("");
    const [messageSenders, setMessageSenders] = useState([]);
    const [conversation, setConversation] = useState([]);
    const [currentConvo, setUsersForCurrentConvo] = useState([]);

    const handleClick = (username) => {
        setClickedUser(username);
    };

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/');
                    return;
                }
                const tokenWithoutBearer = token.replace('Bearer ', '');
                const response = await axios.get('http://localhost:3000/message', {
                    headers: {
                        Authorization: `Bearer ${tokenWithoutBearer}`,
                    },
                });
                const allSenders = response.data.map(conversation => {
                    const messageSender = conversation.participants.find(participant => participant.username !== currentUser);
                    return messageSender ? messageSender.username : '';
                });
                setConversation(response.data);
                setMessageSenders(allSenders);
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        };
        fetchConversations();
    }, [messageSenders, navigate]);

    // Function to decode JWT token and set current user
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            setCurrentUser(decoded.username); 
        }
    }, []);

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
                    <button className="groupchat-btn">Show users</button>
                    <button className="groupchat-btn">Show conversations</button>
                </div>
                {messageSenders && conversation.map((conversation, index) => (
                    <Link key={index} to={`/message/${conversation._id}`}>
                        <div className="flex-column user-brief-left" onClick={() => handleClick(conversation.participants.username)}>
                            <h4>From: {messageSenders[index]}</h4>
                            <p>{conversation.messages[0]?.text}</p> 
                        </div>
                    </Link>
                ))}
            </div>
            <div className="message-section flex-column">
                <div className="flex-row username-header">
                    <div className="flex-row user-img-name">
                        <img className="user-icon" src="../src/assets/icons/woman.png" alt="User Icon" />
                        <div className="flex-column">
                            <h4>{currentUser}</h4>
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

export default Message;
