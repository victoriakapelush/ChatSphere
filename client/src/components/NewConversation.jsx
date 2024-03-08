/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import useCurrentUser from './useCurrentUser.jsx';
import useAllSignedUsers from './useAllSignedUsers.jsx'

function NewConversation() {
    const navigate = useNavigate();
    const [clickedUser, setClickedUser] = useState(null);
    const currentUser = useCurrentUser();
    const allUsers = useAllSignedUsers();
    
    const [conversation, setConversation] = useState([]);
    const [inputValue, setInputValue] = useState(""); 
    const conversationId = useParams().id;

    // Display name of a message receiver on top of the page
    const user = allUsers.find(user => user._id === conversationId);

    // Function to handle message submission
    const handleSubmitMessage = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }
            // Send message to the receiver
            const tokenWithoutBearer = token.replace('Bearer ', '');
            const response = await axios.post(`http://localhost:3000/message/users/${conversationId}`, { receiver: clickedUser, text: inputValue }, {
                headers: {
                    Authorization: `Bearer ${tokenWithoutBearer}`,
                }
            });
            const { message } = response.data;
            console.log("Message created:", message);
            setInputValue("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

      // Fetch comversation between users
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
                const filteredConversations = response.data.filter(conversation =>
                    conversation.participants.some(participant =>
                        participant._id === currentUser.id || participant._id === conversationId
                    )
                );
                setConversation(filteredConversations);
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        };
        fetchConversations();
    }, [navigate]);

    const handleClick = (username) => {
        setClickedUser(username);
        console.log(username)
      };

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
                    <Link to="/message/users"><button className="groupchat-btn">Go back</button></Link>
                </div>
            </div>
            <div className="message-section flex-column">
                <div>
                    <div className="flex-row username-header">
                        <div className="flex-row user-img-name">
                            <img className="user-icon" src="/src/assets/icons/woman.png" alt="User Icon" />
                            <div className="flex-column">
                                {user ? (
                                    <>
                                        <h4>{user.username}</h4>
                                        <h4>Offline</h4>
                                    </>
                                    ) : (
                                        <h4>User not found</h4>
                                )}    
                            </div>
                        </div>
                        <button onClick={handleSubmit} type="submit" className="login-btn">Log out</button>
                    </div>
                    <div className="flex-column messages-container">
                    {conversation.map((conv, index) => (
                        <div key={index} className="flex-column messages-container">
                            {conv.messages.map((message, msgIndex) => (
                                <div key={msgIndex} className={`flex-column message-window ${message.sender === currentUser.id ? 'sent-by-me' : 'sent-by-other'}`}>
                                    <p className="p-message">{message.text}</p>
                                    <p className="p-sent-by">{message.time}</p>
                                </div>
                            ))}
                        </div>
                    ))}
                    </div>
                    </div>
                    <form className="send-message-form" onSubmit={handleSubmitMessage} method="POST">
                        <div className="flex-row input-btn-form-container">
                            <input 
                                type="text" 
                                placeholder="Type your message here..." 
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                required
                                />
                            <button type="submit">Send</button>
                        </div>
                    </form>
                </div>
            </div>
    )
}

export default NewConversation;