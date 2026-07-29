# Trazabilidad documental de compromisos presidenciales - Keiko Fujimori

Plataforma web para analizar compromisos publicos desde documentos de campana y gobierno hasta acciones, presupuesto, ejecucion y resultados.

La version actual carga insumos locales de debates, plan de gobierno de Fuerza Popular y mensaje presidencial. El universo inicial incluye 446 registros del plan, 81 declaraciones de debate y ofrecimientos extraidos del mensaje presidencial. No publica conclusiones verificadas; cada cita debe contrastarse con fuentes primarias oficiales antes de pasar a estado revisado o publicado.

## Stack

- Next.js App Router
- TypeScript estricto
- Prisma schema para PostgreSQL
- APIs modulares para fuentes, compromisos y exportacion
- Pruebas con `node --test`

## Instalacion

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run dev
```

Abra `http://localhost:3000`.

## Validacion

```bash
npm run test
npm run typecheck
npm run lint
npm run build
```

## Variables de entorno

- `DATABASE_URL`: conexion PostgreSQL para Prisma.
- `ADMIN_DEMO_TOKEN`: token placeholder para proteger flujos administrativos cuando se conecte autenticacion real.
- `NEXT_PUBLIC_APP_MODE`: use `demo` mientras existan datos simulados.

## Flujos disponibles

- Panel general con universo documental, cobertura e indicadores.
- Explorador con busqueda, filtros, tabla y exportacion CSV/JSON.
- Ficha de compromiso con texto original, normalizacion, evidencia, acciones, comparaciones e historial.
- Comparador de evolucion por par de fuentes: conserva, reformula, matiza, marca omisiones y detecta apariciones nuevas entre plan, debates y mensaje presidencial.
- Linea de tiempo desde compromiso hasta accion.
- Administracion demo para registrar fuente y simular permisos por rol.
- Pagina de metodologia con limites del sistema e IA.

Las rutas `POST /api/sources` y `POST /api/commitments` exigen el header `x-demo-role` con `ADMIN`, `ANALYST` o `REVIEWER`. En produccion debe reemplazarse por autenticacion real.

## Estados de evidencia

Los registros importados desde insumos locales se mantienen como `UNVERIFIED` o `AUTOMATIC`. No deben citarse como hechos verificados. El paso a datos publicados requiere:

1. URL oficial o archivo primario preservado.
2. Cita literal validada.
3. Revision humana.
4. Registro de auditoria.
5. Estado distinto de `DEMO`.
