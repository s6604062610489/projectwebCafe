import "./profile.css";
import NavUser from "../../components/nav_user";
import { useState, useEffect } from "react";

function Profile() {
    const [member, setMember] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // helper: safe JSON
    const safeJson = async (res) => {
        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) {
            const txt = await res.text();
            throw new Error(`คาดว่าจะได้ JSON แต่ได้: ${txt.slice(0, 120)}...`);
        }
        return res.json();
    };

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/logincheck/session", {
                    credentials: "include",
                });
                const data = await safeJson(res);
                if (!res.ok) throw new Error(data.message || "เซสชันไม่ถูกต้อง");

                if (!data.loggedIn) {
                    setError("ยังไม่ได้ล็อกอิน");
                    setLoading(false);
                    return;
                }

                const memberId = data.user.id; // ✅ use Mongo _id from session
                await fetchMember(memberId);
            } catch (err) {
                setError(err.message);
                console.error("❌ โหลด session ล้มเหลว:", err);
                setLoading(false);
            }
        };

        const fetchMember = async (id) => {
            try {
                const res = await fetch(`http://localhost:5000/api/member/${id}`, {
                    credentials: "include",
                });
                const data = await safeJson(res);
                if (!res.ok) throw new Error(data.message || "ไม่สามารถโหลดข้อมูลสมาชิกได้");
                setMember(data.member);
            } catch (err) {
                setError(err.message);
                console.error("❌ โหลดข้อมูลสมาชิกล้มเหลว:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMember((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/member/update/${member._id}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstname: member.firstname,
                    lastname: member.lastname,
                    username: member.username,
                    phone: member.phone,
                    email: member.email,
                }),
            });

            const data = await safeJson(res);
            if (!res.ok) throw new Error(data.message || "อัปเดตไม่สำเร็จ");

            setMember((m) => ({ ...m, ...data.member }));
            alert("✅ บันทึกข้อมูลสำเร็จ");
            setIsEditing(false);
        } catch (err) {
            alert(`❌ ไม่สามารถอัปเดตข้อมูลได้: ${err.message}`);
            console.error(err);
        }
    };

    if (loading) return <div className="profile-loading">กำลังโหลดข้อมูล...</div>;
    if (error) return <div className="profile-error">{error}</div>;
    if (!member) return <div className="profile-error">ไม่พบข้อมูลสมาชิก</div>;

    return (
        <>
            <NavUser />
            <div className="profile-container">
                <div className="title-editpro">
                    <h1>ข้อมูลสมาชิก</h1>
                </div>
                <div className="profile-card">
                    {[
                        { label: "ชื่อ", name: "firstname" },
                        { label: "นามสกุล", name: "lastname" },
                        { label: "ชื่อผู้ใช้", name: "username" },
                        { label: "เบอร์โทร", name: "phone" },
                        { label: "อีเมล", name: "email", type: "email" },
                        { label: "แต้มสะสม", name: "point", readOnly: true },
                    ].map(({ label, name, type = "text", readOnly }) => (
                        <div key={name} className="profile-row">
                            <label>{label}:</label>
                            <input
                                type={type}
                                name={name}
                                value={member[name] ?? ""}
                                onChange={handleChange}
                                readOnly={readOnly || !isEditing}
                            />
                        </div>
                    ))}

                    <div className="profile-buttons">
                        {isEditing ? (
                            <button className="save-btn" onClick={handleSave}>บันทึก</button>
                        ) : (
                            <button className="edit-btn" onClick={() => setIsEditing(true)}>แก้ไข</button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;
