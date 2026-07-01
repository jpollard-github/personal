import type { Metadata } from "next";
import Link from "next/link";
import { AnalyticsPageEvent } from "../AnalyticsPageEvent";
import { SectionHeading } from "../SectionHeading";
import { TrackedLink } from "../TrackedLink";
import { businessContact, businessLinks } from "../lib/business-config";

const offerings = [
  {
    title: "Web applications",
    text: "New features, internal tools, workflow cleanup, admin interfaces, and practical improvements to software people already depend on.",
  },
  {
    title: "AI workflow automation",
    text: "Useful integrations, prompt systems, repo-aware context, review helpers, and AI-assisted workflows that save time instead of adding theater.",
  },
  {
    title: "Developer tooling",
    text: "Small tools that make technical teams faster: editor extensions, automation scripts, repository helpers, and better paths through recurring work.",
  },
  {
    title: "Technical problem solving",
    text: "Stuck systems, unclear architecture, messy handoffs, and the kind of problem where what you really need is a calm, experienced person to make sense of it.",
  },
];

const credibilityPoints = [
  "Decades of experience across healthcare, finance, agriculture, and internal platform tooling",
  "Hands-on full-stack work spanning backend systems, frontend applications, databases, automation, and cloud platforms",
  "Particular strength with legacy systems, technical cleanups, migrations, and performance problems that have been lingering too long",
  "Experience working directly with product, architecture, leadership, and technical teams to turn vague needs into shippable plans",
];

const examples = [
  {
    eyebrow: "Mood and UX tooling",
    title: "mood-switcher",
    text: "A small utility focused on shifting interface mood and presentation, reflecting the kind of lightweight product thinking and implementation polish I enjoy.",
    href: "https://github.com/jpollard-github/mood-switcher",
    cta: "View Repo",
  },
  {
    eyebrow: "AI workflow tooling",
    title: "ai-session-kit",
    text: "A repo support toolkit for better AI handoffs, project memory, and session continuity across coding workflows.",
    href: "https://github.com/jpollard-github/ai-session-kit",
    cta: "View Repo",
  },
  {
    eyebrow: "Developer tooling",
    title: "Codex Prompt Pack for VS Code",
    text: "A VS Code extension that turns selections, changed files, diffs, and repo metadata into compact AI-ready prompts.",
    href: "https://github.com/jpollard-github/codex-vs-code-extension",
    cta: "View Repo",
  },
  {
    eyebrow: "Data workflow",
    title: "spotify-export",
    text: "A local analysis pipeline that turns raw Spotify history into normalized data, genre enrichment, ranked summaries, and a static report prototype.",
    href: "https://github.com/jpollard-github/spotify-export",
    cta: "View Repo",
  },
  {
    eyebrow: "Living web app",
    title: "ArcadeGhosts",
    text: "This site itself: a personal publishing system with projects, writing, guestbook moderation, Tiny Thoughts, galleries, and custom interactive spaces.",
    href: "/",
    cta: "Explore Site",
  },
  {
    eyebrow: "Interactive system",
    title: "The Lodges Within",
    text: "A guided, story-shaped reflection experience that blends product thinking, UX writing, atmosphere, and practical structure.",
    href: "/twin-peaks-self",
    cta: "Open Project",
  },
];

const outcomes = [
  "Reduced a bulk-processing job from 22 hours to 14 by improving messaging and code paths in a distributed system.",
  "Led and coordinated complex multi-team deployments, break-fix work, and platform migrations across internal engineering products.",
  "Built AI-assisted projects and workflows including spotify-export, a local pipeline that turns raw Spotify history into normalized data, genre enrichment, and a static report, along with ArcadeGhosts itself as a living site developed extensively with AI as a practical collaborator.",
];

const exampleProblems = [
  {
    title: "The spreadsheet nightmare",
    text: "A process that lives in email, spreadsheets, copy-paste, and good intentions, and needs to become a simple tool or automation.",
  },
  {
    title: "The website fix that never gets prioritized",
    text: "A business site or internal app needs a useful enhancement, cleanup, or workflow improvement, but it is never quite urgent enough for the main roadmap.",
  },
  {
    title: "The AI idea that needs to become real",
    text: "A team wants AI to help with documentation, code review, repo context, support, or repetitive work, but needs somebody practical to make it useful.",
  },
];

