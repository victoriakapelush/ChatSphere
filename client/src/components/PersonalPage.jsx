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
    const [currentUser, setCurrentUser] = useState("");
    const { id } = useParams();
    const [inputValue, setInputValue] = useState("");
    const [users, setUsers] = useState([]);

    // Fetch all users
    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const response = await axios.get('http://localhost:3000');
            setUsers(response.data);
          } catch (error) {
            console.error('Error fetching users:', error);
          }
        };
    
        fetchUsers();
      }, []);

    const handleClick = (username) => {
        setClickedUser(username);
      };

        // Function to decode JWT token and set current user
        const setCurrentUserFromToken = () => {
            const token = localStorage.getItem('token');
            if (token) {
                const decoded = jwtDecode(token);
                setCurrentUser(decoded.username); 
            }
        };

    // Send a message to a user
    const handleSubmitMessage = async (e) => {
        e.preventDefault(); 
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }
            const tokenWithoutBearer = token.replace('Bearer ', '');
            const response = await axios.post(
                `http://localhost:3000/message/${id}`,
                { text: inputValue }, 
                {
                    headers: {
                        Authorization: `Bearer ${tokenWithoutBearer}`,
                    }
                }
            );
            const { message } = response.data;
            console.log("Message created:", message);
            setInputValue("");
        } catch (error) {
            console.error("Error sending message:", error);
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

      useEffect(() => {
        const fetchCurrentUserAndMessages = async () => {
            try {
                setCurrentUserFromToken();
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/');
                    return;
                }
                const tokenWithoutBearer = token.replace('Bearer ', '');
                
                // Fetch messages associated with the current user
                const response = await axios.get(`http://localhost:3000/message/${id}`, {
                    headers: {
                        Authorization: `Bearer ${tokenWithoutBearer}`,
                    },
                });

                setMessages(response.data);
            } catch (error) {
                console.error("Error fetching user and messages:", error);
            }
        };
        fetchCurrentUserAndMessages();
    }, [navigate]); 
 
    return (
        <div className="auth-container auth-container-extra">
            <div className="users-list">
                <div className="groupchat-btns-container flex-row">
                    <button className="groupchat-btn">Create a groupchat</button>
                    <button className="groupchat-btn">Filter by groupchat</button>
                </div>
                {users.map((user, index) => (
                <Link key={index} to={`/message/${user._id}`}><div className="flex-column user-brief-left" onClick={() => handleClick(user.username)}>
                    <h4>{user.username}</h4>
                </div></Link>
                ))}
            </div>
            <div className="message-section flex-column">
                <div className="flex-row username-header">
                    <div className="flex-row user-img-name">
                        <img className="user-icon" src="../src/assets/icons/woman.png"></img>
                        <div className="flex-column">
                            <h4>{clickedUser}</h4>
                            <h4>Offline</h4>
                        </div>
                    </div>
                    <button onClick={handleSubmit} type="submit" className="login-btn">Log out</button>
                </div>
                <div className="flex-column messages-container">
                    {messages.map((message, index) => (
                    <div key={index} className="flex-column message-window">
                        <p className="p-message">{message.text}</p>
                        <p className="p-sent-by">{message.time}</p>
                    </div>
                    ))}
                </div>
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