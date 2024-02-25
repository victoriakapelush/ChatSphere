import { useNavigate } from "react-router-dom";
import axios from "axios";

function Message() {
    const navigate = useNavigate();

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

    return (
        <div className="auth-container auth-container-extra">
            <div className="users-list">
                <div className="groupchat-btns-container flex-row">
                    <button className="groupchat-btn">Create a groupchat</button>
                    <button className="groupchat-btn">Filter by groupchat</button>
                </div>
                <div className="flex-column user-brief-left">
                    <h4>Aaron Carter</h4>
                    <p>Hey! Just wanted to see if you are available tonight?</p>
                </div>
                <div className="flex-column user-brief-left">
                    <h4>James Davidson</h4>
                    <p>Hey boo! What are you up to tonight?</p>
                </div>
                <div className="flex-column user-brief-left">
                    <h4>Jenn Apes</h4>
                    <p>Damn! Totally forgot lol</p>
                </div>
                <div className="flex-column user-brief-left">
                    <h4>Aaron Carter</h4>
                    <p>Hey! Just wanted to see if you are available tonight?</p>
                </div>
                <div className="flex-column user-brief-left">
                    <h4>James Davidson</h4>
                    <p>Hey boo! What are you up to tonight?</p>
                </div>
                <div className="flex-column user-brief-left">
                    <h4>Jenn Apes</h4>
                    <p>Damn! Totally forgot lol</p>
                </div>
                <div className="flex-column user-brief-left">
                    <h4>Aaron Carter</h4>
                    <p>Hey! Just wanted to see if you are available tonight?</p>
                </div>
                <div className="flex-column user-brief-left">
                    <h4>James Davidson</h4>
                    <p>Hey boo! What are you up to tonight?</p>
                </div>
                <div className="flex-column user-brief-left">
                    <h4>Jenn Apes</h4>
                    <p>Damn! Totally forgot lol</p>
                </div>
                <div className="flex-column user-brief-left">
                    <h4>Aaron Carter</h4>
                    <p>Hey! Just wanted to see if you are available tonight?</p>
                </div>
                <div className="flex-column user-brief-left">
                    <h4>James Davidson</h4>
                    <p>Hey boo! What are you up to tonight?</p>
                </div>
                <div className="flex-column user-brief-left">
                    <h4>Jenn Apes</h4>
                    <p>Damn! Totally forgot lol</p>
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
                    <div className="message-window flex-column">
                        <p className="p-message">message</p>
                        <p className="p-sent-by">sent by and time</p>
                    </div>
                    <div className="message-window flex-column">
                        <p className="p-message">message</p>
                        <p className="p-sent-by">sent by and time</p>
                    </div>
                    <div className="message-window flex-column">
                        <p className="p-message">message</p>
                        <p className="p-sent-by">sent by and time</p>
                    </div>
                    <div className="message-window flex-column">
                        <p className="p-message">message</p>
                        <p className="p-sent-by">sent by and time</p>
                    </div>
                    <div className="message-window flex-column">
                        <p className="p-message">message</p>
                        <p className="p-sent-by">sent by and time</p>
                    </div>
                    <div className="message-window flex-column">
                        <p className="p-message">message</p>
                        <p className="p-sent-by">sent by and time</p>
                    </div>
                    <div className="message-window flex-column">
                        <p className="p-message">message</p>
                        <p className="p-sent-by">sent by and time</p>
                    </div>
                    <div className="message-window flex-column">
                        <p className="p-message">message</p>
                        <p className="p-sent-by">sent by and time</p>
                    </div>
                    <div className="message-window flex-column">
                        <p className="p-message">message</p>
                        <p className="p-sent-by">sent by and time</p>
                    </div>
                    <div className="message-window flex-column">
                        <p className="p-message">message</p>
                        <p className="p-sent-by">sent by and time</p>
                    </div>
                    <div className="message-window flex-column">
                        <p className="p-message">message</p>
                        <p className="p-sent-by">sent by and time</p>
                    </div>
                    <div className="message-window flex-column">
                        <p className="p-message">message</p>
                        <p className="p-sent-by">sent by and time</p>
                    </div>
                </div>
                <form className="send-message-form">
                <div className="flex-row input-btn-form-container">
                    <input type="text" placeholder="Type your message here..."></input>
                    <button>Send</button>
                </div>
            </form>
            </div>
        </div>
    )
}

export default Message