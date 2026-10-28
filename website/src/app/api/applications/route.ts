import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import type { Actor } from "@/application/ports";
import { DomainError } from "@/domain/errors";
import { container } from "@/infrastructure/di/container";

const submissionSchema = z.object({
  opportunityId: z.string().min(1),
  documents: z.array(z.object({
    name: z.string().min(1),
    type: z.string().min(1),
    size: z.number().int().positive().max(10 * 1024 * 1024),
  })).min(1),
});

export async function POST(request: Request) {
  const sessionId = (await cookies()).get("manhal-session")?.value;
  const user = await container.controllers.auth.findActiveUser(sessionId);
  if (!user?.studentId || user.role !== "STUDENT") {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  const body: unknown = await request.json();
  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid application data" }, { status: 400 });
  const actor: Actor = { userId: user.id, role: user.role };
  try {
    const application = await container.useCases.submitApplication.execute({
      studentId: user.studentId,
      opportunityId: parsed.data.opportunityId,
      documents: parsed.data.documents,
    }, actor);
    return NextResponse.json({ reference: application.reference }, { status: 201 });
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: error.code === "FORBIDDEN" ? 403 : 400 });
    }
    throw error;
  }
}
