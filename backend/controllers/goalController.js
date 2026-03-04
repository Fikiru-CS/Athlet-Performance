const pool = require("../config/db");

/* CREATE */
exports.createGoal = async (req, res) => {
  try {
    const {
      sport_type_id,
      target_distance_km,
      target_duration_minutes,
      start_date,
      end_date,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO goals
       (user_id,sport_type_id,target_distance_km,
        target_duration_minutes,start_date,end_date)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [
        req.user.id,
        sport_type_id,
        target_distance_km,
        target_duration_minutes,
        start_date,
        end_date,
      ]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* GET */
exports.getGoals = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM goals WHERE user_id=$1",
      [req.user.id]
    );

    res.json({ success: true, data: result.rows });
  } catch {
    res.status(500).json({ success: false });
  }
};

/* UPDATE */
exports.updateGoal = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await pool.query(
      `UPDATE goals
       SET status=$1
       WHERE id=$2 AND user_id=$3
       RETURNING *`,
      [req.body.status, id, req.user.id]
    );

    if (updated.rows.length === 0)
      return res.status(404).json({ success: false });

    res.json({ success: true, data: updated.rows[0] });
  } catch {
    res.status(500).json({ success: false });
  }
};

/* DELETE */
exports.deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM goals WHERE id=$1 AND user_id=$2",
      [id, req.user.id]
    );

    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
};