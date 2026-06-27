"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackEvent } from "./lib/analytics";

type TrackedLinkProps = {
  children: ReactNode;
  className?: string;
  href: string;
  trackingEvent: string;
  trackingProperties?: Record<string, unknown>;
  ariaLabel?: string;
  target?: string;
  rel?: string;
  title?: string;
};

function isInternalHref(href: string) {
  return href.startsWith("/") || href.startsWith("#");
}

export function TrackedLink({
  children,
  className,
  href,
  trackingEvent,
  trackingProperties,
  ariaLabel,
  target,
  rel,
  title,
}: TrackedLinkProps) {
  const handleClick = () => {
    trackEvent(trackingEvent, {
      href,
      ...trackingProperties,
    });
  };

  if (isInternalHref(href)) {
    return (
      <Link
        className={className}
        href={href}
        onClick={handleClick}
        aria-label={ariaLabel}
        target={target}
        rel={rel}
        title={title}
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      className={className}
      href={href}
      onClick={handleClick}
      aria-label={ariaLabel}
      target={target}
      rel={rel}
      title={title}
    >
      {children}
    </a>
  );
}
