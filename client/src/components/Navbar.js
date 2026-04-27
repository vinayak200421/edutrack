// Renders a compact dashboard navbar with role text and logout action.
import React from "react";

// Clears auth storage and reloads the app; accepts no params and returns nothing.
const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.reload();
};
// Shows the current dashboard label and logout button.
function Navbar() {
  const role = localStorage.getItem("role");

  return (
    <div style={{
  background: "rgb(15, 23, 42)",
  color: "white",
  padding: "15px 30px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
}}>
  <h2>EduTrack</h2>

  <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
    <span>{role === "admin" ? "Admin Dashboard" : "Student Dashboard"}</span>

    <button
      onClick={handleLogout}
      style={{
        padding: "6px 12px",
        background: "#ef4444",
        border: "none",
        borderRadius: "5px",
        color: "white",
        cursor: "pointer"
      }}
    >
      Logout
    </button>
  </div>
</div>
  );
}

export default Navbar;
