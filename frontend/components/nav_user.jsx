import './nav_user.css'
import { IoPersonCircleSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from 'react';
import { TbLogout2 } from "react-icons/tb";

function NavUser() {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef();

    const toggleNav = () => setIsNavOpen(!isNavOpen);
    const toggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, []);

    const handleLogout = async (e) => {
        e.preventDefault();
        await fetch("http://localhost:5000/api/logincheck/logout", {
            method: "POST",
            credentials: "include"
        });
        navigate("/");
    };

    return (
        <>
            <div className="container-navbar">
                <div className="h-bar">
                    <p className='t-title'>Café</p>

                    <div className={`hamburger ${isNavOpen ? 'open' : ''}`} onClick={toggleNav}>
                        <span className='ham1'></span>
                        <span className='ham1'></span>
                        <span className='ham1'></span>
                        <span className='ham1'></span>
                    </div>

                    <div className="edit-profile" ref={menuRef}>
                        <div className="profile-trigger" onClick={toggleProfileMenu}>
                            <IoPersonCircleSharp size={37} id='pc-edit'/>
                            <span className='pc-edit'>PROFILE</span>
                        </div>

                        {showProfileMenu && (
                            <div className="profile-popup">
                                <ul>
                                    <li><Link to="/profile">Edit Profile</Link></li>
                                    <li><Link to="/history">History</Link></li>
                                    <li onClick={handleLogout}>
                                        <TbLogout2 size={30} id="pro-logout"/><Link className='pro-logout'>Logout</Link>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* 🔹 เมนูสำหรับ PC */}
                <nav className='nav-pc'>
                    <ul className='pc'>
                        <li><Link to="/home_logged-in" className='sign-pc'>HOME</Link></li>
                        <li><Link to="/menu_logged-in" className='sign-pc'>MENU</Link></li>
                    </ul>
                </nav>
            </div>

            {/* 🔹 เมนูสำหรับมือถือ */}
            <div className={`nav-side ${isNavOpen ? 'active' : ''}`}>
                <nav className='nav-mobile'>
                    <ul className='nav-mobile2'>
                        <li onClick={toggleNav}>
                            <IoPersonCircleSharp size={35} id="sign-mobile" />
                            <Link to="/profile" className='sign-mobile'>PROFILE</Link>
                        </li>
                        <li><Link to="/" className='sign-mobile' onClick={toggleNav}>HOME</Link></li>
                        <li><Link to="/menu" className='sign-mobile' onClick={toggleNav}>MENU</Link></li>
                        <li onClick={handleLogout}>
                            <TbLogout2 size={30} id="sign-mobile" /><Link className='sign-mobile'>LOGOUT</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
}

export default NavUser;
