/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { v4 as uuidv4 } from 'uuid'
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import { jwtDecode } from 'jwt-decode'

function ShowUsers() {
    const navigate = useNavigate();
    const [clickedUser, setClickedUser] = useState(null);
    const [currentUser, setCurrentUser] = useState([]);
    const [messageSenders, setMessageSenders] = useState([]);
    const [conversation, setConversation] = useState([]);
    const [currentConvo, setUsersForCurrentConvo] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const { id } = useParams();

    // Function to fetch the logged in user
    useEffect(() => {
        const fetchCurrentUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/');
                    return;
                }
                const tokenWithoutBearer = token.replace('Bearer ', '');
                const response = await axios.get('http://localhost:3000/login', {
                    headers: {
                        Authorization: `Bearer ${tokenWithoutBearer}`,
                    },
                });
                setCurrentUser(response.data.user);
                console.log(response.data)
            } catch (error) {
                console.log('Error fetching all users', error);
            }
        };
    
        fetchCurrentUsers();
    }, []);

    // Function to fetch all signed up users
    useEffect(() => {
        const fetchAllUsers = async () => {
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
              params: {
                loggedInUserId: currentUser.id,
              },
            });
            setAllUsers(response.data);
            console.log(response.data)
          } catch (error) {
            console.log('Error fetching all users', error);
          }
        };
        fetchAllUsers();
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
                    <Link to="/message"><button className="groupchat-btn">Show conversations</button></Link>
                </div>
                {conversation && allUsers.filter(user => user._id !== currentUser.id).map((user, index) => (
                    <Link key={index} to={`/message/users/${user._id}`}>
                        <div className="flex-column user-brief-left">
                            <h4>{user.username}</h4>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="message-section flex-column">
                <div className="flex-row username-header">
                    <div className="flex-row user-img-name">
                        <img className="user-icon" src="../src/assets/icons/woman.png" alt="User Icon" />
                        <div className="flex-column">
                            <h4>{currentUser && currentUser.username}</h4>
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

export default ShowUsers;