export type LawStatus = "Vigente" | "Parz. modificata" | "In attuazione";

export interface Law {
  id: string;
  identifier: string;
  year: number;
  status: LawStatus;
  situazione: string | null;
  title: string;
  description: string;
  nota_operativa: string | null;
  areas: string[];
  link_normattiva: string | null;
  link_normattiva_label: string | null;
  link_gazzetta: string | null;
  link_pdf: string | null;
  sort_order: number;
}

export const AREAS: { value: string; label: string }[] = [
  { value: "tutti", label: "Tutti" },
  { value: "lavoro", label: "Lavoro" },
  { value: "salute", label: "Salute" },
  { value: "accessibilita", label: "Accessibilità" },
  { value: "welfare", label: "Welfare" },
  { value: "istruzione", label: "Istruzione" },
  { value: "internazionale", label: "Internazionale" },
  { value: "previdenza", label: "Previdenza" },
  { value: "trasporti", label: "Trasporti" },
];

export const AREA_LABEL: Record<string, string> = Object.fromEntries(
  AREAS.map((a) => [a.value, a.label]),
);
