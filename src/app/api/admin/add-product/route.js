

import { NextResponse } from "next/server";
import Product from "@/models/product";
import connectToDB from "@/database";


export async function POST(req) {
  try {
    await connectToDB();
    const data = await req.json();

    // ✅ normalize category
    data.category = data.category.toLowerCase();

    const product = await Product.create(data);

    return NextResponse.json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
