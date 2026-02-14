//Update Products 

import { NextResponse } from "next/server";
import connectToDB from "@/database";
import Product from "@/models/product";

export async function PUT(req) {
  try {
    await connectToDB();
    const data = await req.json();

    const updated = await Product.findByIdAndUpdate(
      data._id,
      data,
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
