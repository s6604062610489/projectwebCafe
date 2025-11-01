const express = require('express');
const router = express.Router();
const Member = require('../models/Member.js');
const argon2 = require('argon2');
const PEPPER = process.env.PEPPER;

router.post('/register', async (req, res) => {
    try {
        const { firstname, lastname, username, phone, email, password } = req.body;

        if (!firstname || !lastname || !username || !phone || !email || !password) {
            return res.status(400).json({ message: 'กรอกข้อมูลให้ครบถ้วน' })
        }

        const e_check = await Member.findOne({
            $or: [{ email }]
        });
        if (e_check) {
            return res.status(400).json({ message: 'Email นี้ถูกใช้แล้ว' });
        }

        const u_check = await Member.findOne({
            $or: [{ username }]
        });
        if (u_check) {
            return res.status(400).json({ message: 'Username นี้ถูกใช้แล้ว' });
        }

        const lastMember = await Member.findOne().sort({ member_id: -1 });
        let newId = "MB001";

        if (lastMember && lastMember.member_id) {
            const lastNum = parseInt(lastMember.member_id.replace("MB", ""), 10);
            const nextNum = lastNum + 1;
            newId = "MB" + String(nextNum).padStart(3, "0");
        }

        const combinedPassword = password + PEPPER;
        const hashed = await argon2.hash(combinedPassword, { type: argon2.argon2id });

        const newMember = new Member({
            member_id: newId,
            firstname,
            lastname,
            username,
            phone,
            email,
            password: hashed,
            role: "user"
        });

        await newMember.save();
        res.status(201).json({ message: 'Success Register member' });
    } catch (err) {
        res.status(500).json({ message: 'Can not Register', error: err.message });
    }
});

router.get('/leaderboard', async (req, res) => {
    try {
        const leaderboard = await Member.find({ role: "user" })
            .select("username point phone")
            .sort({ point: -1 });
        res.status(200).json({ leaderboard });
    } catch (err) {
        res.status(500).json({ message: "ไม่สามารถดึง leaderboard ได้", error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const member = await Member.findById(id).select('-password -__v');
        if (!member) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลสมาชิก' });
        }
        res.status(200).json({ member });
    } catch (err) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล', error: err.message });
    }
});

router.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { firstname, lastname, username, phone, email } = req.body;

        const member = await Member.findByIdAndUpdate(
            id,
            { firstname, lastname, username, phone, email },
            { new: true }
        ).select("-password -__v");

        if (!member) {
            return res.status(404).json({ message: "ไม่พบข้อมูลสมาชิก" });
        }

        res.status(200).json({
            message: "อัปเดตข้อมูลสำเร็จ",
            member: {
                member_id: member.member_id,
                firstname: member.firstname,
                lastname: member.lastname,
                username: member.username,
                phone: member.phone,
                email: member.email
            }
        });
    } catch (err) {
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดต", error: err.message });
    }
});

module.exports = router;