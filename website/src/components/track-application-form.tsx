"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Clock3, FileSearch, LoaderCircle } from "lucide-react";
import { z } from "zod";

import type { Locale } from "@/domain/model";
import type { Dictionary } from "@/lib/i18n";

type TrackingCopy = Dictionary["applicationWizard"];
const trackingResultSchema = z.object({
  reference: z.string(),
  status: z.string(),
  history: z.array(z.object({ status: z.string(), date: z.string(), note: z.string() })),
});
type TrackingResult = z.infer<typeof trackingResultSchema>;

export function TrackApplicationForm({ locale, text }: { locale: Locale; text: TrackingCopy }) {
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);
    setPending(true);
    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/applications/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: formData.get("reference"),
          email: formData.get("email"),
        }),
      });
      if (!response.ok) {
        setError(text.noMatch);
        return;
      }
      const payload: unknown = await response.json();
      const parsed = z.object({ application: trackingResultSchema }).safeParse(payload);
      if (parsed.success) setResult(parsed.data.application);
      else setError(text.noMatch);
    } catch {
      setError(text.noMatch);
    } finally {
      setPending(false);
    }
  }

  return <div className="track-layout"><form className="track-form" onSubmit={submit}><label>{text.reference}<input autoComplete="off" name="reference" placeholder="MNH-2026-000123" required /></label><label>{locale === "ar" ? "البريد الإلكتروني" : "Email address"}<input autoComplete="email" name="email" required type="email" /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-primary" disabled={pending} type="submit">{pending ? <LoaderCircle className="spin" size={16} /> : <FileSearch size={16} />}{text.trackButton}</button></form>
    {result && <section className="tracking-result"><div className="tracking-current"><span className="tracking-check"><CheckCircle2 size={19} /></span><div><small>{text.status}</small><strong>{result.status.replaceAll("_", " ")}</strong></div></div><div className="tracking-title"><h2>{text.timeline}</h2><span>{result.reference}</span></div><ol className="tracking-timeline">{result.history.map((item, index) => <li className={index === result.history.length - 1 ? "current" : ""} key={`${item.status}-${item.date}-${index}`}><span className="timeline-dot">{index === result.history.length - 1 ? <Clock3 size={13} /> : <CheckCircle2 size={13} />}</span><div><strong>{item.status.replaceAll("_", " ")}</strong><p>{item.note}</p><small>{new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" }).format(new Date(item.date))}</small></div></li>)}</ol></section>}
  </div>;
}
