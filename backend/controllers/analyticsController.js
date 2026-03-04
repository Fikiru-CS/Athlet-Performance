const pool = require("../config/db");

exports.getSummary = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) AS total_sessions,
              COALESCE(SUM(distance_km),0) AS total_distance,
              COALESCE(SUM(duration_minutes),0) AS total_duration
       FROM sessions
       WHERE user_id=$1`,
      [req.user.id]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch {
    res.status(500).json({ success: false });
  }
};