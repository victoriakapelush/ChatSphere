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
    const [allUsers, setAllUsers] = useState([]);

        const fetchAllUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/');
                    return;
                }
                const tokenWithoutBearer = token.replace('Bearer ', '');
                const response = await axios.get('http://localhost:3000', {
                    headers: {
                        Authorization: `Bearer ${tokenWithoutBearer}`,
                    },
                });
                const allUsers = response.data.map(user => user.username);
                
                // Filter out the currentUser from allUsers
                const filteredUsers = allUsers.filter(username => username !== currentUser);
                setAllUsers(filteredUsers);
            } catch (error) {
                console.log('Error fetching all users', error);
            }
        };

    
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
    
                // Extract message senders from all conversations
                const allSenders = response.data.map(conversation => {
                    const messageSender = conversation.participants.find(participant => participant.username !== currentUser);
                    return messageSender ? messageSender.username : '';
                });
    
                // Filter out conversations where the current user is a participant
                const filteredConversations = response.data.filter(conversation =>
                    conversation.participants.some(participant => participant.username !== currentUser)
                );
    
                setConversation(filteredConversations);
                setMessageSenders(allSenders);
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        };
    
        fetchConversations();
    }, [currentUser, navigate]);
    

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
                    <Link to="/message/users"><button className="groupchat-btn" onClick={fetchAllUsers}>Show all users</button></Link>
                </div>
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
