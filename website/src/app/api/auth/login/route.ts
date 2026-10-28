import { NextResponse } from "next/server";

import { container } from "@/infrastructure/di/container";

export async function POST(request: Request) {
  const payload: unknown = await request.json();
  if (!payload || typeof payload !== "object" || !("email" in payload) || !("password" in payload)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { email, password } = payload as { email: unknown; password: unknown };
  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }
  const user = await container.controllers.auth.findActiveUserByEmail(email);
  if (!user || password !== "Demo@1234") {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const response = NextResponse.json({ role: user.role });
  response.cookies.set("manhal-session", user.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return response;
}
