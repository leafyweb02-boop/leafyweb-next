import { notFound } from "next/navigation";
import TemplatePreviewLayout from "@/components/TemplatePreviewLayout";
import {
  previewTemplateMap,
  type TemplatePreviewKey,
} from "@/components/templatePreviewData";

interface PreviewPageProps {
  params: Promise<{ template: string }>;
}

export default async function TemplatePreviewPage({
  params,
}: PreviewPageProps) {
  const { template } = await params;
  const preview = previewTemplateMap.get(template as TemplatePreviewKey);

  if (!preview) {
    notFound();
  }

  return <TemplatePreviewLayout preview={preview} />;
}
