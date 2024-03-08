/* eslint-disable no-unused-vars */
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import useCurrentUser from './useCurrentUser.jsx';
import useAllSignedUsers from './useAllSignedUsers.jsx'

function PersonalPage() {
    const navigate = useNavigate();
    const [clickedUser, setClickedUser] = useState(null);
    const [currentUserByUsername, setCurrentUserByUsername] = useState("");
    const currentUser = useCurrentUser();
    const [messageSenders, setMessageSenders] = useState([]);
    const allUsers = useAllSignedUsers();
    const [inputValue, setInputValue] = useState("");
    const [users, setUsers] = useState([]);
    const [conversation, setConversation] = useState([]);
    const conversationId = useParams().id;
    const targetConversation = conversation.find(conversation => conversation._id === conversationId);

    const handleClick = (username) => {
        setClickedUser(username);
        console.log(username)
      };

    // Log out
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.get('http://localhost:3000');
          const { token } = response.data;
          localStorage.removeItem('token', token);
          navigate('/');
        } catch (error) {
          console.error('Logout error:', error);
        }
      };

      // Fetch comversation between current user and some other user
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
                    const messageSender = conversation.participants.find(participant => participant.username !== currentUser.username);
                    return messageSender ? messageSender.username : '';
                });
                setConversation(response.data);
                setMessageSenders(allSenders);
                
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        };
        fetchConversations();
    }, [navigate]);

    // Function to handle message submission
    const handleSubmitMessage = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }
    
            // Find or create the conversation
            let targetConv = conversation.find(conv => conv._id === conversationId);
            if (!targetConv) {
                // If conversation does not exist, create a new one
                const newConversation = {
                    _id: conversationId,
                    participants: [currentUser, clickedUser], 
                    messages: [] 
                };
                setConversation([...conversation, newConversation]);
                targetConv = newConversation;
            }
    
            // Send message to the conversation
            const tokenWithoutBearer = token.replace('Bearer ', '');
            const response = await axios.post(`http://localhost:3000/message/${conversationId}`, { text: inputValue }, {
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
    
    
    return (
        <div className="auth-container auth-container-extra">
            <div className="users-list">
                <div className="groupchat-btns-container flex-row">
                    <Link to="/message"><button className="groupchat-btn">Go back</button></Link>
                </div>
            </div>
            <div className="message-section flex-column">
                <div className="flex-row username-header">
                    <div className="flex-row user-img-name">
                        <img className="user-icon" src="../src/assets/icons/woman.png"></img>
                        <div className="flex-column">
                            <h4>User</h4>
                            <h4>Offline</h4>
                        </div>
                    </div>
                    <button onClick={handleSubmit} type="submit" className="login-btn">Log out</button>
                </div>
                {targetConversation && (
                <div className="flex-column messages-container">
                    {targetConversation.messages.map((message, index) => (
                    <div key={index} className={`flex-column message-window ${message.sender === currentUser.id ? 'sent-by-me' : 'sent-by-other'}`}>
                        <p className="p-message">{message.text}</p>
                        <p className="p-sent-by">{message.time}</p>
                    </div>
                    ))}
                </div>
                )}
                <form className="send-message-form" onSubmit={handleSubmitMessage} method="POST">
                    <div className="flex-row input-btn-form-container">
                        <input 
                            type="text" 
                            placeholder="Type your message here..." 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            required
                            />
                        <button type="submit">Send</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PersonalPage