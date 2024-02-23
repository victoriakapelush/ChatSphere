function Message() {
    return (
        <div className="auth-container flex-row">
            <div className="users-list">
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
            <div className="message-section">
                <div className="flex-row username-header">
                    <img className="user-icon" src="../src/assets/icons/woman.png"></img>
                    <div className="flex-column">
                        <h4>Jessica Simpson</h4>
                        <h4>Online</h4>
                    </div>
                </div>
                <div>
                    <div className="message-window flex-column">
                        <p>message</p>
                        <p>sent by and time</p>
                    </div>
                    <div className="message-window flex-column">
                        <p>message</p>
                        <p>sent by and time</p>
                    </div>
                    <div className="message-window flex-column">
                        <p>message</p>
                        <p>sent by and time</p>
                    </div>
                </div>
                <form className="flex-row">
                    <input></input>
                    <button>Send</button>
                </form>
            </div>
        </div>
    )
}

export default Message