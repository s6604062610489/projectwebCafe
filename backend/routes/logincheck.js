const express = require("express");
const router = express.Router();
const Member = require("../models/Member");
const argon2 = require('argon2');
const PEPPER = process.env.PEPPER;

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const member = await Member.findOne({ username });
        if (!member) return res.status(400).json({ message: "User not found" });

        const isMatch = await argon2.verify(member.password, password + PEPPER);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        req.session.user = {
            id: member._id,
            member_id: member.member_id,
            role: member.role,
            username: member.username,
        };

        res.json({
            message: "Login successful",
            user: req.session.user,
            sessionID: req.sessionID,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully" });
    });
  } else {
    res.json({ message: "No active session" });
  }
});

router.get("/session", (req, res) => {
  if (req.session && req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

module.exports = router;
