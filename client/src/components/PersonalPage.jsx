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
    const { id } = useParams();
    const [newMessage, setNewMessage] = useState("");

    const handleClick = (user) => {
      setClickedUser(user);
    };

    // Display all mesagges
    const fetchMessage = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/message/${id}`);
            setNewMessage(response.data);
        }
        catch (error) {
            console.error("Error fetching message:", error);
        }
    }

    // Send a message to a user
    const sendMessage = async () => {
        try {
            const response = await axios.post(`http://localhost:3000/message/${id}`, {
                userId: clickedUser._id,
                text: newMessage
            });
            setNewMessage("");
            console.log("Message sent:", response.data);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }

    useEffect(() => {
        if (!id) {
          navigate("/");
          return;
        }
        fetchMessage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [id]);

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
        const fetchMessagesAndSetCurrentUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/');
                    return;
                }
                const tokenWithoutBearer = token.replace('Bearer ', '');
                const response = await axios.get(`http://localhost:3000/message/${id}`, {
                    headers: {
                        Authorization: `Bearer ${tokenWithoutBearer}`,
                    },
                });
                setMessages(response.data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };
        fetchMessagesAndSetCurrentUser(); 
    }, []); 
 
    return (
        <div className="auth-container auth-container-extra">
            <div className="users-list">
                <div className="groupchat-btns-container flex-row">
                    <button className="groupchat-btn">Create a groupchat</button>
                    <button className="groupchat-btn">Filter by groupchat</button>
                </div>
                {messages.map((message, index) => (
                <Link key={index} to={`/message/${message.user._id}`} onClick={() => handleClick(message.user)}><div className="flex-column user-brief-left">
                    <h4>{message.user.username}</h4>
                    <p>{message.text}</p>
                </div></Link>
                ))}
            </div>
            <div className="message-section flex-column">
                <div className="flex-row username-header">
                    <div className="flex-row user-img-name">
                        <img className="user-icon" src="../src/assets/icons/woman.png"></img>
                        {clickedUser && (
                        <div className="flex-column">
                            <h4>{clickedUser.username}</h4>
                            <h4>Offline</h4>
                        </div>
                        )}
                    </div>
                    <button onClick={handleSubmit} type="submit" className="login-btn">Log out</button>
                </div>
                <div className="flex-column messages-container">

                </div>
                <form className="send-message-form" >
                    <div className="flex-row input-btn-form-container">
                        <input 
                            type="text" 
                            placeholder="Type your message here..." 
                            />
                        <button type="submit">Send</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PersonalPage