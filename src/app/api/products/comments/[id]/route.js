import { NextResponse } from "next/server";

import commentModal from "../../../../../../utlis/model/comment";
import connectToDB from "../../../../../../utlis/connectMongo";
import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { headers } from "next/dist/client/components/headers";

export async function GET(request, { params }) {
  if (request.method !== "GET") {
    return NextResponse.json({ message: "invalid request" }, { status: 409 });
  }

  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ message: "Not authorized!" }, { status: 401 });
  }

  await connectToDB();

  const token = await getToken({ req: request });

  let decoded, creator, creatorName;
  if (token.idToken) {
    decoded = jwt.decode(token.idToken);

    creatorName = decoded.given_name;
    creator = decoded.sub;
  }

  if (!token.idToken) {
    decoded = jwt.verify(token.jwt, process.env.NEXTAUTH_SECRET);
    creator = decoded.sub;
    creatorName = decoded.name;
  }

  let comments;
  const splitParams = params.id.split("---");
  const skip = splitParams[1];

  try {
    console.log(skip);
    comments = await commentModal
      .find({
        belongsTo: splitParams[0],
      })
      .limit(5)
      .skip(parseInt(skip));
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      comments: comments.map((comment) => comment.toObject({ getters: true })),
    },
    { status: 200 },
  );
}
