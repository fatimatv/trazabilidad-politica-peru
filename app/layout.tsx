import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, GitCompareArrows, ListFilter, Network, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { platformTitle } from "@/lib/demo-data";
import "./globals.css";

export const metadata: Metadata = {
  title: platformTitle,
  description: "Plataforma de trazabilidad documental y evaluacion de consistencia de compromisos presidenciales de Keiko Fujimori."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <a className="skip-link" href="#contenido">Saltar al contenido</a>
        <div className="shell">
          <header className="topbar">
            <Link className="brand" href="/" aria-label="Ir al panel principal">
              <img
                src="/brand/ialaw-horizontal-blue-bg.png"
                alt="IALAW Digital Lawyers"
                width="138"
                height="65"
              />
              <span>{platformTitle}</span>
            </Link>
            <nav className="nav" aria-label="Navegacion principal">
              <Link href="/commitments"><ListFilter size={16} aria-hidden />Compromisos</Link>
              <Link href="/compare"><GitCompareArrows size={16} aria-hidden />Comparador</Link>
              <Link href="/graphs"><Network size={16} aria-hidden />Grafos</Link>
              <Link href="/timeline"><BarChart3 size={16} aria-hidden />Linea de tiempo</Link>
              <Link href="/methodology"><ShieldCheck size={16} aria-hidden />Metodologia</Link>
              <Link href="/admin"><SlidersHorizontal size={16} aria-hidden />Admin</Link>
            </nav>
          </header>
          <main id="contenido" className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
