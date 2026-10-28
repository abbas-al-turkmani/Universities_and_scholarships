"use client";

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronLeft, ChevronRight, FileText, LoaderCircle, UploadCloud } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import type { Locale, Opportunity, Student } from "@/domain/model";
import type { Dictionary } from "@/lib/i18n";

const wizardSchema = z.object({
  fullName: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().min(7),
  degree: z.enum(["Bachelor", "Master", "PhD"]),
  institution: z.string().trim().min(2),
  gpa: z.string().regex(/^(?:[0-3](?:\.\d)?|4(?:\.0)?)$/),
  graduationYear: z.string().regex(/^(19|20)\d{2}$/),
  englishScore: z.string().regex(/^[0-9](?:\.[0-9])?$/),
});

type WizardValues = z.infer<typeof wizardSchema>;
type DocumentItem = { name: string; type: string; size: number; fileType: string };
type WizardText = Dictionary["applicationWizard"];

const fieldsByStep: (keyof WizardValues)[][] = [
  ["fullName", "email", "phone"],
  ["degree", "institution", "gpa", "graduationYear", "englishScore"],
  [],
  [],
];

export function ApplicationWizard({
  locale,
  opportunity,
  student,
  text,
}: {
  locale: Locale;
  opportunity: Opportunity;
  student: Student;
  text: WizardText;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [fileError, setFileError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [pending, setPending] = useState(false);
  const restored = useRef(false);
  const form = useForm<WizardValues>({
    resolver: zodResolver(wizardSchema),
    defaultValues: {
      fullName: student.name[locale],
      email: student.email,
      phone: student.phone,
      degree: student.degree,
      institution: "University of Jordan",
      gpa: student.gpa.toFixed(1),
      graduationYear: "2025",
      englishScore: String(student.languageScores.English ?? 6.5),
    },
  });
  const watchedValues = useWatch({ control: form.control });

  useEffect(() => {
    const saved = sessionStorage.getItem(`manhal-draft-${opportunity.id}`);
    if (saved) {
      try {
        const parsed: unknown = JSON.parse(saved);
        const validation = wizardSchema.partial().safeParse(parsed);
        if (validation.success) form.reset({ ...form.getValues(), ...validation.data });
        else sessionStorage.removeItem(`manhal-draft-${opportunity.id}`);
      } catch {
        sessionStorage.removeItem(`manhal-draft-${opportunity.id}`);
      }
    }
    restored.current = true;
  }, [form, opportunity.id]);

  useEffect(() => {
    if (restored.current) sessionStorage.setItem(`manhal-draft-${opportunity.id}`, JSON.stringify(watchedValues));
  }, [opportunity.id, watchedValues]);

  async function nextStep() {
    const valid = await form.trigger(fieldsByStep[step], { shouldFocus: true });
    if (valid && step < 3) setStep((current) => current + 1);
  }

  function addFiles(files: FileList | null) {
    setFileError("");
    if (!files) return;
    const next = [...documents];
    for (const file of Array.from(files)) {
      if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type) || file.size > 10 * 1024 * 1024) {
        setFileError(text.invalidFile);
        continue;
      }
      if (!next.some((entry) => entry.name === file.name && entry.size === file.size)) {
        next.push({
          name: file.name,
          type: file.type === "application/pdf" ? "Supporting document" : "Image attachment",
          size: file.size,
          fileType: file.type,
        });
      }
    }
    setDocuments(next);
  }

  async function submitApplication() {
    setSubmitError("");
    if (documents.length === 0) {
      setStep(2);
      setFileError(text.invalidFile);
      return;
    }
    setPending(true);
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityId: opportunity.id,
          documents: documents.map(({ name, type, size }) => ({ name, type, size })),
        }),
      });
      if (!response.ok) {
        setSubmitError(text.submitError);
        return;
      }
      const data: unknown = await response.json();
      if (!data || typeof data !== "object" || !("reference" in data) || typeof data.reference !== "string") {
        setSubmitError(text.submitError);
        return;
      }
      sessionStorage.removeItem(`manhal-draft-${opportunity.id}`);
      router.push(`/${locale}/confirmation/${data.reference}`);
    } catch {
      setSubmitError(text.submitError);
    } finally {
      setPending(false);
    }
  }

  const isArabic = locale === "ar";
  const BackIcon = isArabic ? ChevronRight : ChevronLeft;
  const NextIcon = isArabic ? ChevronLeft : ChevronRight;
  const labels = [
    { title: text.fullName, key: "fullName" as const, type: "text" },
    { title: text.email, key: "email" as const, type: "email" },
    { title: text.phone, key: "phone" as const, type: "tel" },
    { title: text.institution, key: "institution" as const, type: "text" },
    { title: text.gpa, key: "gpa" as const, type: "number" },
    { title: text.graduationYear, key: "graduationYear" as const, type: "number" },
    { title: text.englishScore, key: "englishScore" as const, type: "number" },
  ];

  return (
    <div className="wizard-card">
      <div className="wizard-progress">{text.steps.map((label, index) => <div className={`wizard-step ${step === index ? "active" : ""} ${step > index ? "complete" : ""}`} key={label}><span>{step > index ? <Check size={14} /> : index + 1}</span><small>{label}</small></div>)}</div>
      <div className="wizard-auto-save"><Check size={14} />{text.autoSaved}</div>
      <div className="wizard-content">
        {step === 0 && <div className="wizard-fields">{labels.slice(0, 3).map((field) => <label key={field.key}>{field.title}<input type={field.type} {...form.register(field.key)} aria-invalid={Boolean(form.formState.errors[field.key])} />{form.formState.errors[field.key] && <small className="wizard-error">{text.required}</small>}</label>)}</div>}
        {step === 1 && <div className="wizard-fields two-columns"><label>{text.degree}<select {...form.register("degree")}><option value="Bachelor">Bachelor</option><option value="Master">Master</option><option value="PhD">PhD</option></select></label>{labels.slice(3).map((field) => <label key={field.key}>{field.title}<input type={field.type} step={field.key === "gpa" || field.key === "englishScore" ? "0.1" : undefined} {...form.register(field.key)} aria-invalid={Boolean(form.formState.errors[field.key])} />{form.formState.errors[field.key] && <small className="wizard-error">{text.required}</small>}</label>)}</div>}
        {step === 2 && <div className="wizard-upload"><div className="wizard-upload-icon"><UploadCloud size={24} /></div><h2>{text.uploadTitle}</h2><p>{text.uploadHint}</p><label className="button button-outline upload-button">{text.uploadButton}<input accept=".pdf,.jpg,.jpeg,.png" multiple onChange={(event) => addFiles(event.target.files)} type="file" /></label>{fileError && <p className="wizard-error" role="alert">{fileError}</p>}<div className="uploaded-files">{documents.map((document) => <div className="uploaded-file" key={`${document.name}-${document.size}`}><FileText size={17} /><span><strong>{document.name}</strong><small>{(document.size / 1024).toFixed(0)} KB · {document.fileType}</small></span><button aria-label={`${text.remove} ${document.name}`} onClick={() => setDocuments((current) => current.filter((entry) => entry.name !== document.name))} type="button">×</button></div>)}</div></div>}
        {step === 3 && <div className="wizard-review"><h2>{text.review}</h2><div className="review-opportunity"><span>{opportunity.title[locale]}</span><small>{opportunity.country[locale].toUpperCase()} · {opportunity.degree}</small></div><div className="review-fields">{labels.map((field) => <div key={field.key}><small>{field.title}</small><strong>{watchedValues[field.key]}</strong></div>)}</div><div className="review-documents"><strong>{text.uploadTitle}</strong><span>{documents.map((document) => document.name).join(", ")}</span></div></div>}
      </div>
      {submitError && <p className="wizard-error" role="alert">{submitError}</p>}
      <div className="wizard-actions">{step > 0 && <button className="button button-outline" onClick={() => setStep((current) => current - 1)} type="button"><BackIcon size={16} />{text.back}</button>}{step < 3 ? <button className="button button-primary" onClick={nextStep} type="button">{text.next}<NextIcon size={16} /></button> : <button className="button button-primary" disabled={pending} onClick={submitApplication} type="button">{pending && <LoaderCircle className="spin" size={16} />}{text.submit}<NextIcon size={16} /></button>}</div>
    </div>
  );
}
