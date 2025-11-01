import './login.css';
import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5000/api/logincheck/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();
            if (res.ok) {
                if (data.user?.role?.toLowerCase() === "admin") {
                    navigate("/addproduct");
                } else {
                    navigate("/home_logged-in");
                }
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
        }
    };

    return (
        <>
            <div className="bg-login">
                <div className="form-box">
                    <form onSubmit={handleSubmit}>
                        <div className="title">
                            <h1>Login</h1>
                        </div>

                        <div className="input-group">
                            <input type="text" id="username" required value={username}
                                onChange={(e) => setUsername(e.target.value)} />
                            <label htmlFor="username">Username</label>
                        </div>

                        <div className="input-group">
                            <input type="password" id='password' required value={password}
                                onChange={(e) => setPassword(e.target.value)} />
                            <label htmlFor="password">Password</label>
                        </div>

                        <button type='submit' className='login-but'>Login</button>

                        <p className="signup-text">
                            <span>ยังไม่มีบัญชีใช่ไหม? </span>
                            <Link to="/register" className="signup-link">Sign Up</Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login;