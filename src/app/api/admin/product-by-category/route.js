
import connectToDB from "@/database";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);

    // ✅ correct param name
    const category = searchParams.get("category");

    if (!category) {
      return NextResponse.json({
        success: false,
        message: "Category is required",
      });
    }

    // ✅ case-insensitive search
    const getData = await Product.find({
      category: { $regex: new RegExp(`^${category}$`, "i") },
    });

    return NextResponse.json({
      success: true,
      data: getData || [],
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again later",
    });
  }
}
