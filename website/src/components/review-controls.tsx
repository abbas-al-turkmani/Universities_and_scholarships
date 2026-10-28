"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";

import type { ApplicationStatus, Locale } from "@/domain/model";
import type { Dictionary } from "@/lib/i18n";

type ReviewerText = Dictionary["reviewer"];
const statuses: ApplicationStatus[] = ["UNDER_REVIEW", "DOCUMENTS_REQUESTED", "ACCEPTED", "REJECTED", "WAITLISTED"];

export function ReviewControls({
  applicationId,
  locale,
  text,
}: {
  applicationId: string;
  locale: Locale;
  text: ReviewerText;
}) {
  const [status, setStatus] = useState<ApplicationStatus>("UNDER_REVIEW");
  const [comment, setComment] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    setPending(true);
    try {
      const response = await fetch("/api/applications/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, status, comment }),
      });
      setNotice(response.ok ? text.saved : text.error);
    } catch {
      setNotice(text.error);
    } finally {
      setPending(false);
    }
  }

  const statusLabels = locale === "ar"
    ? ["قيد المراجعة", "مطلوب مستندات", "مقبول", "مرفوض", "قائمة الانتظار"]
    : ["Under review", "Documents requested", "Accepted", "Rejected", "Waitlisted"];

  return <form className="dashboard-panel review-controls" onSubmit={submit}><span className="eyebrow"><span className="eyebrow-dot" />REVIEW DECISION</span><h2>{text.changeStatus}</h2><label>{locale === "ar" ? "الحالة" : "Status"}<select onChange={(event) => setStatus(event.target.value as ApplicationStatus)} value={status}>{statuses.map((value, index) => <option key={value} value={value}>{statusLabels[index]}</option>)}</select></label><label>{text.comment}<textarea onChange={(event) => setComment(event.target.value)} rows={4} value={comment} /></label>{notice && <p className={notice === text.saved ? "review-success" : "form-error"} role="status">{notice === text.saved && <CheckCircle2 size={15} />}{notice}</p>}<button className="button button-primary" disabled={pending} type="submit">{pending && <LoaderCircle className="spin" size={15} />}{text.save}</button></form>;
}
