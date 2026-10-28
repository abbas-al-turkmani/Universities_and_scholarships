import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import type { Actor } from "@/application/ports";
import { DomainError } from "@/domain/errors";
import { container } from "@/infrastructure/di/container";

const updateSchema = z.object({
  applicationId: z.string().min(1),
  status: z.enum(["SUBMITTED", "UNDER_REVIEW", "DOCUMENTS_REQUESTED", "ACCEPTED", "REJECTED", "WAITLISTED", "WITHDRAWN"]),
  comment: z.string().max(1000).default(""),
});

export async function POST(request: Request) {
  const sessionId = (await cookies()).get("manhal-session")?.value;
  const user = await container.controllers.auth.findActiveUser(sessionId);
  if (!user || !["SUPER_ADMIN", "ADMIN", "REVIEWER"].includes(user.role)) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  const payload: unknown = await request.json();
  const parsed = updateSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Invalid status update" }, { status: 400 });
  const actor: Actor = { userId: user.id, role: user.role };
  try {
    const application = await container.useCases.changeApplicationStatus.execute(parsed.data, actor);
    return NextResponse.json({ status: application.status });
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: error.code === "FORBIDDEN" ? 403 : 400 });
    }
    throw error;
  }
}
