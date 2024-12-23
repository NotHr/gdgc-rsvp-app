import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

interface TokenDecoded extends JwtPayload {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const getTokenData = async (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value || "";
    const decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET!
    ) as JwtPayload;

    if (
      typeof decodedToken === "object" &&
      decodedToken &&
      "id" in decodedToken &&
      "name" in decodedToken &&
      "email" in decodedToken &&
      "role" in decodedToken
    ) {
      const tokenData = decodedToken as TokenDecoded;
      console.log(tokenData);
      return tokenData.id; // Return the ID from the decoded token
    }

    throw new Error("Token payload does not match expected format");
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid or expired token");
    }
    throw new Error((error as Error).message);
  }
};
