# Custom Events

Purpose:

Keep Vercel Web Analytics events small, intentional, and tied to real decisions.

## Recommended Event Names

- `start_here_clicked`
- `search_performed`
- `search_result_clicked`
- `work_with_me_view`
- `build_log_clicked`
- `project_link_click`
- `writing_clicked`
- `tiny_thought_clicked`
- `rss_clicked`
- `contact_cta_click`
- `intake_form_click`
- `guestbook_click`
- `guestbook_submitted`

## Payload Rules

- Keep payloads small.
- Prefer a small number of stable keys such as `source`, `target`, `section`, `variant`, or `query_type`.
- Avoid high-cardinality values unless they clearly support a decision.
- Do not include free-text user input unless there is an explicit reviewed reason.
- Reuse the same payload shape for the same event across pages where possible.

## Privacy Rules

- Do not track personal or private data.
- Do not track anything creepy.
- Do not track mood entries, guestbook message content, or other open text by default.
- Do not log email addresses, names, or other visitor-provided identifiers in analytics events.

## Decision-Loop Mapping

- `start_here_clicked`
  Helps decide whether homepage orientation is working and which paths need stronger copy.
- `search_performed`
  Helps decide whether navigation is failing and whether search is doing too much compensating work.
- `search_result_clicked`
  Helps decide whether search results are actually useful after the query happens.
- `work_with_me_view`
  Helps decide whether the professional funnel is attracting real visits before CTA optimization work.
- `build_log_clicked`
  Helps decide whether proof-of-active-work is resonating and should be promoted further.
- `project_link_click`
  Helps decide which projects deserve stronger placement or clearer summaries.
- `writing_clicked`
  Helps decide which writing surfaces pull people deeper into the site.
- `tiny_thought_clicked`
  Helps decide whether short-form content deserves stronger framing or cross-links.
- `rss_clicked`
  Helps decide whether returning-visitor and subscription features deserve more visibility.
- `contact_cta_click`
  Helps decide whether contact paths are visible and trustworthy enough.
- `intake_form_click`
  Helps decide whether the inquiry path is resonating or getting buried.
- `guestbook_click`
  Helps decide whether the guestbook entry framing still invites participation.
- `guestbook_submitted`
  Helps decide whether the guestbook is still earning its place on the site.
