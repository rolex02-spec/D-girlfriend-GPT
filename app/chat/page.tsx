/**
 * /chat — legacy entry point.
 *
 * Conversations now open at /chat/[characterId]. This route forwards
 * anyone holding an old bookmark to the catalog.
 */
import { redirect } from "next/navigation";

export default function ChatPage() {
  redirect("/companions");
}
