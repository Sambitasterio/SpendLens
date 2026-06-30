# Spendlens Expense Dashboard · CEO Brief

**From:** Product Analyst (intern) · **Re:** What I built this sprint and what comes next

---

## What I built and why it matters

I built a working, hosted dashboard that takes our expenses, recorded in ten different currencies,
and shows them as one clean picture in US dollars. In a few seconds you can see total spend, how it
breaks down by category, the largest transaction in each category, and our top merchants. There's
also a searchable table of every transaction and a simple form to add new ones.

Today, the head of finance does this by hand each month: copying figures into a spreadsheet and
Googling exchange rates one by one. That's slow and easy to get wrong. This dashboard does the same
work instantly and consistently, so the monthly board numbers are reliable and take minutes, not
hours. It's live at a real URL, so you can open it on your laptop right now.

## The three trade-offs I made

1. **Shipped working software over a polished mock-up.** The brief was clear that a rough, usable
   tool beats a beautiful one stuck on a laptop. I prioritised getting all four core features working
   and deployed. The design is clean, but I spent my time on function first.

2. **Data lives in the browser, not a database.** Expenses you add show up immediately but reset when
   the page is refreshed. This let me ship faster and matches the assignment's scope. It's the right
   first step, and the code is structured so adding real storage later is a small, contained change.

3. **Fixed exchange-rate snapshot instead of a live feed.** Every figure uses one agreed set of rates.
   That makes the numbers reproducible and auditable for a board report, which matters more than being
   live-to-the-minute. Connecting a live rate feed is a clear next step, not a rewrite.

## What I'd prioritise next sprint

1. **Make data stick (persistence).** *Impact:* the tool moves from a demo to something finance can
   actually use day to day, because added expenses survive a refresh. This is the single biggest
   unlock and is quick to do.

2. **Connect a live exchange-rate feed, with the current snapshot as a safe fallback.** *Impact:*
   always-current board numbers without losing the reliability we have today.

3. **Let finance import their real spreadsheet (and export results).** *Impact:* the dashboard works
   on actual company data instead of sample records, which is what turns it into a real monthly
   workflow.

## Honest status

All four core features and the bonus rate-explorer work and are deployed. The main thing that is
deliberately *not* finished is saving data between sessions. I chose to ship the working summary and
flag this clearly rather than overrun. The next sprint plan above closes that gap first.
