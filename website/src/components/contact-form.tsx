"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

type ContactCopy = {
  name: string;
  email: string;
  message: string;
  send: string;
  sent: string;
  validation: string;
};

const contactSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  message: z.string().trim().min(10),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm({ text }: { text: ContactCopy }) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) });

  function submit() {
    setSubmitted(true);
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit(submit)} noValidate>
      {submitted && <p className="contact-success" role="status"><CheckCircle2 size={17} />{text.sent}</p>}
      <label>{text.name}<input autoComplete="name" {...register("name")} aria-invalid={Boolean(errors.name)} /></label>
      {errors.name && <span className="contact-error">{text.validation}</span>}
      <label>{text.email}<input autoComplete="email" type="email" {...register("email")} aria-invalid={Boolean(errors.email)} /></label>
      {errors.email && <span className="contact-error">{text.validation}</span>}
      <label>{text.message}<textarea rows={5} {...register("message")} aria-invalid={Boolean(errors.message)} /></label>
      {errors.message && <span className="contact-error">{text.validation}</span>}
      <button className="button button-primary" type="submit">{text.send}<ArrowUpRight size={16} /></button>
    </form>
  );
}
