import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card">
          <h1>Welcome to APTS</h1>
          <p>Your Athlete Performance Tracking System</p>
        </div>
      </div>
    </>
  );
}