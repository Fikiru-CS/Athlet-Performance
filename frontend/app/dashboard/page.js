"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5000/api/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStats(res.data));
  }, []);

  return (
    <div>
      <h2>Total Distance: {stats.total_distance}</h2>
      <h2>Total Duration: {stats.total_duration}</h2>
      <h2>Total Calories: {stats.total_calories}</h2>
    </div>
  );
}