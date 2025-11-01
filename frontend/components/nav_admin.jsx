import "./nav_admin.css"
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { TbLogout2 } from "react-icons/tb";

function Navbaradmin() {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const navigate = useNavigate();

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

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

                    <div className="logout" onClick={handleLogout}>
                        <TbLogout2 size={30} /><Link to="/" className='logout-pc'>LOGOUT</Link>
                    </div>
                </div>

                <nav className='nav-pc'>
                    <ul className='pc'>
                        <li><Link to="/addproduct" className='sign-pc'>ADDPRODUCT</Link></li>
                        <li><Link to="/editproduct" className='sign-pc'>EDITPRODUCT</Link></li>
                        <li><Link to="/showquery" className='sign-pc'>REPORT</Link></li>
                    </ul>
                </nav>
            </div>

            <div className={`nav-side ${isNavOpen ? 'active' : ''}`}>
                <nav className='nav-mobile'>
                    <ul className='nav-mobile2'>
                        <li><Link to="/addproduct" className='sign-mobile'>ADDPRODUCT</Link></li>
                        <li><Link to="/editproduct" className='sign-mobile'>EDITPRODUCT</Link></li>
                        <li><Link to="/showquery" className='sign-mobile'>REPORT</Link></li>
                        <li onClick={handleLogout}>
                            <TbLogout2 size={30} id="sign-mobile" /><Link to="/" className='sign-mobile'>LOGOUT</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
}

export default Navbaradmin;