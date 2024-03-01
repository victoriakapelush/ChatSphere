import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Message() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");

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
        const fetchMessages = async () => {
          try {
            const token = localStorage.getItem('token');
            if (!token) {
              navigate('/');
              return;
            }
            const tokenWithoutBearer = token.replace('Bearer ', '');
            const response = await axios.get("http://localhost:3000/message", {
              headers: {
                Authorization: `Bearer ${tokenWithoutBearer}`,
              },
            });
            setMessages(response.data);
          } catch (error) {
            console.error("Error fetching messages:", error);
          }
        };
        fetchMessages();
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
                <div className="flex-column user-brief-left">
                    <h4>Aaron Carter</h4>
                    <p value="text">Hey! Just wanted to see if you are available tonight?</p>
                </div>
                <div className="flex-column user-brief-left">
                    <h4>James Davidson</h4>
                    <p>Hey boo! What are you up to tonight?</p>
                </div>
            </div>
            <div className="message-section flex-column">
                <div className="flex-row username-header">
                    <div className="flex-row user-img-name">
                        <img className="user-icon" src="../src/assets/icons/woman.png"></img>
                        <div className="flex-column">
                            <h4>Jessica Simpson</h4>
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
                        <p className="p-sent-by">by {message.user.username || "by Anonymous"}</p>
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