import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    mongodb: process.env.MONGODB_URI ? "✅ Connected" : "❌ Missing",
    nextauth: process.env.NEXTAUTH_SECRET ? "✅ Set" : "❌ Missing",
    uploadthing_secret: process.env.UPLOADTHING_SECRET
      ? "✅ Set"
      : "❌ Missing",
    uploadthing_id: process.env.UPLOADTHING_APP_ID ? "✅ Set" : "❌ Missing",
  });
}
