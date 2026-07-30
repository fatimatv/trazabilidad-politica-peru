import { GitCompareArrows, Network, SearchCheck, ShieldCheck, UploadCloud } from "lucide-react";

const pipeline = [
  ["1. Ingesta", "Se registran planes, debates, discursos, comunicados, notas de prensa, declaraciones, informes y normas con texto original, fuente y fecha."],
  ["2. Normalizacion", "El sistema separa diagnosticos, principios, metas, propuestas, ofrecimientos y medidas para evitar mezclar aspiraciones con compromisos verificables."],
  ["3. Vinculacion", "Cada registro se compara con etapas posteriores para identificar continuidad, reformulacion, matiz, cambio de prioridad, omision o aparicion nueva."],
  ["4. Contraste", "Las relaciones automaticas quedan como preanalisis. Una persona revisora valida si una idea se conserva, cambia, se matiza, desaparece o aparece nueva."],
  ["5. Cumplimiento", "Como el gobierno recien inicia, el estado base es Por cumplir. Cuando aparecen normas, presupuesto, ejecucion o resultados, se vinculan con el compromiso original."],
];

const relationTypes = [
  ["Se conserva", "La idea mantiene problema, direccion y alcance sustantivo entre una etapa y otra."],
  ["Evoluciona / se reformula", "La idea reaparece con mayor detalle, nuevo instrumento o lenguaje diferente, pero conserva direccion general."],
  ["Se matiza", "La propuesta reaparece con menor fuerza, menor plazo, menos precision o condiciones adicionales."],
  ["Cambia prioridad", "La idea sigue presente, pero baja de centralidad o se desplaza hacia otro eje."],
  ["Desaparece", "Una propuesta u ofrecimiento de una etapa no tiene continuidad suficiente en la fuente posterior seleccionada."],
  ["Aparece nueva", "La fuente posterior introduce una idea que no estaba formulada de manera comparable en la fuente inicial."],
];

const safeguards = [
  "La ausencia de evidencia en el sistema no prueba incumplimiento; solo identifica vacios documentales dentro de las fuentes cargadas.",
  "Las coincidencias automaticas no son conclusiones politicas: son rutas de contraste para una persona analista.",
  "Los registros conservan cita o extracto, fuente, tipo documental, sector, estado de cumplimiento y nivel de confianza.",
  "Las nuevas cargas documentales generan preanalisis exportable; no modifican estados de cumplimiento sin revision.",
];

const reviewRoles = [
  ["Analista documental", "Revisa que una nueva carga tenga fuente, fecha, tipo documental y candidatos bien extraidos."],
  ["Revisor juridico/politico", "Valida si una accion posterior acredita cumplimiento, cumplimiento parcial o solo continuidad discursiva."],
  ["Administrador", "Aprueba cambios en compromisos, comparador, grafos, bitacora publica y estado de cumplimiento."],
];

const publicationCriteria = [
  "Fuente identificada y, si existe, URL oficial o archivo primario preservado.",
  "Cita literal o extracto verificable asociado a cada candidato de compromiso.",
  "Clasificacion revisada: diagnostico, principio, propuesta, meta, ofrecimiento, norma o accion de cumplimiento.",
  "Relacion documentada con registros previos: conserva, reformula, matiza, omite, aparece nueva o no comparable.",
  "Estado de cumplimiento definido: por cumplir, iniciativa formal, norma aprobada, presupuesto asignado, ejecucion o resultado verificado.",
];

export default function MethodologyPage() {
  return (
    <>
      <h1>Metodologia</h1>
      <p className="lede">
        Marco de trazabilidad documental para seguir como los compromisos de campana se mantienen, cambian o desaparecen
        cuando aparecen discursos, documentos oficiales, normas y evidencias de implementacion.
      </p>

      <section className="grid cols-3" style={{ marginTop: 22 }}>
        <article className="card metric"><SearchCheck size={20} aria-hidden /><strong>563</strong><span>registros iniciales normalizados</span></article>
        <article className="card metric"><GitCompareArrows size={20} aria-hidden /><strong>6</strong><span>tipos de evolucion documental</span></article>
        <article className="card metric"><ShieldCheck size={20} aria-hidden /><strong>1</strong><span>cita primaria por registro como minimo</span></article>
      </section>

      <section className="card" style={{ marginTop: 22 }}>
        <div className="section-heading compact">
          <div>
            <h2>Pipeline de analisis</h2>
            <p>El objetivo es crear una ruta auditable desde el insumo original hasta la evaluacion de cumplimiento.</p>
          </div>
          <UploadCloud size={24} aria-hidden />
        </div>
        <div className="flow">
          {pipeline.map(([title, body]) => (
            <div key={title}>
              <strong>{title}</strong>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid cols-2" style={{ marginTop: 22 }}>
        <article className="card">
          <h2>Comparador de evolucion</h2>
          <p>
            El comparador no busca solamente coincidencias literales. Contrasta sectores, temas, vocabulario, alcance,
            instrumentos, metas cuantitativas y aparicion temporal para mostrar como una idea cambia entre fuentes.
          </p>
          <div className="timeline">
            {relationTypes.map(([title, body]) => (
              <div className="timeline-item" key={title}>
                <strong>{title}</strong>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <h2>Grafos de trazabilidad</h2>
          <p>
            La seccion de grafos muestra tres capas: fuentes documentales, temas de politica publica y estados de
            evolucion. El grosor de las conexiones representa volumen documental o intensidad de relaciones detectadas.
          </p>
          <p>
            Esta vista sirve para encontrar rapidamente temas sobrerrepresentados, vacios de cobertura y ejes donde las
            propuestas se reformulan con mayor frecuencia.
          </p>
          <Network size={42} aria-hidden />
        </article>
      </section>

      <section className="card" style={{ marginTop: 22 }}>
        <h2>Carga de nuevos documentos</h2>
        <p>
          Desde Administracion se pueden subir o pegar discursos, notas de prensa, declaraciones, comunicados, informes
          o normas. El sistema detecta posibles compromisos, estima tema y tipo, y sugiere vinculos con compromisos
          existentes para que una persona revise continuidad o cumplimiento.
        </p>
      </section>

      <section className="grid cols-2" style={{ marginTop: 22 }}>
        <article className="card">
          <h2>Responsables del seguimiento</h2>
          <div className="timeline">
            {reviewRoles.map(([role, body]) => (
              <div className="timeline-item" key={role}>
                <strong>{role}</strong>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </article>
        <article className="card">
          <h2>Cuando cambia el cumplimiento</h2>
          <p>
            Los compromisos de campana y discursos estan registrados como fuentes documentales. Su cumplimiento cambia
            solo cuando una fuente posterior acredita accion gubernamental, norma, presupuesto, ejecucion o resultado.
          </p>
          <ul>
            {publicationCriteria.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="card" style={{ marginTop: 22 }}>
        <h2>Reglas de seguridad metodologica</h2>
        <ul>
          {safeguards.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
