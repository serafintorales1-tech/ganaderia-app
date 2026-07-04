import { AnimalDetailScreen } from "@/components/animales/animal-detail-screen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ficha animal",
};

export default async function AnimalRoutePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  return <AnimalDetailScreen id={id} />;
}
