"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function NavBar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-evenly",
        margin: "0 auto",
        width: "100%",
        marginTop: "50px",
      }}
    >
      {session?.sub ? (
        <>
          <Link
            href="/my-profile"
            style={{ color: pathname === "/my-profile" ? "white" : "grey" }}
          >
            My Profile
          </Link>

          <Link href="/" style={{ color: pathname === "/" ? "white" : "grey" }}>
            All Posts
          </Link>

          <Link
            href="/post/create"
            style={{ color: pathname === "/post/create" ? "white" : "grey" }}
          >
            Create Post
          </Link>
        </>
      ) : null}
    </nav>
  );
}

export default NavBar;
