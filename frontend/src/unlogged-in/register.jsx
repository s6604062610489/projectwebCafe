import './regis.css';
import { useState } from 'react';

function Register() {
    const [form, setForm] = useState({
        firstname: "",
        lastname: "",
        username: "",
        phone: "",
        email: "",
        password: ""
    });

    const handleChange = (e) =>{
        setForm({ ...form, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5000/api/member/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            const data = await res.json();  
            if (!res.ok) throw new Error(data.message || "สมัครไม่สำเร็จ");
            alert(data.message);

            setForm({
                firstname: "",
                lastname: "",
                username: "",
                phone: "",
                email: "",
                password: ""
            });
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <>
            <div className="bg-regis">
                <div className="form-box">
                    <form onSubmit={handleSubmit}>
                        <div className="title-regis">
                            <h1>Register</h1>
                        </div>

                        <div className="name-input">
                            <div className="input-group half">
                                <input type="text" id="firstname" required 
                                value={form.firstname} onChange={handleChange}/>
                                <label htmlFor="firstname">Firstname</label>
                            </div>

                            <div className="input-group half">
                                <input type="text" id="lastname" required 
                                value={form.lastname} onChange={handleChange}/>
                                <label htmlFor="lastname">Lastname</label>  
                            </div>
                        </div>

                        <div className="input-group-regis">
                            <input className='u-name' type="text" id='username' required 
                            value={form.username} onChange={handleChange}/>
                            <label htmlFor="username">Username</label>
                        </div>

                        <div className="input-group-regis">
                            <input className='phone' type="text" id='phone' required 
                            pattern='^(0)[0-9]{9}$' value={form.phone} onChange={handleChange}/>
                            <label htmlFor="phone">Phone</label>
                        </div>

                        <div className="input-group-regis">
                            <input className='email' type="email" id='email' required 
                            value={form.email} onChange={handleChange}/>
                            <label htmlFor="email">Email</label>
                        </div>

                        <div className="input-group-regis">
                            <input className='pass' type="password" id='password' required 
                            value={form.password} onChange={handleChange}/>
                            <label htmlFor="password">Password</label>
                        </div>

                        <button type="submit" className="regis-but">Register</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Register