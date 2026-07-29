import { CompareExplorer } from "@/components/CompareExplorer";
import { commitments, comparisons, sources } from "@/lib/demo-data";

export default function ComparePage() {
  return (
    <>
      <h1>Comparador de evolucion documental</h1>
      <p className="lede">Sigue como las ideas de campana se conservan, se reformulan, se matizan, aparecen tarde o desaparecen entre plan, debates y mensaje presidencial.</p>
      <CompareExplorer sources={sources} commitments={commitments} comparisons={comparisons} />
    </>
  );
}
