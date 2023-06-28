"use client";
import React, { useRef, useState } from "react";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

function page() {
  const textAreaRef = useRef(null);
  const [title, setTitle] = useState("");
  const [Desc, setDesc] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  const { data } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signin");
    },
  });

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleDesc = (e) => {
    setDesc(e.target.value);

    textAreaRef.current.style.height = "auto";
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
  };

  async function postData() {
    if (title === "" || Desc === "") {
      alert("Plase insert title and Desc correctly");
      return;
    }

    let responseData;
    try {
      setResponseMsg("");
      setIsLoading(true);
      const response = await fetch("http://localhost:3000/api/products/post", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title: title,
          description: Desc,
        }),
      });

      responseData = await response.json();
      if (response.status !== 201) {
        throw new Error(responseData.message);
      }

      setIsLoading(false);
    } catch (error) {
      setResponseMsg("ERROR : ", error.message);
      setIsLoading(false);
      return;
    }

    setResponseMsg(responseData.message);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "100px",
      }}
    >
      {isLoading === true && <h2>Loading...</h2>}
      {responseMsg !== "" && <h2>{responseMsg}</h2>}

      <h2>Post an Anonymous Opinion</h2>

      <input
        className={styles.inputField}
        type="text"
        placeholder="title"
        value={title}
        onChange={handleTitle}
      />
      <textarea
        ref={textAreaRef}
        className={styles.descriptionField}
        placeholder="Description"
        value={Desc}
        onChange={handleDesc}
      />
      <button className={styles.btn} onClick={postData}>
        POST DATA
      </button>
    </div>
  );
}

export default page;
