"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { signIn, useSession } from "next-auth/react";

import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import google from "../../../public/images/google.png";

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data, status } = useSession();
  const navigator = useRouter();

  useEffect(() => {
    if (status == "loading") {
      setIsLoading(true);
    } else if (status == "authenticated") {
      setIsLoading(false);
      navigator.push("/");
    } else if (status == "unauthenticated") {
      setIsLoading(false);
    }
  }, [status]);

  const handleChange = (setState) => (event) => {
    setState(event.target.value);
  };

  const handleCustomeLogin = async () => {
    try {
      const result = await signIn("credentials", {
        email: email,
        password: password,
        callbackUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
      });
    } catch (Err) {
      console.log(Err.message + "  " + Err.code);
    }
  };

  if (isLoading === true) {
    return <h2>Loading...</h2>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "30px",
        marginTop: "100px",
      }}
    >
      <input
        type="email"
        placeholder="email"
        className={styles.inputField}
        value={email}
        onChange={handleChange(setEmail)}
      />
      <input
        type="password"
        placeholder="password"
        className={styles.inputField}
        value={password}
        onChange={handleChange(setPassword)}
      />
      <button className={styles.btn} onClick={handleCustomeLogin}>
        Sign in
      </button>

      <h3>
        Dont have an account ? Register{" "}
        <Link style={{ color: "GrayText" }} href="/signup">
          Here
        </Link>{" "}
      </h3>

      <h3>or</h3>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          justifyContent: "center",
          cursor: "pointer",
        }}
        onClick={() =>
          signIn("google", {
            callbackUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
          })
        }
        className={styles.btn}
      >
        <Image src={google} width={25} height={25} alt="google login" />
        Login
      </div>
    </div>
  );
}

export default Signin;
