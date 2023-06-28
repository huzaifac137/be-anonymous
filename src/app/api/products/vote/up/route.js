const { getServerSession } = require("next-auth");
const { NextResponse } = require("next/server");
import connectToDB from "../../../../../../utlis/connectMongo";
const { getToken } = require("next-auth/jwt");
import productModal from "../../../../../../utlis/model/product";
const jwt = require("jsonwebtoken");

export async function PATCH(request) {
  if (request.method !== "PATCH") {
    return NextResponse.json({ message: "Invalid request" }, { status: 409 });
  }

  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ message: "Not authorized!" }, { status: 401 });
  }

  await connectToDB();

  const token = await getToken({ req: request });

  let decoded, creator;
  if (token.idToken) {
    decoded = jwt.decode(token.idToken);

    creator = decoded.sub;
  }

  if (!token.idToken) {
    decoded = jwt.verify(token.jwt, process.env.NEXTAUTH_SECRET);
    creator = decoded.sub;
  }

  const { id } = await request.json();

  let post;
  try {
    post = await productModal.findById(id);

    console.log("POST : ", post);

    const indexOfIfAlreadyDownVoted = post.downvotes.indexOf(creator);

    if (indexOfIfAlreadyDownVoted > -1) {
      post.downvotes.splice(indexOfIfAlreadyDownVoted, 1);
    }

    const checkIfAlready = post.upvotes.filter(
      (creatorId) => creatorId === creator,
    );

    console.log("UPVOTES : ", checkIfAlready);

    if (checkIfAlready.length === 0) {
      post.upvotes.push(creator);
    } else {
      const index = post.upvotes.indexOf(creator);
      if (index > -1) {
        post.upvotes.splice(index, 1);
      }
    }

    await post.save();
  } catch (error) {
    console.log("ERROR : ", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { upvotes: post.upvotes, downvotes: post.downvotes },
    { status: 201 },
  );
}
