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

    const indexOfIfAlreadyUpVoted = post.upvotes.indexOf(creator);

    if (indexOfIfAlreadyUpVoted > -1) {
      post.upvotes.splice(indexOfIfAlreadyUpVoted, 1);
    }

    const checkIfAlready = post.downvotes.filter(
      (creatorId) => creatorId === creator,
    );

    console.log("DOWNVOTES : ", checkIfAlready);

    if (checkIfAlready.length === 0) {
      post.downvotes.push(creator);
    } else {
      const index = post.downvotes.indexOf(creator);
      if (index > -1) {
        post.downvotes.splice(index, 1);
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
    { downvotes: post.downvotes, upvotes: post.upvotes },
    { status: 201 },
  );
}
