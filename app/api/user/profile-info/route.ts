import { getTokenData } from "@/lib/getTokenData";

import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import connectDB from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const userId = await getTokenData(request);
    const user = await User.findOne({ _id: userId }).select("-passwordHash");
    return NextResponse.json({
      mesaaage: "User found",
      data: user,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
