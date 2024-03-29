"use client";
import { signOut } from "next-auth/react";
import React from "react";

function Logout(props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20px",
      }}
    >
      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
}

export default Logout;
