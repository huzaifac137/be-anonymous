"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState  , useRef} from "react";
import styles from "./page.module.css";
import hamburger from "../public/images/hamburger.png";
import close from "../public/images/close.png";
import Image from "next/image";

function NavBar() {
  const menuRef = useRef();
  const pathname = usePathname();
  const { data: session } = useSession();
  const[menuIsOpen , setMenuIsOpen] = useState(false);

  const handleMenu=()=>{
    if(menuIsOpen===false)
    {
      setMenuIsOpen((prev)=> !menuIsOpen);


    }

    else
    {
    
      setMenuIsOpen((prev)=>!prev);
    }
  
  }

  return (
    <>
      <div className={styles.ham} onClick={handleMenu}>
       <Image src={menuIsOpen===true ? close : hamburger}  width={menuIsOpen===true ? 30 : 50}  height={menuIsOpen===true ? 30 : 50}/>
      </div>
    <nav className={menuIsOpen===false ?  styles.navbar : styles.open} ref={menuRef}
 
    >
      {session?.sub ? (
        <>
          <Link onClick={handleMenu}
            href="/my-profile"
            style={{ color: pathname === "/my-profile" ? "white" : "grey" }}
          >
            My Profile
          </Link>

          <Link onClick={handleMenu} href="/" style={{ color: pathname === "/" ? "white" : "grey" }}>
            All Posts
          </Link>

          <Link
          onClick={handleMenu}
            href="/post/create"
            style={{ color: pathname === "/post/create" ? "white" : "grey" }}
          >
            Create Post
          </Link>

          <Link href="/chatroom" onClick={handleMenu}   style={{ color: pathname === "/chatroom" ? "white" : "grey" }}> chat-room </Link>
        </>
      ) : null}
    </nav>
    </>
  );
}

export default NavBar;
