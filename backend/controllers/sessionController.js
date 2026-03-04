const pool = require("../config/db");

/*
============================================
CREATE SESSION
============================================
*/
exports.createSession = async (req, res) => {
  try {
    const {
      sport_type_id,
      distance_km,
      duration_minutes,
      avg_speed,
      avg_pace,
      calories_burned,
      session_date,
    } = req.body;

    if (!sport_type_id || !distance_km || !duration_minutes) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const result = await pool.query(
      `INSERT INTO sessions
       (user_id,sport_type_id,distance_km,duration_minutes,
        avg_speed,avg_pace,calories_burned,session_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [
        req.user.id,
        sport_type_id,
        distance_km,
        duration_minutes,
        avg_speed,
        avg_pace,
        calories_burned,
        session_date,
      ]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Create Session Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/*
============================================
GET USER SESSIONS
============================================
*/
exports.getSessions = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, st.name AS sport
       FROM sessions s
       JOIN sport_types st ON s.sport_type_id = st.id
       WHERE s.user_id=$1
       ORDER BY session_date DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Fetch Sessions Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/*
============================================
DELETE SESSION
============================================
*/
exports.deleteSession = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await pool.query(
      "DELETE FROM sessions WHERE id=$1 AND user_id=$2 RETURNING *",
      [id, req.user.id]
    );

    if (deleted.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    res.json({ success: true, message: "Session deleted" });
  } catch (error) {
    console.error("Delete Session Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};