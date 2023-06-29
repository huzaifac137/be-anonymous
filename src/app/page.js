import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

import Logout from "../../components/Logout";
import Posts from "./home/page";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/dist/server/api-utils";

export const metadata = {
  title: "Huzaifa",
  description:
    "This is a next js app where you canfind the best developers across the pakistan",
};

// async function fetchData() {
//   let responseData;
//   try {
//     const response = await fetch("http://localhost:3000/api/products", {
//       headers: {
//         "Content-Type": "application/json",
//       },
//       cache: "no-cache",
//     });

//     responseData = await response.json();
//     if (response.status !== 200) {
//       throw new Error(responseData.message);
//     }
//   } catch (error) {
//     const errorMessage = ("ERROR : ", error.message);
//     return errorMessage;
//   }

//   const products = responseData.products;
//   console.log("PRODUCTS", products);
//   console.log(products);

//   return products;
// }

async function Home(props) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/signin");
  }

  // const products = await fetchData();

  return (
    <Posts />
    // <div className={styles.home}>
    //   {session ? <Logout /> : null}

    //   {typeof products === "string" ? (
    //     <h2>{products}</h2>
    //   ) : products?.length === 0 ? (
    //     <h2>No posts found!</h2>
    //   ) : (
    //     products?.map((item) => (
    //       <div key={item._id} className={styles.product}>
    //         <h3 style={{ alignSelf: "flex-start", fontSize: "14px" }}>
    //           {session?.sub === item.creator
    //             ? item.creatorName
    //             : "anonymous user"}
    //         </h3>
    //         <h2>{item.title}</h2>

    //         <Link
    //           style={{ marginTop: "50px" }}
    //           href={{
    //             pathname: `/post/${item._id}`,
    //             query: {
    //               title: item.title,
    //               description: item.description,
    //               creatorName:
    //                 session?.sub === item.creator
    //                   ? item.creatorName
    //                   : "anonymous user",
    //               creator: item.creator,
    //               upvotes: item.upvotes.length,
    //               downvotes: item.downvotes.length,
    //               upvoter:
    //                 item.upvotes.filter((i) => i === session.sub).length === 0
    //                   ? ""
    //                   : session.sub,
    //               downvoter:
    //                 item.downvotes.filter((i) => i === session.sub).length === 0
    //                   ? ""
    //                   : session.sub,
    //             },
    //           }}
    //         >
    //           View Full Post
    //         </Link>
    //       </div>
    //     ))
    //   )}
    // </div>
  );
}

export default Home;
