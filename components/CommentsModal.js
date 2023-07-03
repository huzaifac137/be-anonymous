"use client";
import React, { useEffect, useState } from "react";
import styles from "./commentsModal.module.css";

function CommentsModal({ postId, setModalIsOpened }) {
  const [isLoading, setIsLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  const [comments, setComments] = useState([]);
  const [loadMore, setLoadMore] = useState(0);
  const [isEndOfComments, setIsEndOfComments] = useState(false);

  const fetchComments = async (signal, commentsLength) => {
    let responseData;
    try {
      console.log("Comments length : ", commentsLength);
      setResponseMsg("");
      setIsLoading(true);
      const response = await fetch(
        `/api/products/comments/${postId + "---" + commentsLength}`,
        { signal: signal },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      responseData = await response.json();
      if (response.status !== 200) {
        throw new Error(responseData.message);
      }

      const comments = responseData.comments;
      console.log("PRODUCTS", comments);
      setComments((prev) => {
        return [...prev, ...comments];
      });
      setIsLoading(false);

      if (comments.length === 0) {
        setIsEndOfComments(true);
      }
    } catch (error) {
      const errorMessage = error.message;
      setResponseMsg(errorMessage);

      setIsLoading(false);
    }
  };

  const handleModal = () => {
    setModalIsOpened(false);
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    fetchComments(signal, comments.length ? comments.length : 0);

    return () => {
      controller.abort();
    };
  }, [loadMore]);

  return (
    <div className={styles.modalContainer}>
      <div className={styles.actualModal}>
        <button
          onClick={handleModal}
          style={{
            alignSelf: "flex-end",
            marginRight: "20px",
            marginTop: "20px",
          }}
        >
          Close
        </button>
        <h3
          style={{
            alignSelf: "center",
            marginTop: "17px",
            borderBottom: "1px solid white",
            marginBottom: "5px",
          }}
        >
          Comments
        </h3>

        {isLoading === true ? (
          <h4 style={{ alignSelf: "center" }}>Loading comments....</h4>
        ) : null}
        {responseMsg !== "" ? (
          <h3 style={{ alignSelf: "center" }}>{responseMsg}</h3>
        ) : null}

        {comments?.map((comment) => (
          <div className={styles.comment} key={comment.id}>
            <h4>{comment.creatorName}</h4>
            <h5>{comment.text}</h5>
          </div>
        ))}

        {isEndOfComments === false ? (
          <button
            style={{ alignSelf: "center" }}
            onClick={() => setLoadMore(comments.length)}
          >
            Load more
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default CommentsModal;
