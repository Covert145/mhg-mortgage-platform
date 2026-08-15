import { GetApprovedForm } from "./get-approved-form";

export default function GetApprovedPage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-ink-900">Get Approved</h1>
      <p className="mt-2 text-ink-600">A quick, no-commitment way to start — no full application required yet.</p>
      <div className="mt-8">
        <GetApprovedForm />
      </div>
    </main>
  );
}
