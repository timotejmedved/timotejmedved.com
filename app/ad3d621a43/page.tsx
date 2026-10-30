import type { Metadata } from "next";
import Invite from "./invite";

export const metadata: Metadata = {
  title: "Trening plan 💪",
  description: "Trening plan za ta teden.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } },
};

export default function InvitePage() {
  return (
    <div className="invite-bg flex flex-1 flex-col text-zinc-100">
      <Invite />
    </div>
  );
}
