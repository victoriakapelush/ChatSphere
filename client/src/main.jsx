import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App.jsx'
import Login from './components/Login.jsx'
import Message from './components/Message.jsx'
import PersonalPage from './components/PersonalPage.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import './styles/index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/message",
    element: <Message />
  },
  {
    path: "/message/:id",
    element: <PersonalPage />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
