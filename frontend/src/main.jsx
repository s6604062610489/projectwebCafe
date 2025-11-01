import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './unlogged-in/register.jsx';
import Addproduct from './logged-in/addproduct.jsx';
import Menu from './unlogged-in/menu.jsx';
import Login from './unlogged-in/login.jsx';
import Showquery from './logged-in/showquery.jsx';
import Home from './unlogged-in/home.jsx';
import Homeloggedin from './logged-in/home.jsx';
import Menu_loggedin from './logged-in/menu.jsx';
import Editproduct from './logged-in/editproduct.jsx';
import Profile from './logged-in/profile.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/addproduct" element={<Addproduct />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu_logged-in" element={<Menu_loggedin />} />
        <Route path="/showquery" element={<Showquery />}/>
        <Route path="/home_logged-in" element={<Homeloggedin />} />
        <Route path="/editproduct" element={<Editproduct />} />
        <Route path="/profile" element={<Profile />}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
