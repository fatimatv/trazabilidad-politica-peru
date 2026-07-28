const sections = [
  ["Que se mide", "Compromisos publicos, orientaciones, diagnosticos, anuncios, medidas y resultados se clasifican por separado para evitar tratar aspiraciones generales como promesas medibles."],
  ["Fuentes", "Se priorizan fuentes primarias: debates oficiales, plan de gobierno, mensajes presidenciales, Diario Oficial, Congreso, MEF, Invierte.pe, SEACE y portales sectoriales."],
  ["Clasificacion", "Cada relacion conserva justificacion, evidencia a favor, evidencia en contra, metodo, confianza, autor o modelo, fecha y estado de revision."],
  ["Uso de IA", "La IA solo propone candidatos, temas, relaciones y resumenes. No puede inventar citas, atribuir intenciones ni publicar contradicciones sensibles sin revision humana."],
  ["Limitaciones", "La ausencia de evidencia en las fuentes incorporadas no prueba inaccion. El sistema muestra vacios, calidad de cobertura y datos faltantes."]
];

export default function MethodologyPage() {
  return (
    <>
      <h1>Metodologia</h1>
      <p className="lede">Sistema de trazabilidad documental y evaluacion de consistencia, no detector de mentiras ni herramienta partidaria.</p>
      <div className="grid cols-2">
        {sections.map(([title, body]) => (
          <section className="card" key={title}>
            <h2>{title}</h2>
            <p>{body}</p>
          </section>
        ))}
      </div>
      <section className="card" style={{ marginTop: 18 }}>
        <h2>Indice configurable de consistencia</h2>
        <p>Formula demo: 35% coincidencia documental revisada + 25% accion identificada + 20% respaldo presupuestal + 20% resultado verificable. Las ponderaciones son editables y pueden desactivarse; se muestran datos faltantes y advertencias de cobertura.</p>
      </section>
    </>
  );
}
