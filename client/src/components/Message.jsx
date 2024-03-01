/* eslint-disable no-unused-vars */
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import { jwtDecode } from 'jwt-decode'

function Message() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const { id } = useParams();

/*Function to decode JWT token and set current user
const setCurrentUserFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
        const decoded = jwtDecode(token);
        setCurrentUser(decoded.username); 
    }
};*/

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
                const response = await axios.get(`http://localhost:3000/message`, {
                    headers: {
                        Authorization: `Bearer ${tokenWithoutBearer}`,
                    },
                });
                setMessages(response.data);
                //setCurrentUserFromToken(); 
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };
        fetchMessagesAndSetCurrentUser(); 
    }, []);   

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
                "http://localhost:3000/message",
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
    
    return (
        <div className="auth-container auth-container-extra">
            <div className="users-list">
                <div className="groupchat-btns-container flex-row">
                    <button className="groupchat-btn">Create a groupchat</button>
                    <button className="groupchat-btn">Filter by groupchat</button>
                </div>
                {messages.map((message, index) => (
                <Link key={index} to={`/message/${id}`}><div className="flex-column user-brief-left">
                    <h4>{}</h4>
                    <p>{message.text}</p>
                </div></Link>
                ))}
            </div>
            <div className="message-section flex-column">
                <div className="flex-row username-header">
                    <div className="flex-row user-img-name">
                        <img className="user-icon" src="../src/assets/icons/woman.png"></img>
                        <div className="flex-column">
                            <h4>{currentUser}</h4>
                            <h4>Online</h4>
                        </div>
                    </div>
                    <button onClick={handleSubmit} type="submit" className="login-btn">Log out</button>
                </div>
                <div className="flex-column messages-container">
                {messages.map((message, index) => (
                    <div key={index} className="message-window flex-column">
                        <p className="p-message">{message.text}</p>
                        <p className="p-sent-by">{message.time}</p>
                        <p className="p-sent-by">by {  "by Anonymous"}</p>
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
                            />
                        <button type="submit">Send</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Message