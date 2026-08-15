import { ApplyForm } from "./apply-form";

export default function ApplyPage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-ink-900">Apply Online</h1>
      <p className="mt-2 text-ink-600">
        Start your full mortgage application. The complete URLA-aligned application flow is built in Phase 2/4 — this
        starts your file with our team today.
      </p>
      <div className="mt-8">
        <ApplyForm />
      </div>
    </main>
  );
}
