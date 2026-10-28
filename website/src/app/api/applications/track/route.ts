import { NextResponse } from "next/server";
import { z } from "zod";

import { container } from "@/infrastructure/di/container";

const trackingSchema = z.object({
  reference: z.string().regex(/^MNH-\d{4}-\d{6}$/),
  email: z.string().email(),
});

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const parsed = trackingSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Application not found" }, { status: 404 });
  const application = await container.controllers.applications.track(parsed.data.reference, parsed.data.email);
  if (!application) return NextResponse.json({ error: "Application not found" }, { status: 404 });
  return NextResponse.json({
    application: {
      reference: application.reference,
      status: application.status,
      history: application.history,
    },
  });
}
