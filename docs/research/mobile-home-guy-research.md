# Research: mobilehomeguy.com (Public Website Reference)

**Purpose of this document:** capture what was learned about the existing Mobile Home Guy public website (mobilehomeguy.com) so the new platform's public site can be strongly inspired by its UX concepts and brand identity, using entirely new code and original content. Nothing in this document is copied verbatim from the source site; all copy/content for the new site will be written fresh.

## Research method and a limitation to flag

Direct page fetches (`WebFetch`) to `www.mobilehomeguy.com` were blocked by this environment's network egress proxy, so this research was performed via web-search indexing (page titles, URLs, and search-snippet descriptions) rather than a full visual/DOM walkthrough. This is sufficient to establish information architecture and product mechanics, but **a follow-up direct-browse pass (from an environment/session with unblocked web access, or a manual walkthrough by the team) is recommended before Phase 2 (public website build)** to confirm exact nav labels, page copy structure, the Learning Center content taxonomy, and state-page patterns in detail.

## Confirmed page/URL structure

From search-engine indexing of `mobilehomeguy.com`:

- Homepage (`/`)
- `/about-us/` — About Us
- `/contact-us` — Contact
- `/quote/` — "Request A Quote" (framed as a quick, ~1-minute loan request)
- `/second-look/` — "Second Look": upload a competitor's Loan Estimate; Mobile Home Guy attempts to beat it within 24 hours
- `/mortgage-calculator/` — Mortgage Calculator (monthly payment, affordability, refinance-savings estimation)
- `/popular-loans-for-buying-a-home/` — loan-options/educational content
- Individual loan-officer bio pages (e.g., `/josh-bennett/`, `/kris-covert/`) — personal-brand pages for individual originators

## Positioning and brand

Mobile Home Guy is positioned as "a streamlined mobile home financing platform connecting homebuyers with expert realtors and mortgage professionals through an intuitive digital dashboard." The brand voice centers on speed, transparency, and accessibility across credit levels, for buying, selling, and refinancing manufactured/mobile homes.

## Lead-generation mechanics worth reproducing natively

Two concrete conversion mechanics stood out and are treated as first-class flows in the new platform's public-website-to-CRM architecture (see `docs/architecture/system-architecture.md` and the website→CRM event flow in `docs/architecture/phase-1-implementation-spec.md`):

1. **Quick quote / pre-qualification request** — a low-friction, no-commitment form that starts a CRM lead relationship immediately, rather than requiring a full application up front.
2. **"Second Look"** — a competitive-displacement flow where a prospect uploads a rate/Loan Estimate they already have from another lender, and the team responds with a comparison within a committed time window. This is a strong lead magnet because it targets prospects already far along in a competitor's funnel.

Individual loan-officer bio pages also suggest the new site should support per-originator personal-brand pages wired into the same CRM (consistent with loanofficer.ai's "branded loan-officer microsites wired into the CRM," see the companion research doc) rather than a single undifferentiated "Contact Us."

## Derived information architecture for the new site

Combining the confirmed page structure above with the platform requirements brief, the new public website's IA is:

- Home
- Get Approved (quick pre-qualification — analog to `/quote/`)
- Apply Online (full application start)
- Listings
- Parks
- Loan Options (incl. chattel, land/home, park vs. owned-land explainers — analog to `/popular-loans-for-buying-a-home/`)
- Learning Center
- Second Look (competitive rate-beat flow)
- Mortgage Calculator
- About
- Meet the Team (individual loan-officer pages)
- Contact
- State-specific pages
- Login (single entry point routing into the correct portal/CRM per role)

This IA is the input to Phase 2 (public website), not something being built in this pass.
