/**
 * /companions/[id] — full profile for a fictional companion.
 *
 * Built-ins are statically generated from the catalog. Custom companions
 * (Customise Studio) resolve client-side, so dynamicIds stay enabled.
 */
import type { Metadata } from "next";
import { COMPANIONS, getCompanion } from "@/data/companions";
import CompanionProfile from "@/components/companions/CompanionProfile";

export const dynamicParams = true;

export function generateStaticParams() {
  return COMPANIONS.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const c = getCompanion(id);
  if (!c) {
    return id.startsWith("custom-")
      ? { title: "Your custom companion" }
      : { title: "Not found" };
  }
  return {
    title: `${c.name}, ${c.age} — ${c.city}${c.country ? `, ${c.country}` : ""}`,
    description: `${c.name} is a fictional adult AI companion: ${c.archetype}. ${c.backstory.slice(0, 140)}`,
  };
}

export default async function CompanionProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CompanionProfile id={id} />;
}
