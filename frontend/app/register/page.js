"use client";

import { useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const { name, email, password } = form;

    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      // Call backend without assigning to res
      await axios.post(
        "http://localhost:5000/api/auth/register",
        form,
        { headers: { "Content-Type": "application/json" } }
      );

      alert("Registered successfully");
      window.location.href = "/login";
    } catch (error) {
      console.error("Full error object:", error);

      const message =
        error.response?.data?.msg || 
        error.response?.data?.message || 
        error.message || 
        "Unknown error";

      alert("Registration failed: " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card">
          <h2>Register</h2>
          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button onClick={handleRegister} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
      </div>
    </>
  );
}