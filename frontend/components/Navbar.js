"use client";
import Link from "next/link";

export default function Navbar() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="navbar">
      <Link href="/">Home</Link>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/sessions">Sessions</Link>
      <Link href="/login">Login</Link>
      <Link href="/register">Register</Link>
      <button onClick={logout} style={{ marginLeft: "20px" }}>
        Logout
      </button>
    </div>
  );
}