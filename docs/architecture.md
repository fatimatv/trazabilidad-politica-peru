# Arquitectura

## Decision principal

Se implementa una aplicacion Next.js con dominio separado en `lib/`, UI en `components/`, rutas en `app/` y modelo persistente en `prisma/schema.prisma`.

La primera version usa dataset local para que el producto sea ejecutable sin base de datos. El schema Prisma ya define la estructura PostgreSQL esperada para migrar a persistencia real sin redisenar las vistas.

## Modulos

- Ingesta: `app/api/sources/route.ts`
- Gestion de compromisos: `app/api/commitments/route.ts`, `app/commitments`
- Normalizacion y metricas: `lib/demo-data.ts`, `lib/metrics.ts`
- Clasificacion y comparacion: `app/compare`, entidad `Comparison`
- Revision humana: `app/admin`, entidades `Review`, `AuditLog`
- Visualizacion: panel, tabla, barras, timeline y flujo de aterrizaje
- Exportacion: `app/api/export/csv`, `app/api/export/json`
- Metodologia: `app/methodology`

## Modelo de datos

El esquema incluye:

- `Source`, `Document`, `DocumentVersion`
- `Speaker`, `Organization`, `Topic`
- `Commitment`, `CommitmentVersion`
- `Comparison`, `Evidence`
- `GovernmentAction`, `LegalInstrument`, `BudgetRecord`
- `Project`, `Work`, `Outcome`
- `Review`, `User`, `AuditLog`

Cada compromiso conserva version, evidencia, estado de verificacion y relaciones. Cada clasificacion registra metodo, autor/modelo, confianza, evidencia a favor/en contra y estado.

## Seguridad

La version demo no almacena credenciales ni secretos. Para produccion:

- Autenticacion real para administradores, analistas y revisores.
- Middleware de control de acceso por rol.
- Validacion de tipos y tamano de archivos.
- Sanitizacion de HTML y contenido enriquecido.
- Registro persistente de acciones sensibles.
- Aislamiento de instrucciones contenidas en documentos para evitar prompt injection.

## IA documental

La IA debe estar detras de una interfaz intercambiable. Los resultados automaticos deben guardar modelo, version de prompt, fecha, entrada, salida, confianza y estado de revision. Ninguna contradiccion sensible pasa a publicada sin revision.
