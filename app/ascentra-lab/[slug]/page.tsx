import type { Metadata } from "next";
import LabDetailShell from "./LabDetailShell";
import { notFound } from "next/navigation";
import { labToolMap, labTools } from "../labData";

type LabDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return labTools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: LabDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = labToolMap.get(slug);

  if (!tool) {
    return {
      title: "Ascentra Lab | Experience not found",
    };
  }

  return {
    title: `${tool.title.en} | Ascentra Lab`,
    description: tool.description.en,
  };
}

export default async function LabDetailPage({ params }: LabDetailPageProps) {
  const { slug } = await params;
  const tool = labToolMap.get(slug);

  if (!tool) {
    notFound();
  }

  return <LabDetailShell tool={tool} />;
}
