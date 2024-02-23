function Message() {
    return (
        <div className="auth-container flex-row">
            <div className="users-list">
                <div className="flex-column">
                    <h4>username</h4>
                    <p>message</p>
                </div>
                <div className="flex-column">
                    <h4>username</h4>
                    <p>message</p>
                </div>
                <div className="flex-column">
                    <h4>username</h4>
                    <p>message</p>
                </div>
            </div>
            <div className="message-section">
                <div className="flex-row">
                    <h4>username</h4>
                    <img></img>
                </div>
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
                <form className="flex-row">
                    <input></input>
                    <button>Send</button>
                </form>
            </div>
        </div>
    )
}

export default Message