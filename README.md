# HIVO — Data Management Maturity Quiz

A mobile-first React rebuild of the HIVO digital-asset-management (DAM) maturity quiz
originally prototyped in Figma Make. Users rate their organisation across 10 capability
areas on a 1–10 scale, then book a demo.

## Stack

- [Vite](https://vitejs.dev/) + React + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) v3
- [Outfit](https://fonts.google.com/specimen/Outfit) font (via Google Fonts)

## Design system

- **Primary blue:** `#0427FF` (`brand`)
- **Ink / text:** `#0b1020`
- **Font:** Outfit
- Rounded corners, generous whitespace, animated progress bar — matching hivo.co.

## Flow

1. **Quiz** — 10 rating questions (auto-advances on selection). `Back` and `Start Over`
   navigation on every question.
2. **Contact form** — name + email, `Book My Demo`, with `Back to Quiz`. Also reachable
   at any time via the header `Book Now` button.
3. **Thank you** — confirmation with `Visit hivo.co` and `Take Quiz Again`.

## The 10 capability areas

Findability · Metadata quality · Governance · Retention & disposal · Approval workflows ·
Access control · Audit readiness · AI readiness · Workflow automation · Single source of truth

> Question 1 (Findability) is taken verbatim from the HIVO quiz. The remaining nine follow
> the same "Rate 1 (Not at all) to 10 (Completely)" framing and can be edited in
> [`src/questions.ts`](src/questions.ts) if you have the exact original wording.

## Getting started

```bash
npm install
npm run dev      # start dev server (http://localhost:5173)
npm run build    # type-check + production build
npm run preview  # preview the production build
```

## Project structure

```
src/
  App.tsx                  # quiz flow state machine
  questions.ts             # 10 questions + categories
  components/
    Header.tsx             # HIVO logo, progress bar, ISO 27001 badge, Book Now
    RatingScale.tsx        # 1–10 rating grid
    QuestionScreen.tsx     # category badge + question + scale + nav
    ContactForm.tsx        # name / email / Book My Demo
    ThankYou.tsx           # success screen
    icons.tsx              # inline SVG icons
```
