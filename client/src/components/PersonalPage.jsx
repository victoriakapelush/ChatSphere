/* eslint-disable no-unused-vars */
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'

function PersonalPage() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [clickedUser, setClickedUser] = useState(null);
    const [currentUserByUsername, setCurrentUserByUsername] = useState("");
    const [currentUser, setCurrentUser] = useState("");
    const [messageSenders, setMessageSenders] = useState([]);
    const { id } = useParams();
    const [inputValue, setInputValue] = useState("");
    const [users, setUsers] = useState([]);
    const [conversation, setConversation] = useState([]);
    const conversationId = useParams().id;
    const targetConversation = conversation.find(conversation => conversation._id === conversationId);

// Function to fetch the current user's information
const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://localhost:3000', {
          headers: {
            authorization: `Bearer ${token}`
          }
        });
        setUsers(response.data);
        console.log(response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  
  useEffect(() => {
    setCurrentUserFromToken();
    fetchUsers();
  }, []);
  

    const handleClick = (username) => {
        setClickedUser(username);
        console.log(username)
      };

        // Function to decode JWT token and set current user
        const setCurrentUserFromToken = () => {
            const token = localStorage.getItem('token');
            if (token) {
                const decoded = jwtDecode(token);
                setCurrentUser(decoded.id); 
                setCurrentUserByUsername(decoded.username)
            }
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
                    const messageSender = conversation.participants.find(participant => participant.username !== currentUserByUsername);
                    return messageSender ? messageSender.username : '';
                });
                setConversation(response.data);
                setMessageSenders(allSenders);
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        };
        fetchConversations();
    }, [currentUserByUsername, navigate]);

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
                    <Link to="/message"><button className="groupchat-btn">Go back</button></Link>
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
                        <img className="user-icon" src="../src/assets/icons/woman.png"></img>
                        <div className="flex-column">
                        {messageSenders && messageSenders.map((sender, index) => (
                            <h4 key={index}>{clickedUser}</h4>
                        ))}
                            <p>Offline</p> 
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

export default PersonalPage