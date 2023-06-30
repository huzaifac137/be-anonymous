"use client";

import styles from "./page.module.css";
import Link from "next/link";

import { redirect } from "next/navigation";
import Logout from "../../../components/Logout";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

function Posts(props) {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signin");
    },
  });
  const [posts, setPosts] = useState([]);
  const [responseMsg, setResponseMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    let responseData;
    try {
      setResponseMsg("");
      setIsLoading(true);
      const response = await fetch(`/api/products`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      responseData = await response.json();
      if (response.status !== 200) {
        throw new Error(responseData.message);
      }

      const products = responseData.products;
      console.log("PRODUCTS", products);

      setPosts((prev) => {
        return [...prev, ...products];
      });
      setIsLoading(false);
    } catch (error) {
      const errorMessage = ("ERROR : ", error.message);
      setResponseMsg(errorMessage);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={styles.home}>
      {session ? <Logout /> : null}

      {responseMsg !== "" ? <h2>{responseMsg}</h2> : null}
      {isLoading === true ? (
        <h2>Loading...</h2>
      ) : posts?.length === 0 ? (
        <h2>No posts found!</h2>
      ) : (
        posts?.map((item) => (
          <div key={item._id} className={styles.product}>
            <h3 style={{ alignSelf: "flex-start", fontSize: "14px" }}>
              {session?.sub === item.creator
                ? item.creatorName
                : "anonymous user"}
            </h3>
            <h2>{item.title}</h2>

            <Link
              style={{ marginTop: "50px" }}
              href={{
                pathname: `/post/${item._id}`,
                query: {
                  title: item.title,
                  description: item.description,
                  creatorName:
                    session?.sub === item.creator
                      ? item.creatorName
                      : "anonymous user",
                  creator: item.creator,
                  upvotes: item.upvotes.length,
                  downvotes: item.downvotes.length,
                  upvoter:
                    item.upvotes.filter((i) => i === session?.sub).length === 0
                      ? ""
                      : session.sub,
                  downvoter:
                    item.downvotes.filter((i) => i === session?.sub).length ===
                    0
                      ? ""
                      : session?.sub,
                },
              }}
            >
              View Full Post
            </Link>
          </div>
        ))
      )}
      <button style={{ marginTop: "10px" }}>Load more...</button>
    </div>
  );
}

export default Posts;
