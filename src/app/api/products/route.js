import { NextResponse } from "next/server";
import connectToDB from "../../../../utlis/connectMongo";
import productModal from "../../../../utlis/model/product";
import { headers } from "next/dist/client/components/headers";

export const dynamic = "force-dynamic";
export async function GET(req) {
  await connectToDB();
  
  const skipp =  headers().get("skip");
  const skipValue = parseInt(skipp);
   
  let products;
  try {
    products = await productModal.find({}).limit(3).skip(skipValue);
  } catch (error) {
    console.log("ERROR" + error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  console.log(products);

  return NextResponse.json(
    {
      products: products,
    },
    { status: 200 },
  );
}
