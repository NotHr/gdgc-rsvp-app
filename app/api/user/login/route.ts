import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import connectDB from "@/lib/db";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const POST = async (request: NextRequest) => {
  try {
    await connectDB();
    const req = await request.json();
    const { email, password } = req;
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User with this email doesnt exists" },
        { status: 400 }
      );
    }

    const isPasswordValid = await bcryptjs.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    const tokenData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    if (!process.env.TOKEN_SECRET) {
      throw new Error("TOKEN_SECRET is not defined in environment variables");
    }

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, {
      expiresIn: "3d",
    });

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 3,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
};
