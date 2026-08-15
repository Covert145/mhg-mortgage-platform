import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="bg-brand-50">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h1 className="font-display text-4xl font-semibold text-ink-900 sm:text-5xl">
            Financing built for mobile &amp; manufactured homes
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-600">
            In a park or on your own land. Chattel, land/home, purchase, or refinance — Mobile Home Guy helps you get
            approved fast, with a team that actually understands manufactured housing.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/get-approved"
              className="rounded-md bg-brand-600 px-6 py-3 text-base font-medium text-white hover:bg-brand-700"
            >
              Get Approved
            </Link>
            <Link
              href="/apply"
              className="rounded-md border border-ink-300 bg-white px-6 py-3 text-base font-medium text-ink-800 hover:bg-ink-50"
            >
              Apply Online
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            { title: "Loan Options", body: "Chattel, land/home, park-owned or borrower-owned land — we finance homes the way they're actually bought." },
            { title: "Learning Center", body: "Plain-language guides to manufactured-home financing, HUD labels, and park approvals." },
            { title: "Second Look", body: "Already have a Loan Estimate from another lender? Upload it and we'll try to beat it." },
          ].map((card) => (
            <div key={card.title} className="rounded-card border border-ink-100 bg-white p-6 shadow-card">
              <h3 className="font-display text-lg font-semibold text-ink-900">{card.title}</h3>
              <p className="mt-2 text-sm text-ink-600">{card.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
