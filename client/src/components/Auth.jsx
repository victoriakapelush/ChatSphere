function Auth() {
    return (
        <div>
            <div className="auth-container">
                <nav className="flex-row">
                    <div className="flex-row icon-name-container">
                        <img src='../chat.png' className="chat-icon"></img>
                        <a href="/">
                            <h1 className="chat-name">ChatSphere</h1>
                        </a>
                    </div>
                    <button className="login-btn">Log into your account</button>
                </nav>
            <main>
                <h1>Welcome to the ChatSphere </h1>
                <p>- a real-time web application that enables users to engage in instant messaging with each other. Whether it is one-on-one chats or group discussions, it is a platform where you can connect, share ideas, and stay connected with friends, family, or colleagues.</p>
                <form className="flex-column">
                    <h1>Get onboard</h1>
                    <fieldset className="flex-column inputs">
                        <input className="signup-input" placeholder="Username" minLength="3" type="text"></input>
                        <input className="signup-input" placeholder="Email" type="email"></input>
                        <input className="signup-input" placeholder="Password" type="password" minLength="3"></input>
                    </fieldset>
                    <button className="signup-btn" type="submit">Sign up</button>
                </form>
            </main>
            </div>
            <footer className="flex-row">Designed and developed by <a href="https://victoriakapelush.com" target="_blank">Victoria Kapelush</a></footer>
        </div>
    )
}

export default Auth