import './navbar.css'
import { IoPersonCircleSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useState } from 'react';

function Navbar() {
    const [isNavOpen, setIsNavOpen] = useState(false);

    const toggleNav = () => setIsNavOpen(!isNavOpen);

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

                    <div className="sign-up">
                        <IoPersonCircleSharp size={37} />
                        <Link to="/login" className='login-pc'>LOGIN</Link>
                        <span className='login-pc'>/</span>
                        <Link to="/register" className='login-pc'>SIGN UP</Link>
                    </div>
                </div>

                {/* 🔹 เมนูสำหรับ PC */}
                <nav className='nav-pc'>
                    <ul className='pc'>
                        <li><Link to="/" className='sign-pc'>HOME</Link></li>
                        <li><Link to="/menu" className='sign-pc'>MENU</Link></li>
                    </ul>
                </nav>
            </div>

            {/* 🔹 เมนูสำหรับมือถือ */}
            <div className={`nav-side ${isNavOpen ? 'active' : ''}`}>
                <nav className='nav-mobile'>
                    <ul className='nav-mobile2'>
                        <li className='login-item'>
                            <IoPersonCircleSharp size={35} />
                            <Link to="/login" onClick={toggleNav}>LOGIN</Link>
                        </li>
                        <li><Link to="/" className='sign-mobile' onClick={toggleNav}>HOME</Link></li>
                        <li><Link to="/menu" className='sign-mobile' onClick={toggleNav}>MENU</Link></li>
                    </ul>
                </nav>
            </div>
        </>
    );
}

export default Navbar;