const fitSignals = [
  "A website or internal tool needs focused improvements",
  "A repetitive business process is wasting hours every week",
  "A team wants practical help using AI more effectively",
  "A technical problem has been sitting around because nobody has time to untangle it",
];

const notFitSignals = [
  "Long-term staff augmentation",
  "Equity-only startup work",
  "Projects that need a full agency or ongoing sales process",
  'Anything where the main brief is just "add AI" without a real problem to solve',
];

const projectSizes = [
  {
    title: "Technical strategy or advisory session",
    range: "Starting at $200",
    text: "A focused conversation around a software problem, architecture question, AI idea, or workflow bottleneck.",
  },
  {
    title: "Small website improvements",
    range: "$1,000-$2,000",
    text: "Useful upgrades, cleanup work, and focused changes that make an existing site or product more effective.",
  },
  {
    title: "Business automation projects",
    range: "$1,000-$2,500",
    text: "Workflow cleanup for spreadsheet-and-email problems that need a small tool, integration, or automation.",
  },
  {
    title: "AI workflow and developer tooling",
    range: "$2,000-$5,000",
    text: "Practical AI-assisted workflows, repo-aware tooling, review helpers, and team accelerators that solve a real problem.",
  },
  {
    title: "Internal tools and dashboards",
    range: "$3,000-$6,000",
    text: "Small internal systems with forms, reporting, admin flows, or task-specific dashboards that reduce friction for a team.",
  },
];

const faqItems = [
  {
    question: "Do you work remotely?",
    answer: "Yes. I work remotely with clients nationwide.",
  },
  {
    question: "Do you work locally?",
    answer:
      "Yes. I am based in the North Carolina Triad and available locally around Greensboro, Winston-Salem, High Point, Kernersville, and nearby areas.",
  },
  {
    question: "Do you do hourly work?",
    answer: "Usually no. I prefer small fixed-price projects with a clear problem and a defined outcome.",
  },
  {
    question: "What if I am not sure what I need?",
    answer: "That is normal. Start by describing the problem, and I can help figure out whether it sounds like a fit.",
  },
  {
    question: "Can you help with existing software?",
    answer:
      "Yes. A lot of my experience is in improving, modernizing, and untangling software that already exists.",
  },
];

const trustClusterCards = [
  {
    eyebrow: "Human Context",
    title: "Who you are working with",
    text: "Before scope, pricing, or next steps, here is the human context: how I think, what I care about, and the person you would actually be working with.",
    href: "/about",
    cta: "Meet Jason",
  },
  {
    eyebrow: "Proof Of Life",
    title: "Build Log",
    text: "A public record of recent shipped improvements, structural changes, editorial cleanup, and the ongoing tuning behind ArcadeGhosts.",
    href: "/build-log",
    cta: "See Recent Changes",
  },
  {
    eyebrow: "Current Work",
    title: "Projects",
    text: "A visible workbench of shipped, active, paused, and becoming projects so you do not have to guess what kind of builder I am.",
    href: "/#projects",
    cta: "Open The Workbench",
  },
];

export const metadata: Metadata = {
  title: "Work With Me",
  description:
    "Jason Pollard occasionally takes on small side projects involving web applications, automation, AI integration, developer tooling, and technical problem solving.",
  alternates: {
    canonical: "/work-with-me",
  },
  openGraph: {
    title: "Work With Me | ArcadeGhosts",
    description:
      "Small fixed-price software, automation, AI workflow, and tooling projects with Jason Pollard.",
    url: "/work-with-me",
  },
};

