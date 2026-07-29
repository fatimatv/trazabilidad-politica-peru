import { CompareExplorer } from "@/components/CompareExplorer";
import { commitments, comparisons, sources } from "@/lib/demo-data";

export default function ComparePage() {
  return (
    <>
      <h1>Comparador documental</h1>
      <p className="lede">Cruza debate presidencial, debate tecnico, plan de gobierno y mensaje presidencial con justificacion, evidencia a favor y evidencia en contra.</p>
      <CompareExplorer sources={sources} commitments={commitments} comparisons={comparisons} />
    </>
  );
}
