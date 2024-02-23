import { Link } from 'react-router-dom';

function Login() {
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
                    <Link to="/login"><button className="login-btn">Log into your account</button></Link>
                </nav>
            <main>
                <h1>Welcome back to the ChatSphere </h1>
                <p>- a real-time web application that enables users to engage in instant messaging with each other. Whether it is one-on-one chats or group discussions, it is a platform where you can connect, share ideas, and stay connected with friends, family, or colleagues.</p>
                <form className="flex-column">
                    <h1>Log into your account</h1>
                    <fieldset className="flex-column inputs">
                        <input className="signup-input" placeholder="Username" minLength="3" type="text"></input>
                        <input className="signup-input" placeholder="Password" type="password" minLength="3"></input>
                    </fieldset>
                    <button className="signup-btn" type="submit">Log in</button>
                </form>
            </main>
            </div>
        </div>
    )
}

export default Login