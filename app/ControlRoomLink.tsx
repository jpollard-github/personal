import Link from "next/link";

export function ControlRoomLink() {
  return (
    <Link
      className="control-room-link"
      href="/admin"
      aria-label="Open Control Room"
      title="Control Room"
    >
      <span aria-hidden="true" className="control-room-icon">
        ☕
      </span>
      <span className="control-room-label">Control Room</span>
    </Link>
  );
}
