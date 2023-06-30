"use client";

import { useParams, usePathname } from "next/navigation";

import React, { Fragment, useEffect, useState } from "react";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";
import upvote from "../../../../public/images/arrow-up.png";
import downvote from "../../../../public/images/arrow-down.png";
import upvoteFilled from "../../../../public/images/arrow-up-filled.png";
import downvoteFilled from "../../../../public/images/arrow-down-filled.png";
import Image from "next/image";
import CommentsModal from "../../../../components/CommentsModal";
import { createPortal } from "react-dom";

function page({}) {
  const params = useParams();
  const [query, setQuery] = useState({
    title: "",
    description: "",
    creatorName: "",
    creator: "",
    upvotes: 0,
    downvotes: 0,
    upvoter: [],
    downvoter: [],
  });
  const [id, setId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  const [addComment, setAddComment] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [responseMsg2, setResponseMsg2] = useState("");
  const [openCommentsModal, setOpenCommentsModal] = useState(false);

  const { data: session } = useSession();

  useEffect(() => {
    const urlparams = new URLSearchParams(window.location.search);

    let qry = {};
    for (const [key, value] of urlparams.entries()) {
      qry[key] = value;
    }

    setQuery(qry);
  }, [params.id]);

  async function handleDelete() {
    let responseData;
    try {
      setResponseMsg("");
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/products/delete`,
        {
          method: "DELETE",

          headers: {
            "Content-Type": "application/json",
            "X-ID": params.id,
          },
        },
      );

      responseData = await response.json();
      if (response.status !== 201) {
        throw new Error(responseData.message);
      }

      setIsLoading(false);
    } catch (error) {
      setResponseMsg(error.message);
      setIsLoading(false);
      return;
    }

    setResponseMsg(responseData.message);
  }

  const handleUpVote = async () => {
    let responseData;
    try {
      setResponseMsg("");

      const response = await fetch(
        `http://localhost:3000/api/products/vote/up`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            id: params.id,
          }),
        },
      );

      responseData = await response.json();
      if (response.status !== 201) {
        throw new Error(responseData.message);
      }
    } catch (error) {
      setResponseMsg(error.message);

      return;
    }

    const alreadyUpvoted = responseData.upvotes.filter(
      (user) => user === session?.sub,
    );

    console.log("UPVOTERS : ", alreadyUpvoted);

    let isUpvotedBy;

    if (alreadyUpvoted.length === 0) {
      isUpvotedBy = "";
    } else {
      isUpvotedBy = alreadyUpvoted[0];
    }

    const downvotess = responseData.downvotes.length;
    setQuery({
      title: query.title,
      description: query.description,
      creatorName: query.creatorName,
      creator: query.creator,
      upvotes: responseData.upvotes.length,
      downvotes: downvotess,
      upvoter: isUpvotedBy,
      downvoter: "",
    });
  };

  const handleDownVote = async () => {
    let responseData;
    try {
      setResponseMsg("");

      const response = await fetch(
        `http://localhost:3000/api/products/vote/down`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            id: params.id,
          }),
        },
      );

      responseData = await response.json();
      if (response.status !== 201) {
        throw new Error(responseData.message);
      }
    } catch (error) {
      setResponseMsg(error.message);

      return;
    }

    const alreadyDownVoted = responseData.downvotes.filter(
      (user) => user === session?.sub,
    );

    console.log("DOWNVOTERS : ", alreadyDownVoted);

    let isDownVotedBy;

    if (alreadyDownVoted.length === 0) {
      isDownVotedBy = "";
    } else {
      isDownVotedBy = alreadyDownVoted[0];
    }

    const upvotess = responseData.upvotes.length;

    setQuery({
      title: query.title,
      description: query.description,
      creatorName: query.creatorName,
      creator: query.creator,
      upvotes: upvotess,
      downvotes: responseData.downvotes.length,
      upvoter: "",
      downvoter: isDownVotedBy,
    });
  };

  const handleAddComment = async () => {
    let responseData;
    try {
      setResponseMsg2("");
      setIsPostingComment(true);
      const response = await fetch(
        `http://localhost:3000/api/products/add-comment`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: addComment,
            postId: params.id,
          }),
        },
      );

      responseData = await response.json();
      if (response.status !== 201) {
        throw new Error(responseData.message);
      }

      setIsPostingComment(false);
    } catch (error) {
      setResponseMsg2(error.message);
      setIsPostingComment(false);
      return;
    }

    setAddComment("");
    setResponseMsg2(responseData.message);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "40px",
      }}
    >
      {isLoading && <h2>Deleting data...</h2>}

      {responseMsg !== "" ? (
        <h2>{responseMsg}</h2>
      ) : (
        <div className={styles.card}>
          {" "}
          <h3 style={{ fontSize: "15px" }}> {query.creatorName} </h3>
          <h2 className={styles.hh2}> {query.title}</h2>
          <h3 className={styles.hh3}> {query.description}</h3>
          <div className={styles.voteSection}>
            <div>
              {" "}
              <Image
                onClick={handleUpVote}
                src={query.upvoter === session?.sub ? upvoteFilled : upvote}
                width={25}
                height={25}
                alt="upvote"
              />{" "}
              <h4>{query.upvotes}</h4>
            </div>
            <div>
              {" "}
              <Image
                onClick={handleDownVote}
                src={
                  query.downvoter === session?.sub ? downvoteFilled : downvote
                }
                width={25}
                height={25}
                alt="downnvote"
              />{" "}
              <h4>{query.downvotes}</h4>
            </div>
          </div>
          {query.creator === session?.sub ? (
            <button onClick={handleDelete}>Delete</button>
          ) : null}
        </div>
      )}
      <div className={styles.addCommentContainer}>
        <textarea
          className={styles.descriptionField}
          placeholder="add a comment"
          value={addComment}
          onChange={(e) => setAddComment(e.target.value)}
        />
        <button onClick={handleAddComment}>Add</button>
      </div>
      {isPostingComment === true ? <h4>Posting comment...</h4> : null}
      {responseMsg2 !== "" ? <h4>{responseMsg2}</h4> : null}

      <h4
        onClick={() => setOpenCommentsModal((prev) => !prev)}
        style={{ color: "gray", cursor: "pointer", marginBottom: "10px" }}
      >
        See Comments
      </h4>
      {openCommentsModal === true
        ? createPortal(
            <CommentsModal
              postId={params.id}
              setModalIsOpened={setOpenCommentsModal}
            />,
            document.body,
          )
        : null}
    </div>
  );
}

export default page;
