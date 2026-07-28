import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, GitCompareArrows, Landmark, ListFilter, ShieldCheck, SlidersHorizontal } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trazabilidad politica Peru",
  description: "Plataforma de trazabilidad documental y evaluacion de consistencia de compromisos publicos."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <a className="skip-link" href="#contenido">Saltar al contenido</a>
        <div className="shell">
          <header className="topbar">
            <Link className="brand" href="/" aria-label="Ir al panel principal">
              <span className="mark"><Landmark size={20} aria-hidden /></span>
              <span>Trazabilidad politica Peru</span>
            </Link>
            <nav className="nav" aria-label="Navegacion principal">
              <Link href="/commitments"><ListFilter size={16} aria-hidden />Compromisos</Link>
              <Link href="/compare"><GitCompareArrows size={16} aria-hidden />Comparador</Link>
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
