import { Guestbook } from "../Guestbook";
import { SectionHeading } from "../SectionHeading";

export function HomeGuestbook() {
  return (
    <section className="content-section guestbook-section" id="guestbook">
      <SectionHeading eyebrow="Guestbook" title="Leave a signal for the wall.">
        Music recommendations, arcade memories, cat stories, Twin Peaks notes,
        site thoughts, and any other small transmission that feels like it
        belongs in the neon forest.
      </SectionHeading>
      <Guestbook />
    </section>
  );
}
