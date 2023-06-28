"use client";
import { useSession } from "next-auth/react";
import React from "react";
import { redirect, useRouter } from "next/navigation";

function MyProfile(props) {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signin");
    },
  });
  const naviagtor = useRouter();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "30px",
      }}
    >
      <h3>Logged in as : {session?.user?.name} </h3>
      <h4>email : {session?.user.email} </h4>
    </div>
  );
}

export default MyProfile;
