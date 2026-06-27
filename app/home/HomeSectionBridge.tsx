import { TrackedLink } from "../TrackedLink";

type HomeSectionBridgeProps = {
  eyebrow: string;
  text: string;
  href?: string;
  linkLabel?: string;
};

export function HomeSectionBridge({
  eyebrow,
  text,
  href,
  linkLabel,
}: HomeSectionBridgeProps) {
  return (
    <div className="home-section-bridge" aria-label={eyebrow}>
      <p className="card-eyebrow">{eyebrow}</p>
      <p>
        {text}{" "}
        {href && linkLabel ? (
          <TrackedLink
            href={href}
            trackingEvent="Section Bridge Link Clicked"
            trackingProperties={{ source: eyebrow, destination: href }}
          >
            {linkLabel}
          </TrackedLink>
        ) : null}
      </p>
    </div>
  );
}