export default function WorkWithMePage() {
  return (
    <main className="work-page" id="top">
      <AnalyticsPageEvent
        eventName="work_with_me_view"
        properties={{ entry_point: "direct", route: "/work-with-me" }}
      />
      <section className="work-hero">
        <div className="work-hero-copy">
          <p className="eyebrow">Work With Me</p>
          <h1>Small projects. Clear problems. Personal attention.</h1>
          <p className="work-lead">
            I help businesses and thoughtful teams with small software projects:
            website improvements, internal tools, business automation, and
            practical AI workflows.
          </p>
          <p className="work-hero-support">
            If something is messy, slow, repetitive, overdue, or quietly
            driving people nuts, I can usually help scope it, untangle it, and
            turn it into a practical next step.
          </p>
          <ul className="work-hero-highlights" aria-label="Primary project types">
            <li>Website improvements and cleanup</li>
            <li>Automation and AI workflow help</li>
            <li>Internal tools and technical problem solving</li>
          </ul>
          <p className="work-hero-note work-hero-human-note">
            If you want to start with the human context before the practical
            details, <Link className="work-inline-link" href="/about">meet Jason here</Link>.
          </p>
          <div className="hero-actions" aria-label="Work with me links">
            <TrackedLink
              className="button primary"
              href={businessLinks.projectInquiry}
              target="_blank"
              rel="noreferrer"
              trackingEvent="intake_form_click"
              trackingProperties={{
                route: "/work-with-me",
                surface: "hero",
              }}
            >
              Start a Project Inquiry
            </TrackedLink>
            <TrackedLink
              className="button secondary"
              href={businessContact.emailHref}
              trackingEvent="contact_cta_click"
              trackingProperties={{
                route: "/work-with-me",
                surface: "hero",
              }}
            >
              Email Jason
            </TrackedLink>
          </div>
          <p className="work-hero-note work-hero-availability">
            Best fit: small fixed-price projects with a real problem to solve,
            not open-ended staff augmentation.
          </p>
          <p className="work-hero-note work-hero-availability">
            Available remotely nationwide and locally throughout the North
            Carolina Triad, including Greensboro, Winston-Salem, High Point,
            Kernersville, and surrounding areas. If you want to reach out, send
            the problem, not a polished spec.
          </p>
          <div className="resonance-links" aria-label="Work with me sections">
            <a href="#examples">Examples</a>
            <a href="#pricing">Pricing</a>
            <a href="#good-fit">Good Fit</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </section>

      <section className="content-section work-intro">
        <SectionHeading eyebrow="How I Work" title="Not a consulting company. Just Jason.">
          People usually are not hiring me for a generic bucket of coding
          hours. They are hiring a thoughtful developer who can understand a
          messy problem, communicate clearly, and build something useful.
        </SectionHeading>
        <div className="section-link-grid">
          {trustClusterCards.map((card) => (
            <Link className="section-link-card" href={card.href} key={card.title}>
              <span className="card-eyebrow">{card.eyebrow}</span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              <span>{card.cta}</span>
            </Link>
          ))}
        </div>
        <article className="work-panel work-outcomes-panel">
          <h3>Most projects start with a discovery session.</h3>
          <p>
            If you want help sorting out the real problem before committing to
            a larger build, start with a focused 90-minute session for $200.
          </p>
          <div className="hero-actions" aria-label="Discovery session links">
            <TrackedLink
              className="button primary"
              href={businessLinks.discoverySession}
              target="_blank"
              rel="noreferrer"
              trackingEvent="contact_cta_click"
              trackingProperties={{
                route: "/work-with-me",
                surface: "discovery_intro",
                type: "discovery_session",
              }}
            >
              Book a Discovery Session
            </TrackedLink>
            <TrackedLink
              className="button secondary"
              href={businessLinks.projectInquiry}
              target="_blank"
              rel="noreferrer"
              trackingEvent="intake_form_click"
              trackingProperties={{
                route: "/work-with-me",
                surface: "discovery_intro",
              }}
            >
              Start a Project Inquiry
            </TrackedLink>
          </div>
          <p className="work-hero-note">
            Payment confirms your discovery session. After payment, I&apos;ll
            follow up to schedule the call and gather any details I need
            beforehand.
          </p>
        </article>
        <div className="work-copy-grid">
          <article className="work-panel">
            <h3>What I help with</h3>
            <div className="work-offering-grid">
              {offerings.map((offering) => (
                <div className="work-offering-card" key={offering.title}>
                  <h4>{offering.title}</h4>
                  <p>{offering.text}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="work-panel">
            <h3>What I prefer</h3>
            <p>
              I prefer small, well-scoped fixed-price projects over long-term
              contracting. The best fit is usually a specific problem that needs
              a practical solution, not a giant engagement with fifteen status
              meetings.
            </p>
            <p>
              I tend to be most useful when the work sits somewhere between
              product thinking, software implementation, automation, and calm
              technical judgment.
            </p>
          </article>
        </div>
      </section>

      <section className="content-section work-pricing" id="pricing">
        <SectionHeading eyebrow="Typical Project Sizes" title="Enough pricing context to know whether this is in range.">
          I usually work on fixed-price projects. Exact pricing depends on the
          shape, constraints, and messiness of the problem, but these are
          common starting points and typical ranges.
        </SectionHeading>
        <div className="work-offering-grid work-problem-grid">
          {projectSizes.map((item) => (
            <article className="work-offering-card" key={item.title}>
              <p className="card-eyebrow">{item.range}</p>
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        <p className="work-hero-note work-section-note">
          If you&apos;re not sure where your project fits, email me the problem
          and I&apos;ll tell you honestly whether it sounds like a fit. If the
          work turns out to be larger, stranger, or more tangled than these
          ranges, I&apos;ll say that up front.
        </p>
      </section>

      <section className="content-section">
        <SectionHeading eyebrow="Low-Risk Start" title="A small first step if you want clarity before a larger project.">
          Some problems need a scoped build. Some just need a sharp technical
          conversation. This option gives you a clean way to start.
        </SectionHeading>
        <article className="work-panel work-outcomes-panel">
          <p className="card-eyebrow">90-Minute Technical Strategy Session • $200 fixed price</p>
          <p>
            For most projects, we start here. Bring me your software problem,
            AI idea, architecture question, workflow bottleneck, or aging
            codebase.
          </p>
          <p>
            We&apos;ll clarify what you&apos;re trying to accomplish, identify
            risks, and decide whether a small fixed-scope project makes sense.
          </p>
          <p>
            After the session, you&apos;ll receive a short written summary with
            recommended next steps, clearer options, and a better sense of
            whether a larger project is worth doing.
          </p>
          <div className="hero-actions" aria-label="Discovery booking links">
            <TrackedLink
              className="button primary"
              href={businessLinks.discoverySession}
              target="_blank"
              rel="noreferrer"
              trackingEvent="contact_cta_click"
              trackingProperties={{
                route: "/work-with-me",
                surface: "strategy_session",
                type: "discovery_session",
              }}
            >
              Book a Discovery Session
            </TrackedLink>
          </div>
          <p className="work-hero-note">
            Payment confirms your discovery session. After payment, I&apos;ll
            follow up to schedule the call and gather any details I need
            beforehand.
          </p>
        </article>
      </section>

      <section className="content-section">
        <SectionHeading eyebrow="Why Me" title="Useful experience, not just a list of technologies.">
          The most relevant part of my resume is not that I have touched a lot
          of tools. It is that I have spent a long time helping real teams ship
          software, improve slow or fragile systems, and make practical
          technical decisions under real constraints.
        </SectionHeading>
        <div className="work-fit-grid">
          <article className="work-panel">
            <h3>What that experience looks like</h3>
            <ul className="about-list">
              {credibilityPoints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="work-panel">
            <h3>A few concrete signals</h3>
            <p>
              I&apos;ve led multiple remote development teams, managed direct
              reports, coordinated multi-team deployments, and built software in
              environments ranging from internal tooling to customer-facing web
              systems.
            </p>
            <p>
              I&apos;ve also done the unglamorous but valuable work: reducing
              slow bulk jobs, improving reliability, modernizing delivery paths,
              supporting migrations, and helping older systems behave like they
              still deserve to exist.
            </p>
          </article>
        </div>
      </section>

      <section className="content-section" id="examples">
        <SectionHeading eyebrow="Examples" title="A few things that reflect how I build.">
          ArcadeGhosts works best as the proof. If you&apos;re here, you can
          already see the mix of software, writing, experiments, and practical
          problem solving I tend to bring to a project.
        </SectionHeading>
        <div className="section-link-grid">
          {examples.map((example) => (
            <TrackedLink
              className="section-link-card"
              href={example.href}
              key={example.title}
              target="_blank"
              rel="noreferrer"
              trackingEvent="project_link_click"
              trackingProperties={{
                project_id: example.title,
                surface: "work_with_me_examples",
                type: example.eyebrow,
              }}
            >
              <span className="card-eyebrow">{example.eyebrow}</span>
              <h3>{example.title}</h3>
              <p>{example.text}</p>
              <span>{example.cta}</span>
            </TrackedLink>
          ))}
        </div>
      </section>

      <section className="content-section">
        <SectionHeading eyebrow="Selected Outcomes" title="A few concrete results from the day job world.">
          If you&apos;re considering a small project, this is the part that
          matters more than a giant skill list: I&apos;ve spent a long time
          helping software behave better in the real world.
        </SectionHeading>
        <article className="work-panel work-outcomes-panel">
          <ul className="about-list">
            {outcomes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="content-section">
        <SectionHeading eyebrow="Example Problems" title="The kinds of situations I can often help with quickly.">
          Sometimes it is easier to recognize your problem than to recognize a
          service category. These are the sorts of projects that tend to fit
          well.
        </SectionHeading>
        <div className="work-offering-grid work-problem-grid">
          {exampleProblems.map((problem) => (
            <article className="work-offering-card" key={problem.title}>
              <h4>{problem.title}</h4>
              <p>{problem.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section" id="good-fit">
        <SectionHeading eyebrow="Good Fit" title="The kinds of projects that usually make sense.">
          People buy solved problems, not a checklist of frameworks. These are
          the situations where I can usually help the fastest.
        </SectionHeading>
        <div className="work-fit-grid">
          <article className="work-panel">
            <h3>Likely a good fit</h3>
            <ul className="about-list">
              {fitSignals.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="work-panel">
            <h3>Probably not the right fit</h3>
            <ul className="about-list">
              {notFitSignals.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="content-section work-contact work-faq">
        <SectionHeading eyebrow="FAQ" title="A few quick answers that usually help people decide.">
          Most hesitation comes from not knowing how I work, whether I help
          locally, or whether the project needs to be perfectly defined before a
          first email.
        </SectionHeading>
        <div className="work-fit-grid">
          {faqItems.map((item) => (
            <article className="work-panel work-faq-item" key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section work-contact" id="contact">
        <SectionHeading eyebrow="Contact" title="If you have a problem worth discussing, reach out.">
          A short note is enough. Tell me what is broken, slow, confusing,
          repetitive, overdue, or quietly driving everyone nuts.
        </SectionHeading>
        <div className="work-contact-panel">
          <div className="hero-actions" aria-label="Contact options">
            <TrackedLink
              className="button primary"
              href={businessLinks.projectInquiry}
              target="_blank"
              rel="noreferrer"
              trackingEvent="intake_form_click"
              trackingProperties={{
                route: "/work-with-me",
                surface: "contact_section",
              }}
            >
              Start a Project Inquiry
            </TrackedLink>
            <TrackedLink
              className="button secondary"
              href={businessContact.emailHref}
              trackingEvent="contact_cta_click"
              trackingProperties={{
                route: "/work-with-me",
                surface: "contact_section",
              }}
            >
              Email Jason
            </TrackedLink>
          </div>
          <div className="work-contact-meta" aria-label="Contact expectations">
            <p>
              <strong>Best for:</strong> small fixed-price problems that need a
              practical next step.
            </p>
            <p>
              <strong>Response time:</strong> usually 1-2 business days.
            </p>
            <p>
              <strong>Best first message:</strong> send the problem, not a
              polished spec.
            </p>
          </div>
          <p className="work-contact-email">
            Prefer email?{" "}
            <TrackedLink
              className="work-inline-link"
              href={businessContact.emailHref}
              trackingEvent="contact_cta_click"
              trackingProperties={{
                route: "/work-with-me",
                surface: "contact_inline",
              }}
            >
              {businessContact.emailAddress}
            </TrackedLink>
          </p>
          <p className="work-contact-note">
            If it sounds like a fit, we can figure out scope, timeline, and
            whether a fixed-price project makes sense.
          </p>
        </div>
      </section>

      <a className="back-up-top" href="#top">
        Back to top
      </a>
    </main>
  );
}
