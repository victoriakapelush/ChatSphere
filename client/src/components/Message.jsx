/* eslint-disable no-unused-vars */
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import { jwtDecode } from 'jwt-decode'

function Message() {
    const navigate = useNavigate();
    const [clickedUser, setClickedUser] = useState(null);
    const [currentUser, setCurrentUser] = useState("");
    const [users, setUsers] = useState([]);

    const handleClick = (username) => {
        setClickedUser(username);
    };

    // Fetch all users except the current user
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/');
                    return;
                }
                const tokenWithoutBearer = token.replace('Bearer ', '');
                const response = await axios.get('http://localhost:3000', {
                    headers: {
                        Authorization: `Bearer ${tokenWithoutBearer}`,
                    },
                });

                const currentUserID = jwtDecode(tokenWithoutBearer).id;
                const filteredUsers = response.data.filter(user => user._id !== currentUserID);
                setUsers(filteredUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, [navigate]);

    // Function to decode JWT token and set current user
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            setCurrentUser(decoded.username); 
        }
    }, []);

    // Log out
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            localStorage.removeItem('token');
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
                {users.map((user, index) => (
                <Link key={index} to={`/message/${user._id}`}><div className="flex-column user-brief-left" onClick={() => handleClick(user.username)}>
                    <h4>{user.username}</h4>
                </div></Link>
                ))}
            </div>
            <div className="message-section flex-column">
                <div className="flex-row username-header">
                    <div className="flex-row user-img-name">
                        <img className="user-icon" src="../src/assets/icons/woman.png" alt="User Icon" />
                        <div className="flex-column">
                            <h4>{currentUser}</h4>
                            <h4>Online</h4>
                        </div>
                    </div>
                    <button onClick={handleSubmit} type="submit" className="login-btn">Log out</button>
                </div>
                <div className="flex-column messages-container">
                </div>
            </div>
        </div>
    )
}

export default Message;
