const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/*
============================================
REGISTER
============================================
*/
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check existing email
    const existing = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔥 Get role_id from roles table
    const roleName = role || "athlete";

    const roleResult = await pool.query(
      "SELECT id FROM roles WHERE name=$1",
      [roleName]
    );

    if (roleResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const role_id = roleResult.rows[0].id;

    // ✅ Insert using role_id
    const result = await pool.query(
      `INSERT INTO users (name,email,password,role_id)
       VALUES ($1,$2,$3,$4)
       RETURNING id,name,email,role_id`,
      [name, email, hashedPassword, role_id]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/*
============================================
LOGIN
============================================
*/
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      `SELECT u.*, r.name as role
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.email=$1`,
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const valid = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!valid) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      role: user.rows[0].role
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};