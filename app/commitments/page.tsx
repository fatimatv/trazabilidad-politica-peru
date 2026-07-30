import { CommitmentFilters } from "@/components/CommitmentFilters";
import { commitments } from "@/lib/demo-data";
import { getSectors } from "@/lib/metrics";

export default function CommitmentsPage() {
  return (
    <>
      <h1>Explorador de compromisos</h1>
      <p className="lede">Busqueda, filtros combinables y exportacion sobre compromisos normalizados con evidencia visible.</p>
      <CommitmentFilters rows={commitments} sectors={getSectors()} />
    </>
  );
}
