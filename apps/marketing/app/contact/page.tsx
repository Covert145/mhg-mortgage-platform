import { ContactForm } from "./contact-form";

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-ink-900">Contact Us</h1>
      <p className="mt-2 text-ink-600">Questions about financing a mobile or manufactured home? We&apos;re here to help.</p>
      <div className="mt-8">
        <ContactForm />
      </div>
    </main>
  );
}
