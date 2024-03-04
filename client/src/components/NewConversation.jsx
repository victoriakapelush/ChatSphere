/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { v4 as uuidv4 } from 'uuid'
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import { jwtDecode } from 'jwt-decode'

function NewConversation() {
    const navigate = useNavigate();
    const [clickedUser, setClickedUser] = useState(null);
    const [currentUser, setCurrentUser] = useState("");
    const [messageSenders, setMessageSenders] = useState([]);
    const [conversation, setConversation] = useState([]);
    const [currentConvo, setUsersForCurrentConvo] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [inputValue, setInputValue] = useState(""); // Define inputValue state variable
    const conversationId = useParams().id; // Get conversation ID from params
    const targetConversation = conversation.find(conversation => conversation._id === conversationId);

    useEffect(() => {
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
                console.log(allUsers);
            } catch (error) {
                console.log('Error fetching all users', error);
            }
        };
    
        fetchAllUsers();
    }, []); // Empty dependency array means this effect runs once on mount
    

    
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
                            // Ensure conversationId is properly initialized
            if (!conversationId) {
                console.error("Conversation ID not found");
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

    // Function to handle message submission
    const handleSubmitMessage = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }
            
            // Find conversation with the given ID
            const targetConv = conversation.find(conv => conv._id === conversationId);
            if (!targetConv) {
                const newConversation = {
                    _id: conversationId,
                    participants: [receiver, currentUser], 
                    messages: [] 
                };
                setConversation([...conversation, newConversation]);
            }

            // Extract receiver ID from the conversation
            const receiver = targetConv.participants.find(participant => participant !== currentUser);
            if (!receiver) {
                console.error('Receiver not found');
                return;
            }

            // Send message to the receiver
            const tokenWithoutBearer = token.replace('Bearer ', '');
            const response = await axios.post(`http://localhost:3000/message/${receiver._id}`, { text: inputValue }, {
                headers: {
                    Authorization: `Bearer ${tokenWithoutBearer}`,
                }
            });
            console.log(receiver)
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
                    <Link to="/message"><button className="groupchat-btn">Show conversations</button></Link>
                    <Link to="/message/users"><button className="groupchat-btn">Show all users</button></Link>
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
                {targetConversation && (
                <div className="flex-column messages-container">
                    {targetConversation.messages.map((message, index) => (
                    <div key={index} className={`flex-column message-window ${message.sender === currentUser ? 'sent-by-me' : 'sent-by-other'}`}>
                        <p className="p-message">{message.text}</p>
                        <p className="p-sent-by">{message.time}</p>
                    </div>
                    ))}
                </div>
                )}
                <form className="send-message-form" onSubmit={handleSubmitMessage}>
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

export default NewConversation;