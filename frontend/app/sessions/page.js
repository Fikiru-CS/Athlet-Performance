"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Load sessions safely inside effect
  useEffect(() => {
    const loadSessions = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          "http://localhost:5000/api/sessions",
          {
            headers: { Authorization: "Bearer " + token },
          }
        );

        setSessions(res.data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, []);

  // ✅ Create session
  const createSession = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");

    try {
      await axios.post(
        "http://localhost:5000/api/sessions",
        {
          distance_km: Number(distance),
          duration_minutes: Number(duration),
        },
        {
          headers: { Authorization: "Bearer " + token },
        }
      );

      setDistance("");
      setDuration("");

      // Refresh list after creation
      const res = await axios.get(
        "http://localhost:5000/api/sessions",
        {
          headers: { Authorization: "Bearer " + token },
        }
      );

      setSessions(res.data);
    } catch (error) {
      console.error("Error creating session:", error);
      alert("Failed to create session");
    }
  };

  // ✅ Delete session
  const deleteSession = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/sessions/${id}`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );

      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <div className="card">
          <h2>Create Training Session</h2>

          <input
            placeholder="Distance (km)"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          />

          <input
            placeholder="Duration (minutes)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />

          <button onClick={createSession}>
            Add Session
          </button>
        </div>

        <h2>Your Sessions</h2>

        {loading ? (
          <p>Loading sessions...</p>
        ) : sessions.length === 0 ? (
          <p>No sessions yet.</p>
        ) : (
          sessions.map((s) => (
            <div className="card" key={s.id}>
              <p><strong>Date:</strong> {s.training_date}</p>
              <p><strong>Distance:</strong> {s.distance_km} km</p>
              <p><strong>Duration:</strong> {s.duration_minutes} min</p>
              <p><strong>Average Speed:</strong> {Number(s.avg_speed).toFixed(2)} km/h</p>
              <p><strong>Pace:</strong> {Number(s.avg_pace).toFixed(2)} min/km</p>

              <button
                style={{ background: "#e53935", marginTop: "10px" }}
                onClick={() => deleteSession(s.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}